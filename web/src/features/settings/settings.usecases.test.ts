import { describe, it, expect } from "vitest";
import { saveThemePreference, loadThemePreference } from "./settings.usecases";

describe("settings usecases", () => {
  it("saves and loads theme preference", () => {
    // set
    saveThemePreference("dark");
    const v = loadThemePreference();
    expect(v).toBe("dark");
  });

  it("returns null when no preference set", () => {
    localStorage.removeItem("theme");
    expect(loadThemePreference()).toBeNull();
  });
});
