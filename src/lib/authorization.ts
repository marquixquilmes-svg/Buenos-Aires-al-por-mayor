export type UserRole = 'customer' | 'admin';

export function canAccessAdmin(role: UserRole | null | undefined) {
  return role === 'admin';
}

export function canManageProducts(role: UserRole | null | undefined) {
  return role === 'admin';
}

export function canManageOrder(role: UserRole | null | undefined) {
  return role === 'admin';
}
