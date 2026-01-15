import { describe, it, expect } from 'vitest';
import { getSettings, updateSettings } from './settings.usecases';

describe('Settings use cases', () => {
  it('should return default settings', async () => {
    const settings = await getSettings();
    expect(settings).toHaveProperty('theme');
    expect(settings).toHaveProperty('notifications');
    expect(settings).toHaveProperty('language');
  });

  it('should update settings', async () => {
    const newSettings = { theme: 'dark' as const };
    const updated = await updateSettings(newSettings);
    expect(updated.theme).toBe('dark');
  });
});
