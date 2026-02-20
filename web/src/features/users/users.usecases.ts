import type { UpdateProfileInput, UserProfile } from "./types";

export type UsersRepository = {
  getProfile: (userId: string) => Promise<UserProfile | null>;
  updateProfile: (input: UpdateProfileInput) => Promise<UserProfile>;
};

export function buildUsersUseCases(repo: UsersRepository) {
  return {
    getProfile: (userId: string) => repo.getProfile(userId),
    updateProfile: (input: UpdateProfileInput) => repo.updateProfile(input),
  };
}
