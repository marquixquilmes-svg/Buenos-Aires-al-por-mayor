import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { getDb } from './client';

export async function runInitialMigration() {
  const sql = await readFile(path.join(process.cwd(), 'src/lib/db/schema.sql'), 'utf8');
  await getDb().query('create extension if not exists pgcrypto');
  await getDb().query(sql);
}
