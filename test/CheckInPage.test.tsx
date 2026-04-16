import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import { CheckInPage } from "../src/pages/CheckInPage";

vi.mock("../src/auth/supabaseClient", () => ({
  supabase: {
    auth: {
      signOut: vi.fn(),
    },
  },
}));

import { supabase } from "../src/auth/supabaseClient";

describe("CheckInPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the check-in heading", () => {
    render(<CheckInPage />);

    expect(
      screen.getByRole("heading", { name: "Daily Check-In" }),
    ).toBeInTheDocument();
  });

  it("renders a welcome message", () => {
    render(<CheckInPage />);

    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it("renders a log-out button", () => {
    render(<CheckInPage />);

    expect(
      screen.getByRole("button", { name: /log out/i }),
    ).toBeInTheDocument();
  });

  it("calls signOut when log-out button is clicked", async () => {
    (supabase.auth.signOut as Mock).mockResolvedValueOnce({ error: null });

    const user = userEvent.setup();
    render(<CheckInPage />);

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(supabase.auth.signOut).toHaveBeenCalled();
  });
});
