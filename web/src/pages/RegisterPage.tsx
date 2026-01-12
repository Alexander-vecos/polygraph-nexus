import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/supabase/client";

export function RegisterPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus(null);

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setError(error.message);
      return;
    }

    setStatus("Account created. If email confirmation is enabled, check your inbox.");
    nav("/app");
  };

  return (
    <div style={{ padding: 16, maxWidth: 420 }}>
      <h1>Register</h1>

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
        <input
          placeholder="password (min 6 chars)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
        />
        <button type="submit">Create account</button>
      </form>

      {error && <p style={{ marginTop: 12 }}>Error: {error}</p>}
      {status && <p style={{ marginTop: 12 }}>{status}</p>}

      <p style={{ marginTop: 12 }}>
        <Link to="/auth/login">Back to login</Link>
      </p>
    </div>
  );
}
