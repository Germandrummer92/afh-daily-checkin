import { type FormEvent, useState } from "react";
import { supabase } from "../auth/supabaseClient";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const { error } = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Daily Check-In</h1>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
              required
              minLength={6}
            />
          </label>

          {error && <p style={styles.error}>{error}</p>}

          <button type="submit" style={styles.submitButton}>
            {isSignUp ? "Sign up" : "Log in"}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          style={styles.switchButton}
        >
          {isSignUp
            ? "Already have an account? Log in"
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    padding: "2rem",
  },
  card: {
    background: "var(--white)",
    borderRadius: "5px",
    boxShadow: "0 15px 20px -10px rgba(0,0,0,0.2)",
    padding: "2.5rem",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    color: "var(--crimson)",
    fontFamily: "'Campton', Arial, sans-serif",
    fontWeight: 700,
    textAlign: "center" as const,
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "1rem",
  },
  label: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.25rem",
    fontWeight: 700,
    fontSize: "0.875rem",
  },
  input: {
    padding: "0.75rem",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "1rem",
    fontFamily: "'Campton', Arial, sans-serif",
  },
  error: {
    color: "var(--crimson)",
    fontSize: "0.875rem",
    margin: 0,
  },
  submitButton: {
    background: "var(--crimson)",
    color: "var(--white)",
    border: "none",
    borderRadius: "5px",
    padding: "0.75rem",
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: "'Campton', Arial, sans-serif",
    cursor: "pointer",
    transition: "transform 0.15s ease",
  },
  switchButton: {
    background: "none",
    border: "none",
    color: "var(--crimson)",
    cursor: "pointer",
    fontSize: "0.875rem",
    marginTop: "1rem",
    textAlign: "center" as const,
    width: "100%",
    fontFamily: "'Campton', Arial, sans-serif",
  },
};
