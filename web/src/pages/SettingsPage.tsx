import React from "react";
// simple settings page; avoids importing AppShell directly (route renders inside AppShell)

export const SettingsPage: React.FC = () => {
  const [theme, setTheme] = React.useState<string>(
    () => localStorage.getItem("theme") || "light"
  );

  React.useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div style={{ padding: 20 }}>
      <h1>Settings</h1>
      <div>
        <label>
          <input
            type="radio"
            name="theme"
            value="light"
            checked={theme === "light"}
            onChange={() => setTheme("light")}
          />
          Light
        </label>
        <label style={{ marginLeft: 12 }}>
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={theme === "dark"}
            onChange={() => setTheme("dark")}
          />
          Dark
        </label>
      </div>
    </div>
  );
};

export default SettingsPage;
