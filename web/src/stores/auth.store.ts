import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase/client";

type AuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  init: () => Promise<() => void>;  // возвращает функцию для отписки
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,

  init: async () => {
    // 1. сразу получаем текущую сессию
    const {
      data: { session },
    } = await supabase.auth.getSession();

    set({
      session,
      user: session?.user ?? null,
      isLoading: false,
    });

    // 2. подписываемся на дальнейшие изменения
    // В Supabase v2 onAuthStateChange возвращает { data: { subscription } }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      set({
        session: newSession,
        user: newSession?.user ?? null,
      });
    });

    // Возвращаем функцию для отписки
    return () => {
      subscription.unsubscribe();
    };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out error:", error);
      return;
    }
    set({ session: null, user: null });
  },
}));
