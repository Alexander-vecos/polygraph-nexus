// Small usecase file for settings-related persistence.
export function saveThemePreference(theme: string) {
  try {
    localStorage.setItem("theme", theme);
  } catch {
    // ignore storage errors in edge cases
  }
}

export function loadThemePreference(): string | null {
  try {
    return localStorage.getItem("theme");
  } catch {
    return null;
  }
}
