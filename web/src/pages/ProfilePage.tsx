import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';
import { buildUsersUseCases } from '../features/users/users.usecases';
import { supabaseUsersRepo } from '../features/users/supabaseUsersRepo';
import type { UserProfile } from '../features/users/types';

const usersUseCases = buildUsersUseCases(supabaseUsersRepo);

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      setIsLoading(true);
      const p = await usersUseCases.getProfile(user.id);
      if (p) {
        setProfile(p);
        setDisplayName(p.displayName ?? '');
      }
      setIsLoading(false);
    };
    fetchProfile();
  }, [user]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updated = await usersUseCases.updateProfile({ userId: user.id, displayName });
      setProfile(updated);
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    }
    setIsSaving(false);
  };

  if (isLoading) return <div style={{ padding: 16 }}>Loading profile...</div>;

  return (
    <div style={{ padding: 16, maxWidth: 480 }}>
      <h1>Profile</h1>

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 8 }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={profile?.email ?? user?.email ?? ''}
          disabled
          style={{ opacity: 0.7 }}
        />

        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Enter your display name"
          autoComplete="name"
        />

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </form>

      {message && <p style={{ marginTop: 12, color: 'green' }}>{message}</p>}
      {error && <p style={{ marginTop: 12, color: 'red' }}>Error: {error}</p>}
    </div>
  );
}
