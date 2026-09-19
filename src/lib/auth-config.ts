export const AUTH_CONFIG = {
  sessionDays: 30,
  cookieName: 'baam_session',
  passwordMinLength: 8,
} as const;

export function assertAuthSecret() {
  if (!process.env.AUTH_SECRET) {
    throw new Error('AUTH_SECRET is required for production authentication');
  }
}
