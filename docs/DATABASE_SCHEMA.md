# DATABASE_SCHEMA — схема БД (Supabase / Postgres)

> Это **проектная схема**. В реализации мы оформим это как миграции Supabase (`supabase/migrations/*.sql`). citeturn0search14

## 0) Почему схема важнее UI

UI можно переделать за неделю.
Плохая схема БД — будет ломать всё годами.

Поэтому:
- нормализуем сущности (где нужно)
- фиксируем связи
- делаем индексы
- сразу проектируем RLS (хотя бы каркас) citeturn0search6

---

## 1) Базовые таблицы (Org, users, memberships)

### 1.1. profiles
Supabase Auth хранит пользователей в `auth.users`. Обычно делают таблицу `profiles`.

```sql
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

### 1.2. organizations
```sql
create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  owner_id uuid not null references public.profiles(id),
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.organizations(owner_id);
```

### 1.3. memberships
Кто в какой организации и с какой ролью.

```sql
create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('owner','admin','manager','worker','viewer')),
  created_at timestamptz default now(),
  unique(org_id, user_id)
);
create index on public.memberships(org_id);
create index on public.memberships(user_id);
```

---

## 2) Производственная структура (Facilities, Sectors, Equipment)

### 2.1. facilities
```sql
create table public.facilities (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  address text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.facilities(org_id);
```

### 2.2. sectors
Сектор = участок/цех (шелкография, регенерация, подготовка, супервайзер и т.д.)

```sql
create table public.sectors (
  id uuid primary key default gen_random_uuid(),
  facility_id uuid not null references public.facilities(id) on delete cascade,
  name text not null,
  sector_type text, -- можно потом сделать enum/справочник
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.sectors(facility_id);
```

### 2.3. equipment
```sql
create table public.equipment (
  id uuid primary key default gen_random_uuid(),
  sector_id uuid references public.sectors(id) on delete set null,
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  equipment_type text,
  model text,
  status text not null default 'active',
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.equipment(org_id);
create index on public.equipment(sector_id);
```

---

## 3) Клиенты и заказы

### 3.1. clients
```sql
create table public.clients (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  contact_name text,
  phone text,
  email text,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.clients(org_id);
```

### 3.2. orders
```sql
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid references public.clients(id) on delete set null,

  accounting_number text, -- № из бухгалтерии (например 00НФ-006482)
  title text not null,    -- короткое название
  description text,
  priority int default 0,

  status text not null default 'draft'
    check (status in ('draft','confirmed','in_production','qc','packed','shipped','closed','canceled','rework')),

  deadline_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  manager_id uuid references public.profiles(id) on delete set null,

  meta jsonb default '{}'::jsonb, -- атрибуты изделия (тип, материал, размер, тираж, цвета и т.д.)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on public.orders(org_id);
create index on public.orders(client_id);
create index on public.orders(status);
create index on public.orders(deadline_at);
```

---

## 4) Роутинг заказов (маршруты, этапы, QC)

### 4.1. order_routings
```sql
create table public.order_routings (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  name text default 'default',
  created_at timestamptz default now()
);
create index on public.order_routings(order_id);
```

### 4.2. routing_stages
```sql
create table public.routing_stages (
  id uuid primary key default gen_random_uuid(),
  routing_id uuid not null references public.order_routings(id) on delete cascade,
  seq int not null, -- порядок этапа
  sector_id uuid references public.sectors(id) on delete set null,
  stage_type text not null, -- print/cut/assemble/qc/ship etc
  title text not null,
  status text not null default 'todo'
    check (status in ('todo','in_progress','blocked','done','skipped')),
  started_at timestamptz,
  finished_at timestamptz,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(routing_id, seq)
);
create index on public.routing_stages(routing_id);
create index on public.routing_stages(sector_id);
```

### 4.3. qc_checklists (опционально MVP‑2)
```sql
create table public.qc_checklists (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  stage_id uuid references public.routing_stages(id) on delete set null,
  title text not null,
  items jsonb not null, -- [{text, ok, note, photo_attachment_id}]
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
```

---

## 5) Канбан / задачи

### 5.1. tasks
```sql
create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  stage_id uuid references public.routing_stages(id) on delete set null,

  title text not null,
  description text,
  status text not null default 'todo'
    check (status in ('todo','in_progress','blocked','done')),
  priority int default 0,

  assignee_id uuid references public.profiles(id) on delete set null,
  due_at timestamptz,

  labels text[] default '{}'::text[],
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index on public.tasks(org_id);
create index on public.tasks(order_id);
create index on public.tasks(assignee_id);
create index on public.tasks(status);
```

### 5.2. task_events (аудит)
```sql
create table public.task_events (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  payload jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index on public.task_events(task_id);
```

---

## 6) Коммуникация: треды и сообщения

### 6.1. chat_threads
```sql
create table public.chat_threads (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  order_id uuid references public.orders(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  title text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);
create index on public.chat_threads(org_id);
create index on public.chat_threads(order_id);
create index on public.chat_threads(task_id);
```

### 6.2. chat_messages
```sql
create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.chat_threads(id) on delete cascade,
  author_id uuid references public.profiles(id) on delete set null,
  body text not null,
  attachments jsonb default '[]'::jsonb, -- можно потом нормализовать
  created_at timestamptz default now()
);
create index on public.chat_messages(thread_id);
create index on public.chat_messages(author_id);
```

---

## 7) Медиа / вложения

### 7.1. attachments
```sql
create table public.attachments (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,

  bucket text not null,
  path text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,

  order_id uuid references public.orders(id) on delete cascade,
  task_id uuid references public.tasks(id) on delete cascade,
  message_id uuid references public.chat_messages(id) on delete cascade,

  meta jsonb default '{}'::jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz default now()
);

create index on public.attachments(org_id);
create index on public.attachments(order_id);
create index on public.attachments(task_id);
create index on public.attachments(message_id);
create unique index attachments_bucket_path_unique on public.attachments(bucket, path);
```

---

## 8) Склад (MVP‑2+): материалы, банки, резервы, списания

> Мы оставляем это как расширение, но каркас держим в голове.

### 8.1. materials
```sql
create table public.materials (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  name text not null,
  material_type text,
  unit text not null default 'pcs',
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.materials(org_id);
```

### 8.2. inventory_items
```sql
create table public.inventory_items (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references public.organizations(id) on delete cascade,
  facility_id uuid references public.facilities(id) on delete set null,
  material_id uuid not null references public.materials(id) on delete cascade,

  qty numeric not null default 0,
  reserved_qty numeric not null default 0,
  meta jsonb default '{}'::jsonb,

  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(org_id, facility_id, material_id)
);
create index on public.inventory_items(org_id);
create index on public.inventory_items(material_id);
```

### 8.3. reservations / writeoffs / movements
(каркас, без полного DDL — добавим когда придём к складу)

---

## 9) RLS (каркас)

**Важно**: безопасность в Supabase завязана на RLS и ролях. При использовании anon key в браузере нужно включать RLS на таблицах и писать политики. citeturn0search6turn0search17

### Пример подхода (идея)
- `memberships` определяет доступ
- политика: пользователь видит строки, где `org_id` принадлежит org, в котором он состоит

```sql
-- Пример функции-помощника
create or replace function public.user_has_org(p_org uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from public.memberships m
    where m.org_id = p_org and m.user_id = auth.uid()
  );
$$;

-- Пример политики для orders
alter table public.orders enable row level security;

create policy "orders: read org members"
on public.orders for select
using (public.user_has_org(org_id));
```

---

## 10) Миграции и сиды

- Миграции: `supabase migration new ...` citeturn0search14
- Локальный стек: `supabase init`, `supabase start` citeturn0search4
- Сиды (seed data) — отдельный механизм Supabase docs citeturn0search10
