import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../services/supabase/client";

type AuthState = {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
  init: () => Promise<void>;
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
    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      set({
        session: newSession,
        user: newSession?.user ?? null,
      });
    });

    // data.subscription можно сохранить/использовать для отписки при необходимости.
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
