import { Pool } from 'pg';

let pool: Pool | undefined;

function getConnectionString() {
  // Vercel/Neon can expose the connection under different standard names
  // depending on how the integration/environment variable was created.
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.POSTGRES_URL_NON_POOLING ||
    process.env.DATABASE_URL_UNPOOLED ||
    process.env.NEON_DATABASE_URL
  );
}

function withSecureSslMode(connectionString: string) {
  // Keep certificate/hostname verification explicit so future pg versions
  // do not silently change the security semantics of the connection string.
  if (!connectionString.includes('sslmode=')) {
    return `${connectionString}${connectionString.includes('?') ? '&' : '?'}sslmode=verify-full`;
  }
  return connectionString;
}

export function getDb() {
  const connectionString = getConnectionString();

  if (!connectionString) {
    throw new Error('DATABASE_URL is required to use the database');
  }

  pool ??= new Pool({
    connectionString: withSecureSslMode(connectionString),
    max: 10,
    connectionTimeoutMillis: 10000,
  });

  return pool;
}
