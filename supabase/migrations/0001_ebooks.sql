-- Ebook sales: orders, one per Stripe Checkout Session, and a log of
-- every time a paid buyer actually downloads a file.

create extension if not exists pgcrypto;

create table if not exists ebook_orders (
  id uuid primary key default gen_random_uuid(),
  book_slug text not null,
  email text,
  stripe_session_id text unique not null,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  amount_cents integer not null,
  currency text not null default 'usd',
  download_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  paid_at timestamptz
);

create index if not exists ebook_orders_download_token_idx on ebook_orders (download_token);
create index if not exists ebook_orders_book_slug_idx on ebook_orders (book_slug);

create table if not exists ebook_download_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references ebook_orders (id) on delete cascade,
  file_format text not null,
  downloaded_at timestamptz not null default now(),
  user_agent text
);

create index if not exists ebook_download_events_order_id_idx on ebook_download_events (order_id);

-- Row Level Security: these tables are only ever touched by edge functions
-- using the service role key, never directly from the browser.
alter table ebook_orders enable row level security;
alter table ebook_download_events enable row level security;
