import { Pool } from 'pg';

let pool: Pool | undefined;

export function getDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required to use the database');
  }
  pool ??= new Pool({ connectionString: process.env.DATABASE_URL, max: 10 });
  return pool;
}
