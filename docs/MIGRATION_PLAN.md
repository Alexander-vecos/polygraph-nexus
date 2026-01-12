# MIGRATION_PLAN — план миграций Supabase

Цель: зафиксировать порядок миграций и зависимости между таблицами, чтобы перейти от проектной схемы к фактическим SQL‑миграциям.

## Принципы
- Каждая миграция — небольшая и атомарная.
- Сначала создаём базовые сущности и связи, затем доменные таблицы, потом индексы и RLS.
- RLS включаем после того, как готовы таблицы и вспомогательные функции.

---

## Этап 1: Базовые сущности и доступ
**Миграция:** `0001_profiles_organizations_memberships`

1. `profiles`
2. `organizations`
3. `memberships`
4. Индексы для `organizations.owner_id`, `memberships.org_id`, `memberships.user_id`

**Основание:** фундамент для орг‑структуры и RLS‑контур. (см. DATABASE_SCHEMA)

---

## Этап 2: Производственная структура
**Миграция:** `0002_facilities_sectors_equipment`

1. `facilities`
2. `sectors`
3. `equipment`
4. Индексы по связям `org_id`, `facility_id`, `sector_id`

---

## Этап 3: Клиенты и заказы
**Миграция:** `0003_clients_orders`

1. `clients`
2. `orders`
3. Индексы по `org_id`, `client_id`, `status`, `deadline_at`

---

## Этап 4: Роутинг и QC
**Миграция:** `0004_order_routings_routing_stages_qc`

1. `order_routings`
2. `routing_stages`
3. `qc_checklists`
4. Индексы по `routing_id`, `sector_id`, `order_id`

---

## Этап 5: Канбан и аудит
**Миграция:** `0005_tasks_task_events`

1. `tasks`
2. `task_events`
3. Индексы по `org_id`, `order_id`, `assignee_id`, `status`, `task_id`

---

## Этап 6: Коммуникации и вложения
**Миграция:** `0006_chat_threads_chat_messages_attachments`

1. `chat_threads`
2. `chat_messages`
3. `attachments`
4. Индексы по `org_id`, `order_id`, `task_id`, `message_id`
5. Уникальный индекс `attachments(bucket, path)`

---

## Этап 7: RLS и вспомогательные функции
**Миграция:** `0007_rls_policies`

1. Функция `user_has_org(p_org uuid)`
2. Включение RLS по таблицам
3. Минимальные политики `select` для базовых таблиц

---

## Этап 8: Склад (MVP‑2)
**Миграция:** `0008_materials_inventory`

1. `materials`
2. `inventory_items`
3. Индексы по `org_id`, `material_id`

---

## Проверки после миграций
- Прогон `supabase db reset` локально.
- Smoke‑проверка запросов из `API_ENDPOINTS.md`.
- Валидация RLS: anon key без доступа к чужим `org_id`.
