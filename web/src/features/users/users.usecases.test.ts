import { describe, it, expect, vi } from 'vitest';
import { buildUsersUseCases } from './users.usecases';
import type { UsersRepository } from './users.usecases';
import type { UserProfile } from './types';

const mockProfile: UserProfile = {
  userId: 'user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  createdAt: '2026-01-01T00:00:00Z',
  updatedAt: '2026-01-01T00:00:00Z',
};

const mockRepo: UsersRepository = {
  getProfile: vi.fn().mockResolvedValue(mockProfile),
  updateProfile: vi.fn().mockResolvedValue({ ...mockProfile, displayName: 'Updated Name' }),
};

describe('Users use cases', () => {
  const useCases = buildUsersUseCases(mockRepo);

  it('should return a user profile', async () => {
    const profile = await useCases.getProfile('user-123');
    expect(profile).toHaveProperty('userId');
    expect(profile).toHaveProperty('email');
    expect(profile).toHaveProperty('displayName');
  });

  it('should update a user profile', async () => {
    const updated = await useCases.updateProfile({ userId: 'user-123', displayName: 'Updated Name' });
    expect(updated.displayName).toBe('Updated Name');
  });
});
