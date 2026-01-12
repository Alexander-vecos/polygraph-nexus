# COMPONENTS — компоненты системы (модули + UI)

## 1) Модули приложения

### 1.1. Auth Module
- Login / Register
- Session restore
- Profile setup
- (опционально) OAuth providers

### 1.2. Org Setup Module
- Organizations list
- Create org
- Facilities CRUD
- Sectors CRUD
- Memberships management

### 1.3. Orders Module
- Orders list (filters: status, deadline, client, priority)
- Order details
- Status transitions
- Attachments
- Routing editor

### 1.4. Routing Module
- Routing templates
- Stage list with drag‑reorder
- Stage status changes
- QC hooks

### 1.5. Kanban / Tasks Module
- Board by sector
- My tasks
- Task detail
- Audit events (history)

### 1.6. Chat Module
- Threads per order/task
- Messages
- Attachments
- Realtime updates

### 1.7. Storage Module
- Upload UI
- Preview generation (опционально)
- Attachment metadata

### 1.8. Offline Module
- Service worker
- Cache strategies
- IndexedDB sync queue

### 1.9. AI Dev Sandbox Module (позже)
- Prompt templates
- Generate forms / routes / checklists
- “Explain system” (AI helper)

---

## 2) UI структуры и навигация (предложение)

### 2.1. Desktop layout
- Left sidebar:
  - Org switcher
  - Orders
  - Tasks
  - Facilities/Sectors
  - Inventory (позже)
  - Settings
- Main content: pages
- Right panel (optional):
  - context chat / notes

### 2.2. Mobile layout
- Bottom nav:
  - Orders
  - Tasks
  - Chat
  - Search
  - Menu/Settings (modal)

---

## 3) Pages (экраны)

- `/auth/login`
- `/auth/register`
- `/app` (dashboard)
- `/app/orders`
- `/app/orders/:id`
- `/app/tasks`
- `/app/tasks/:id`
- `/app/facilities`
- `/app/sectors`
- `/app/chat/:threadId`
- `/app/settings`

---

## 4) Компоненты (React)

### 4.1. Atomic / UI
- Button, IconButton
- Modal / Drawer
- Tabs
- Input, Select, DatePicker
- Table / DataGrid (виртуализация для больших списков)
- Badge / StatusPill
- Toast / Notifications

### 4.2. Domain widgets
- OrderCard
- OrderStatusStepper
- RoutingStageList
- KanbanBoard
- TaskCard
- ChatThread
- AttachmentList
- QCChecklist

---

## 5) State management (рекомендация)

MVP можно:
- React Query / TanStack Query для запросов
- Zustand для UI‑состояний
- Supabase Realtime → invalidate queries

---

## 6) Соглашения по коду (Linux + VS Code)

- `eslint` + `prettier`
- absolute imports alias (`@/`)
- строгий TS
- папки:
  - `src/pages`
  - `src/features/*` (orders, tasks, chat)
  - `src/shared/*` (ui, lib, types)
  - `src/services/supabase`
  - `src/offline`

---

## 7) Набор решений “по умолчанию”

- Файлы:
  - Storage bucket `attachments`
  - table `attachments` хранит метаданные
- Чаты:
  - threads создаём по order/task
- Роутинг:
  - stage seq и stage_type обязательны
