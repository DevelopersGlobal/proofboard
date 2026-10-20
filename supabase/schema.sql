-- TrueTop schema. Run once in the Supabase SQL editor.

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  slug text unique not null,
  name text not null,
  url text not null,
  domain text not null,
  tagline text not null,
  category text not null default 'other',
  tags text[] not null default '{}',
  platforms text[] not null default '{}',
  logo_url text,
  verification_token text unique not null,
  verified_at timestamptz,
  badge_live boolean not null default false,
  badge_last_checked timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists votes (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products not null,
  user_id uuid references auth.users not null,
  created_at timestamptz not null default now(),
  unique (product_id, user_id)
);

alter table products enable row level security;
alter table votes enable row level security;

create policy "products are readable by everyone" on products for select using (true);
create policy "makers insert their own products" on products for insert with check (auth.uid() = user_id);
create policy "votes are readable by everyone" on votes for select using (true);
create policy "signed-in users vote" on votes for insert with check (auth.uid() = user_id);
create policy "users remove their own vote" on votes for delete using (auth.uid() = user_id);

create index if not exists products_created_at_idx on products (created_at desc);
create index if not exists votes_product_idx on votes (product_id);
