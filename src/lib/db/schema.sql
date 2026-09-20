-- PostgreSQL schema for the commercial V1.
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  password_hash text not null,
  role text not null default 'customer' check (role in ('customer','admin')),
  created_at timestamptz not null default now()
);
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique, expires_at timestamptz not null, created_at timestamptz not null default now()
);
create table if not exists products (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, category text not null,
  description text not null default '', price numeric(12,2) not null check (price >= 0), stock integer not null default 0 check (stock >= 0),
  image_url text, active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists orders (
  id uuid primary key default gen_random_uuid(), user_id uuid references users(id) on delete set null,
  status text not null default 'pending' check (status in ('pending','confirmed','preparing','shipped','cancelled')),
  total numeric(12,2) not null check (total >= 0), guest_name text, guest_email text, guest_phone text, guest_address text,
  accepted_terms_at timestamptz, payment_status text not null default 'pending', payment_provider text,
  payment_order_id text, payment_status_detail text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists order_items (
  id uuid primary key default gen_random_uuid(), order_id uuid not null references orders(id) on delete cascade,
  product_id uuid not null references products(id), product_name text not null, unit_price numeric(12,2) not null check (unit_price >= 0), quantity integer not null check (quantity > 0)
);
alter table orders add column if not exists accepted_terms_at timestamptz;
alter table orders add column if not exists payment_status text not null default 'pending';
alter table orders add column if not exists payment_provider text;
alter table orders add column if not exists payment_order_id text;
alter table orders add column if not exists payment_status_detail text;
create unique index if not exists orders_payment_order_id_idx on orders(payment_order_id) where payment_order_id is not null;
create index if not exists sessions_user_id_idx on sessions(user_id);
create index if not exists products_category_idx on products(category);
create index if not exists orders_user_id_idx on orders(user_id);
create index if not exists orders_status_idx on orders(status);
create index if not exists orders_payment_status_idx on orders(payment_status);
create index if not exists orders_guest_email_idx on orders(guest_email);
create index if not exists orders_guest_phone_idx on orders(guest_phone);
