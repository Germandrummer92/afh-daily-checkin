import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { App } from "../src/App";

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
        signInWithPassword: vi.fn(),
        signUp: vi.fn(),
        signOut: vi.fn(),
      },
    },
  };
});

import { supabase } from "../src/auth/supabaseClient";

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getSession as Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    (supabase.auth.onAuthStateChange as Mock).mockReturnValue({
      data: { subscription: { unsubscribe: vi.fn() } },
    });
  });

  it("shows the login page when user is not authenticated", async () => {
    render(<App />);

    expect(
      await screen.findByRole("button", { name: "Log in" }),
    ).toBeInTheDocument();
  });

  it("shows the check-in page when user is authenticated", async () => {
    const fakeSession = {
      user: { id: "123", email: "test@example.com" },
      access_token: "token",
    };
    (supabase.auth.getSession as Mock).mockResolvedValueOnce({
      data: { session: fakeSession },
      error: null,
    });

    render(<App />);

    expect(await screen.findByText(/welcome/i)).toBeInTheDocument();
  });

  it("shows the Daily Check-In heading", async () => {
    render(<App />);

    expect(
      await screen.findByRole("heading", { name: "Daily Check-In" }),
    ).toBeInTheDocument();
  });

  it("explains the purpose of the app", () => {
    render(<App />);
    expect(
      screen.getByText(/help you start your day with intention/i),
    ).toBeInTheDocument();
  });

  it("describes the daily email after signup", () => {
    render(<App />);
    expect(screen.getByText(/10\s?AM/i)).toBeInTheDocument();
  });

  it("lists the Breathe stage", () => {
    render(<App />);
    expect(screen.getByText("Breathe")).toBeInTheDocument();
    expect(screen.getByText(/guided breathing exercise/i)).toBeInTheDocument();
  });

  it("lists the Feel stage", () => {
    render(<App />);
    expect(screen.getByText("Feel")).toBeInTheDocument();
    expect(screen.getByText(/how you're feeling/i)).toBeInTheDocument();
  });

  it("lists the Gratitude stage", () => {
    render(<App />);
    expect(screen.getByText("Gratitude")).toBeInTheDocument();
    expect(
      screen.getByText(/something you're grateful for/i),
    ).toBeInTheDocument();
  });

  it("lists the Intention stage", () => {
    render(<App />);
    expect(screen.getByText("Intention")).toBeInTheDocument();
    expect(screen.getByText(/positive intention/i)).toBeInTheDocument();
  });

  it("has a sign-up call to action", () => {
    render(<App />);
    expect(screen.getByRole("link", { name: /sign up/i })).toBeInTheDocument();
  });
});
