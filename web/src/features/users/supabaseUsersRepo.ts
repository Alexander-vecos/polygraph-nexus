import { supabase } from '../../services/supabase/client';
import type { UsersRepository } from './users.usecases';
import type { UpdateProfileInput, UserProfile } from './types';

function rowToProfile(row: Record<string, string | null>): UserProfile {
  return {
    userId: row.user_id as string,
    email: row.email ?? null,
    displayName: row.display_name ?? null,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

export const supabaseUsersRepo: UsersRepository = {
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('user_id, email, display_name, created_at, updated_at')
      .eq('user_id', userId)
      .single();
    if (error || !data) return null;
    return rowToProfile(data as Record<string, string | null>);
  },

  async updateProfile(input: UpdateProfileInput): Promise<UserProfile> {
    const { data, error } = await supabase
      .from('profiles')
      .update({ display_name: input.displayName })
      .eq('user_id', input.userId)
      .select('user_id, email, display_name, created_at, updated_at')
      .single();
    if (error || !data) throw new Error(error?.message ?? 'Failed to update profile');
    return rowToProfile(data as Record<string, string | null>);
  },
};
