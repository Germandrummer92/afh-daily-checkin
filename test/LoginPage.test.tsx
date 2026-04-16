import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { LoginPage } from "../src/pages/LoginPage";

vi.mock("../src/auth/supabaseClient", () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
    },
  },
}));

import { supabase } from "../src/auth/supabaseClient";

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email and password fields and a login button", () => {
    render(<LoginPage />);

    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("renders a link to switch to sign-up mode", () => {
    render(<LoginPage />);

    expect(
      screen.getByRole("button", { name: /sign up/i }),
    ).toBeInTheDocument();
  });

  it("switches to sign-up mode and back", async () => {
    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /sign up/i }));
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /log in/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /log in/i }));
    expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
  });

  it("calls signInWithPassword on login submit", async () => {
    (supabase.auth.signInWithPassword as Mock).mockResolvedValueOnce({
      data: { session: { user: { id: "1" } } },
      error: null,
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "test@example.com");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "password123",
    });
  });

  it("calls signUp when in sign-up mode", async () => {
    (supabase.auth.signUp as Mock).mockResolvedValueOnce({
      data: { session: { user: { id: "1" } } },
      error: null,
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.click(screen.getByRole("button", { name: /sign up/i }));
    await user.type(screen.getByLabelText("Email"), "new@example.com");
    await user.type(screen.getByLabelText("Password"), "newpass123");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: "new@example.com",
      password: "newpass123",
    });
  });

  it("displays an error message when login fails", async () => {
    (supabase.auth.signInWithPassword as Mock).mockResolvedValueOnce({
      data: { session: null },
      error: { message: "Invalid login credentials" },
    });

    const user = userEvent.setup();
    render(<LoginPage />);

    await user.type(screen.getByLabelText("Email"), "bad@example.com");
    await user.type(screen.getByLabelText("Password"), "wrong");
    await user.click(screen.getByRole("button", { name: "Log in" }));

    expect(
      await screen.findByText("Invalid login credentials"),
    ).toBeInTheDocument();
  });

  it("displays the app title", () => {
    render(<LoginPage />);
    expect(
      screen.getByRole("heading", { name: "Daily Check-In" }),
    ).toBeInTheDocument();
  });
});
