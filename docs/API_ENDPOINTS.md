# API_ENDPOINTS — как мы работаем с данными и функциями

> В Supabase часто нет “своего REST сервера”: мы работаем через `supabase-js` к Postgres, а серверную логику делаем через Edge Functions при необходимости.

## 1) Клиентские операции (supabase-js)

### 1.1. Auth
- `signUp({ email, password })`
- `signInWithPassword({ email, password })`
- `signOut()`
- `getSession()`

### 1.2. Profiles
- `from('profiles').select('*').eq('id', user.id).single()`
- `from('profiles').update({...}).eq('id', user.id)`

### 1.3. Orgs / Memberships
- `from('organizations').insert({ name, owner_id })`
- `from('memberships').insert({ org_id, user_id, role })`
- `from('memberships').select('role').eq('org_id', orgId).eq('user_id', uid)`

### 1.4. Orders
- list: `from('orders').select('*').eq('org_id', orgId).order('deadline_at')`
- create: `insert`
- update status: `update({ status })`
- details: `select` + join (или несколько запросов)

### 1.5. Routing / Stages
- create routing: `from('order_routings').insert({ order_id })`
- create stages: `from('routing_stages').insert([...])`
- update stage: `update({ status, started_at, finished_at })`

### 1.6. Tasks
- board: `from('tasks').select('*').eq('org_id', orgId).eq('status','todo')`
- assign: `update({ assignee_id })`
- events: `insert task_events`

### 1.7. Chat
- create thread: `insert`
- messages: `select` + pagination
- send message: `insert`

### 1.8. Storage
- upload:
  - `storage.from('attachments').upload(path, file)`
- get URL:
  - public: `getPublicUrl`
  - private: `createSignedUrl`

> Ключевой момент: **anon key безопасен только при RLS**. citeturn0search6turn0search17

---

## 2) Realtime subscriptions

- `supabase.channel('orders').on('postgres_changes', ...)`
- `... invalidateQueries(['orders', orgId])`
- отдельные каналы:
  - orders
  - tasks
  - chat_messages

---

## 3) Edge Functions (серверные эндпоинты)

Когда нужны:
- AI прокси (чтобы не светить ключи модели)
- webhooks (телега/почта)
- тяжёлые операции (генерация превью, pdf и т.п.)

Supabase docs: Edge functions keys/URL и где брать API keys в dashboard. citeturn0search17

### 3.1. Примерные функции
- `POST /functions/v1/ai/suggest-routing`
- `POST /functions/v1/ai/qc-checklist`
- `POST /functions/v1/ai/parse-order-text`
- `POST /functions/v1/files/generate-preview` (позже)

---

## 4) Стандарты ответов API (для функций)

### JSON envelope
```json
{
  "ok": true,
  "data": {},
  "error": null,
  "meta": { "requestId": "..." }
}
```

---

## 5) Ошибки / коды
- 401 — нет сессии
- 403 — RLS запретил
- 422 — валидация
- 500 — внутреннее

---

## 6) Rate limiting / стоимость (AI)
- лимитируем по user_id/org_id
- логируем usage
