export interface UserProfile {
  userId: string;
  email: string | null;
  displayName: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UpdateProfileInput = {
  userId: string;
  displayName?: string | null;
};
