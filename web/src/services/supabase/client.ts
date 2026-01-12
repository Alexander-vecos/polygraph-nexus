import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Добавлены рекомендуемые опции для браузерного клиента:
// - persistSession: сохраняет сессию в localStorage
// - autoRefreshToken: автоматически обновляет токен
// - detectSessionInUrl: отключено, чтобы Supabase не обрабатывал URL при редиректах по умолчанию
export const supabase = createClient(url, anon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});
