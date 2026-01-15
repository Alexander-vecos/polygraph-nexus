import { createBrowserRouter } from "react-router-dom";
import { AppShell } from "./shared/layout/AppShell";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";

export const router = createBrowserRouter([
  { path: "/auth/login", element: <LoginPage /> },
  { path: "/auth/register", element: <RegisterPage /> },
  {
    path: "/app",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  { path: "*", element: <LoginPage /> },
]);
