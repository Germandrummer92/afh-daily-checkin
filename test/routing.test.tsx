import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AppRoutes } from "../src/AppRoutes";

vi.mock("../src/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ error: null })),
    })),
  },
}));

describe("routing", () => {
  it("renders the homepage at /", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("heading", { name: "Daily Check-In" }),
    ).toBeInTheDocument();
  });

  it("renders the check-in page at /check-in", () => {
    render(
      <MemoryRouter initialEntries={["/check-in"]}>
        <AppRoutes />
      </MemoryRouter>,
    );
    expect(
      screen.getByRole("navigation", { name: /check-in progress/i }),
    ).toBeInTheDocument();
  });
});
