import { Pool } from 'pg';

let pool: Pool | undefined;
let migrationPromise: Promise<void> | undefined;

function getConnectionString() {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.NEON_DATABASE_URL
  );
}

function withSecureSslMode(connectionString: string) {
  if (!connectionString.includes('sslmode=')) {
    return `${connectionString}${connectionString.includes('?') ? '&' : '?'}sslmode=verify-full`;
  }
  return connectionString;
}

async function migrateDatabase(db: Pool) {
  // Idempotent production migration for the Mercado Pago order fields.
  // PostgreSQL executes each ALTER safely when the column already exists.
  await db.query(`
    ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS payment_status TEXT NOT NULL DEFAULT 'pending',
      ADD COLUMN IF NOT EXISTS payment_provider TEXT,
      ADD COLUMN IF NOT EXISTS payment_order_id TEXT,
      ADD COLUMN IF NOT EXISTS payment_status_detail TEXT;

    CREATE INDEX IF NOT EXISTS orders_payment_order_id_idx
      ON orders (payment_order_id);

    CREATE INDEX IF NOT EXISTS orders_payment_status_idx
      ON orders (payment_status);

    CREATE TABLE IF NOT EXISTS quote_requests (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL CHECK (quantity > 0),
      reference_url TEXT,
      delivery_address TEXT NOT NULL,
      phone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','quoted','payment_pending','paid','preparing','shipped','delivered','cancelled')),
      item_price NUMERIC(12,2),
      shipping_price NUMERIC(12,2),
      quote_note TEXT,
      quote_expires_at TIMESTAMPTZ,
      payment_order_id TEXT UNIQUE,
      payment_status_detail TEXT,
      tracking TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS quote_requests_user_idx ON quote_requests(user_id, created_at DESC);
    ALTER TABLE quote_requests ALTER COLUMN user_id DROP NOT NULL;
  `);
}

export function getDb() {
  const connectionString = getConnectionString();
  if (!connectionString) throw new Error('DATABASE_URL is required to use the database');

  pool ??= new Pool({
    connectionString: withSecureSslMode(connectionString),
    max: 10,
    connectionTimeoutMillis: 10000,
  });

  migrationPromise ??= migrateDatabase(pool).catch((error) => {
    migrationPromise = undefined;
    throw error;
  });

  return pool;
}

export async function ensureDatabaseReady() {
  const db = getDb();
  await migrationPromise;
  return db;
}
