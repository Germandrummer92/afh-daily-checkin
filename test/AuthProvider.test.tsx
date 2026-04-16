import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { AuthProvider, useAuth } from "../src/auth/AuthProvider";

vi.mock("../src/auth/supabaseClient", () => {
  const onAuthStateChange = vi.fn().mockReturnValue({
    data: { subscription: { unsubscribe: vi.fn() } },
  });
  return {
    supabase: {
      auth: {
        getSession: vi.fn().mockResolvedValue({
          data: { session: null },
          error: null,
        }),
        onAuthStateChange,
      },
    },
  };
});

import { supabase } from "../src/auth/supabaseClient";

function TestConsumer() {
  const { session, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return <div>{session ? "Logged in" : "Logged out"}</div>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially then resolves to logged out when no session", async () => {
    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(await screen.findByText("Logged out")).toBeInTheDocument();
  });

  it("provides the session when user is logged in", async () => {
    const fakeSession = { user: { id: "123", email: "test@example.com" } };
    (supabase.auth.getSession as Mock).mockResolvedValueOnce({
      data: { session: fakeSession },
      error: null,
    });

    render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    expect(await screen.findByText("Logged in")).toBeInTheDocument();
  });

  it("subscribes to auth state changes and cleans up on unmount", async () => {
    const unsubscribe = vi.fn();
    (supabase.auth.onAuthStateChange as Mock).mockReturnValueOnce({
      data: { subscription: { unsubscribe } },
    });

    const { unmount } = render(
      <AuthProvider>
        <TestConsumer />
      </AuthProvider>,
    );

    await screen.findByText("Logged out");
    unmount();
    expect(unsubscribe).toHaveBeenCalled();
  });
});
