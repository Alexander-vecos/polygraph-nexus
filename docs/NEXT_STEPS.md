# NEXT_STEPS — старт «с нуля» (Linux + VS Code + Supabase)

> Это пошаговая «дорожка» от полного нуля: **Google → GitHub → Supabase → локальная разработка → первые миграции → первый экран**.  
> Мы намеренно пишем максимально подробно, без сокращений.

---

## 0) Предпосылки и допущения

- ОС: Linux (Mint/Ubuntu‑подобное)
- Редактор: VS Code
- Проект пока запускается **локально** (без деплоя). Деплой добавим позже.
- Стек: React + TypeScript + Vite + Supabase
- PWA: через Vite PWA (vite-plugin-pwa) citeturn0search20

---

## 1) Google Account (если нет — создаём)

1. Открой создание Google account.
2. Создай отдельный аккаунт «под разработку/проекты» (не обязательно, но удобно):
   - нормальная почта = проще доступы/ключи.
3. Включи двухфакторку (желательно).
4. Сохрани recovery codes.

---

## 2) GitHub: регистрация через Google

### 2.1. Создание аккаунта
1. Открой страницу входа GitHub.
2. Там есть кнопка **Continue with Google**. citeturn0search8
3. Нажми → авторизуйся Google → создай аккаунт GitHub.
4. Сразу настрой:
   - username (аккуратный, без рандома)
   - email (Google)
   - 2FA (желательно)

### 2.2. SSH ключи (лучше, чем пароль)
В терминале Linux:

```bash
ssh-keygen -t ed25519 -C "your_email@gmail.com"
# Enter → Enter → (пароль по желанию)
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

Скопируй публичный ключ и добавь в GitHub:
- Settings → SSH and GPG keys → New SSH key.

Проверка:
```bash
ssh -T git@github.com
```

---

## 3) Установка базового окружения на Linux

### 3.1. Git
```bash
sudo apt update
sudo apt install -y git
git --version
```

### 3.2. Node.js (LTS)
Вариант A (через nvm — рекомендуемо):
```bash
# 1) установить nvm (см. официальный репо nvm)
# 2) затем:
nvm install --lts
nvm use --lts
node -v
npm -v
```

Вариант B (через apt) — иногда даёт не самый свежий LTS.

### 3.3. VS Code
- поставь VS Code (deb пакет или из репо)
- расширения (минимум):
  - ESLint
  - Prettier
  - GitLens
  - Postgres (по желанию)
  - Tailwind CSS IntelliSense (если используем tailwind)

---

## 4) Создаём репозиторий

### 4.1. На GitHub
1. New repository → `polygraph-nexus`
2. Public/Private — как хочешь
3. Add README — можно позже

### 4.2. На локальной машине
```bash
mkdir -p ~/dev/polygraph-nexus
cd ~/dev/polygraph-nexus
git init
```

Добавь remote:
```bash
git remote add origin git@github.com:YOUR_USERNAME/polygraph-nexus.git
```

---

## 5) Supabase: создание проекта в облаке

### 5.1. Регистрация/вход
1. Зайди на supabase.com и войди (можно через GitHub).
2. Создай Organization (supabase org).
3. Create project:
   - имя: polygraph-nexus
   - region ближе к тебе
   - database password — **сохрани** (будет нужен для CLI link) citeturn0search18

### 5.2. Где взять URL и ключи
В dashboard:
- Settings → API Keys / API  
Там:
- Project URL
- Anon key
- Service role key (НЕ в клиент) citeturn0search17turn0search6

---

## 6) Supabase CLI: локальная разработка (очень желательно)

Supabase рекомендует локальную разработку: `supabase init` + `supabase start`. citeturn0search4turn0search0

### 6.1. Установка CLI
По документации Supabase CLI (варианты установки зависят от твоей системы). citeturn0search4turn0search2

### 6.2. Инициализация
В корне репозитория:
```bash
supabase init
```

### 6.3. Запуск локального стека
```bash
supabase start
```

Локально поднимутся сервисы Supabase, и у тебя будет локальная Studio.

### 6.4. Логин и линк с облаком
```bash
supabase login
supabase link --project-ref YOUR_PROJECT_REF
# попросит пароль БД (Settings / Database) citeturn0search18
```

---

## 7) Создаём фронтенд: React + TS + Vite

В корне `~/dev/polygraph-nexus`:

```bash
npm create vite@latest web -- --template react-ts
cd web
npm install
npm run dev
```

Открой http://localhost:5173

---

## 8) Добавляем Supabase client

### 8.1. Установка пакета
```bash
npm i @supabase/supabase-js
```

### 8.2. ENV переменные
В `web/.env.local`:
```env
VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co"
VITE_SUPABASE_ANON_KEY="YOUR_ANON_KEY"
```

> **Service role key сюда не кладём**. Он для серверной части. citeturn0search17

### 8.3. Файл клиента
`web/src/services/supabaseClient.ts`:
```ts
import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(url, anon);
```

---

## 9) Подключаем PWA

### 9.1. Установка vite-plugin-pwa
Следуем гайду Vite PWA. citeturn0search20

```bash
npm i -D vite-plugin-pwa
```

### 9.2. Настройка `vite.config.ts`
(минимальная конфигурация, дальше расширим)

### 9.3. manifest + icons
- `web/public/manifest.webmanifest`
- иконки (512/192)

---

## 10) Первая база: миграции (schema)

### 10.1. Создаём миграцию
```bash
supabase migration new init_schema
```
Это создаст файл в `supabase/migrations`. citeturn0search14

### 10.2. Вставляем SQL
Берём каркас из DATABASE_SCHEMA.md (profiles/orgs/memberships/...)
Вставляем в миграцию.

### 10.3. Применяем локально
```bash
supabase db reset
```

### 10.4. Пушим в облако (когда готово)
```bash
supabase db push
```
Команда требует link проекта. citeturn0search2

---

## 11) Первая функциональность на фронте (MVP‑скелет)

### 11.1. Auth pages
- login/register
- сохранение сессии
- редирект в app

### 11.2. Org bootstrap wizard
- create org
- create facility
- create sectors (шаблон списком)
- invite members (позже)

### 11.3. Orders list + create order
- минимальная форма
- status/due date
- attachments upload

---

## 12) Git workflow (чтобы не превратить проект в кашу)

### 12.1. Базовые ветки
- `main` (стабильное)
- `dev` (интеграционная)
- `feat/...` (фичи)

### 12.2. Коммиты
- маленькие, частые
- понятные сообщения:
  - `feat: init supabase client`
  - `chore: add pwa plugin`

---

## 13) VS Code рабочие настройки (Linux)

Рекомендую:
- `Format on Save` (Prettier)
- `ESLint: Fix on Save`
- `files.eol`: `\n`
- `.editorconfig`

---

## 14) Делаем сейчас 
1) Создам **репо‑скелет** (структура папок, базовые файлы)  
2) Подготовлю **первые миграции** под базовые таблицы  
3) Сгенерю **первые экраны** (Auth + Wizard + Orders list)  
4) Подключу **PWA** и оффлайн‑кэш “минимум жизнеспособный”

