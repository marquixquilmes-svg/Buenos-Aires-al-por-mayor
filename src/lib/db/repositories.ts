import { getDb } from './client';

export async function findUserByEmail(email: string) {
  const result = await getDb().query('select id, email, password_hash, role from users where email = $1 limit 1', [email]);
  return result.rows[0] ?? null;
}

export async function createUser(email: string, passwordHash: string) {
  const result = await getDb().query(
    'insert into users (email, password_hash) values ($1, $2) returning id, email, role',
    [email, passwordHash],
  );
  return result.rows[0];
}

export async function createSession(userId: string, tokenHash: string, expiresAt: string) {
  const result = await getDb().query(
    'insert into sessions (user_id, token_hash, expires_at) values ($1, $2, $3) returning id, expires_at',
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
