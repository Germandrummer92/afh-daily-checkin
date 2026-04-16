import { supabase } from "../auth/supabaseClient";

export function CheckInPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Daily Check-In</h1>
        <p style={styles.welcome}>Welcome! You're checked in for today.</p>
        <button
          type="button"
          onClick={() => supabase.auth.signOut()}
          style={styles.logOutButton}
        >
          Log out
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
    maxWidth: "500px",
    textAlign: "center" as const,
  },
  title: {
    color: "var(--crimson)",
    fontFamily: "'Campton', Arial, sans-serif",
    fontWeight: 700,
    marginBottom: "1rem",
  },
  welcome: {
    fontSize: "1.125rem",
    marginBottom: "1.5rem",
  },
  logOutButton: {
    background: "none",
    border: "1px solid var(--crimson)",
    borderRadius: "5px",
    color: "var(--crimson)",
    cursor: "pointer",
    fontSize: "0.875rem",
    fontWeight: 700,
    fontFamily: "'Campton', Arial, sans-serif",
    padding: "0.5rem 1.5rem",
    transition: "transform 0.15s ease",
  },
};
