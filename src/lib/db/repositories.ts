import { getDb } from './client';

export async function findUserByEmail(email: string) {
  const result = await getDb().query('select id, email, password_hash, role from users where email = $1 limit 1', [email]);
  return result.rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string) {
  const name = email.split('@')[0] || 'Cliente';
  const result = await getDb().query(
    'insert into users (email, password_hash, name) values ($1, $2, $3) returning id, email, role',
    [email, passwordHash, name],
  );
  return result.rows[0];
}

export async function updateAdminUser(email: string, passwordHash: string) {
  const name = 'Buenos Aires al por mayor';
  const result = await getDb().query(
    `insert into users (email, password_hash, name, role)
     values ($1, $2, $3, 'admin')
     on conflict (email) do update
       set password_hash = excluded.password_hash, name = excluded.name, role = 'admin'
     returning id, email, role`,
    [email, passwordHash, name],
  );
  return result.rows[0];
}

export async function createSession(userId: string, tokenHash: string, expiresAt: string) {
  const result = await getDb().query(
    `insert into sessions (id, user_id, token_hash, expires_at)
     values (gen_random_uuid()::text, $1, $2, $3)
     returning id, expires_at`,
    [userId, tokenHash, expiresAt],
  );
  return result.rows[0];
}

export async function findSessionByTokenHash(tokenHash: string) {
  const result = await getDb().query(
    `select s.id, s.user_id, s.expires_at, u.email, u.role
     from sessions s join users u on u.id = s.user_id
     where s.token_hash = $1 and s.expires_at > now() limit 1`,
    [tokenHash],
  );
  return result.rows[0] ?? null;
}

export async function deleteSessionByTokenHash(tokenHash: string) {
  await getDb().query('delete from sessions where token_hash = $1', [tokenHash]);
}

export async function listAdminOrders() {
  const result = await getDb().query(
    `select
       o.id,
       o.status,
       o.total,
       o.guest_name,
       o.guest_email,
       o.guest_phone,
       o.guest_address,
       o.accepted_terms_at,
       o.payment_status,
       o.payment_provider,
       o.payment_order_id,
       o.payment_status_detail,
       o.created_at,
       o.updated_at,
       coalesce(
         jsonb_agg(
           jsonb_build_object(
             'productName', oi.product_name,
             'quantity', oi.quantity,
             'unitPrice', oi.unit_price
           ) order by oi.product_name
         ) filter (where oi.id is not null),
         '[]'::jsonb
       ) as items
     from orders o
     left join order_items oi on oi.order_id = o.id
     group by o.id
     order by o.created_at desc`,
  );

  return result.rows;
}
