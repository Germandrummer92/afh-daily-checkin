import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";

describe("App", () => {
  it("renders the Daily Check-In headline", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "Daily Check-In" }),
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
    expect(
      screen.getByText(/10\s?AM/i),
    ).toBeInTheDocument();
  });

  it("lists the Breathe stage", () => {
    render(<App />);
    expect(screen.getByText("Breathe")).toBeInTheDocument();
    expect(
      screen.getByText(/guided breathing exercise/i),
    ).toBeInTheDocument();
  });

  it("lists the Feel stage", () => {
    render(<App />);
    expect(screen.getByText("Feel")).toBeInTheDocument();
    expect(
      screen.getByText(/how you're feeling/i),
    ).toBeInTheDocument();
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
    expect(
      screen.getByText(/positive intention/i),
    ).toBeInTheDocument();
  });

  it("has a sign-up call to action", () => {
    render(<App />);
    expect(
      screen.getByRole("link", { name: /sign up/i }),
    ).toBeInTheDocument();
  });
});
