import { Outlet, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";

export function AppShell() {
  const nav = useNavigate();
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const signOut = useAuthStore((s) => s.signOut);

  const onLogout = async () => {
    await signOut();
    nav("/auth/login");
  };

  if (isLoading) return <div style={{ padding: 16 }}>Loading session...</div>;
  if (!user) return <Navigate to="/auth/login" replace />;

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16 }}>
        <Link to="/app">Dashboard</Link>
        <span style={{ opacity: 0.7 }}>{user?.email ?? "—"}</span>
        <button onClick={onLogout}>Logout</button>
      </header>
      <Outlet />
    </div>
  );
}
