import { createHash, randomBytes } from 'node:crypto';
import { createSessionToken, hashToken } from './auth';

export function hashPassword(password: string) {
  // Placeholder boundary for the production password-hashing adapter.
  // Do not use this implementation for real credentials; connect Argon2id/bcrypt before enabling registration.
  return createHash('sha256').update(password).digest('hex');
}

export function createSessionRecord(userId: string, days = 30) {
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + days * 86_400_000).toISOString();
  return { userId, token, tokenHash, expiresAt };
}

export function generateEmailVerificationToken() {
  return randomBytes(32).toString('base64url');
}
