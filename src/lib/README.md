# Domain layer

Business rules live here so the UI does not become the source of truth.

- `auth.ts` — session-token primitives.
- `password.ts` — salted password hashing/verification.
- `authorization.ts` — role-based access rules.
- `checkout.ts` — cart validation and totals.
- `stock.ts` — stock validation/reservation rules.
- `catalog.ts` — temporary development catalog.

Production persistence belongs behind these boundaries and must validate prices and stock on the server.
