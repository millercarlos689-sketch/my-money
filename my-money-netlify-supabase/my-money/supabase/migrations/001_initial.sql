-- My Money single-owner schema. No browser access to tables is granted.
create extension if not exists pgcrypto;
create table if not exists public.transactions (
 id uuid primary key default gen_random_uuid(),
 kind text not null check (kind in ('income','expense')),
 title text not null,
 amount bigint not null check (amount > 0),
 category text not null,
 priority text not null default 'Primer' check(priority in ('Primer','Sekunder')),
 date date not null default current_date,
 note text,
 created_at timestamptz not null default now()
);
create table if not exists public.living_essentials (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 priority text not null default 'Primer' check(priority in ('Primer','Sekunder')),
 estimate bigint not null default 0 check(estimate >= 0),
 status text not null default 'Belum dibeli' check(status in ('Belum dibeli','Menabung','Siap dibeli','Dibeli')),
 created_at timestamptz not null default now()
);
create table if not exists public.savings_goals (
 id uuid primary key default gen_random_uuid(),
 name text not null,
 target bigint not null check(target > 0),
 saved bigint not null default 0 check(saved >= 0),
 created_at timestamptz not null default now()
);
-- Access only through the password-protected Edge Function using service role.
alter table public.transactions enable row level security;
alter table public.living_essentials enable row level security;
alter table public.savings_goals enable row level security;
revoke all on public.transactions, public.living_essentials, public.savings_goals from anon, authenticated;
