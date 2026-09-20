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
