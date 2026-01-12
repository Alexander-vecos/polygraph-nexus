-- Core schema (MVP)
create extension if not exists "pgcrypto";

-- 1) profiles (1:1 with auth.users)
create table if not exists public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2) organizations
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid not null references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) memberships
create table if not exists public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null check (role in ('owner','manager','viewer')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

-- updated_at helper
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists trg_orgs_updated_at on public.organizations;
create trigger trg_orgs_updated_at
before update on public.organizations
for each row execute function public.set_updated_at();

-- RLS on
alter table public.profiles enable row level security;
alter table public.organizations enable row level security;
alter table public.memberships enable row level security;

-- RLS policies (MVP)
-- profiles: user can read/update own profile
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
for select using (auth.uid() = user_id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
for update using (auth.uid() = user_id);

-- organizations: user can select orgs where they are a member
drop policy if exists "orgs_select_member" on public.organizations;
create policy "orgs_select_member" on public.organizations
for select using (
  exists (
    select 1 from public.memberships m
    where m.org_id = organizations.id and m.user_id = auth.uid()
  )
);

-- memberships: user can select their memberships
drop policy if exists "memberships_select_own" on public.memberships;
create policy "memberships_select_own" on public.memberships
for select using (auth.uid() = user_id);
