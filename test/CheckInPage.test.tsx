import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CheckInPage } from "../src/pages/CheckInPage";

vi.mock("../src/supabaseClient", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({ error: null })),
    })),
  },
}));

describe("CheckInPage", () => {
  describe("progress stepper", () => {
    it("renders all four stage names in the stepper", () => {
      render(<CheckInPage />);
      const stepper = screen.getByRole("navigation", {
        name: /check-in progress/i,
      });
      expect(stepper).toHaveTextContent("Breathe");
      expect(stepper).toHaveTextContent("Feel");
      expect(stepper).toHaveTextContent("Gratitude");
      expect(stepper).toHaveTextContent("Intention");
    });

    it("marks the first stage as active initially", () => {
      render(<CheckInPage />);
      const breatheStep = screen.getByTestId("step-0");
      expect(breatheStep).toHaveClass("step--active");
    });
  });

  describe("Breathe stage", () => {
    it("shows the Breathe stage content initially", () => {
      render(<CheckInPage />);
      expect(
        screen.getByRole("heading", { name: "Breathe" }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/guided breathing exercise/i),
      ).toBeInTheDocument();
    });

    it("shows breathing instructions", () => {
      render(<CheckInPage />);
      expect(
        screen.getByText(/slowly count your breaths/i),
      ).toBeInTheDocument();
    });

    it("has a Next button to advance", () => {
      render(<CheckInPage />);
      expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
    });
  });

  describe("Feel stage", () => {
    it("shows the Feel stage after clicking Next from Breathe", async () => {
      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));

      expect(screen.getByRole("heading", { name: "Feel" })).toBeInTheDocument();
      expect(
        screen.getByPlaceholderText(/how are you feeling/i),
      ).toBeInTheDocument();
    });

    it("marks the second step as active", async () => {
      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));

      expect(screen.getByTestId("step-1")).toHaveClass("step--active");
    });

    it("can go back to Breathe", async () => {
      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /back/i }));

      expect(
        screen.getByRole("heading", { name: "Breathe" }),
      ).toBeInTheDocument();
    });
  });

  describe("Gratitude stage", () => {
    it("shows the Gratitude stage after advancing twice", async () => {
      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /next/i }));

      expect(
        screen.getByRole("heading", { name: "Gratitude" }),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/grateful/i)).toBeInTheDocument();
    });
  });

  describe("Intention stage", () => {
    it("shows the Intention stage after advancing three times", async () => {
      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /next/i }));

      expect(
        screen.getByRole("heading", { name: "Intention" }),
      ).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/intention/i)).toBeInTheDocument();
    });

    it("shows a Submit button on the last stage", async () => {
      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /next/i }));

      expect(
        screen.getByRole("button", { name: /submit/i }),
      ).toBeInTheDocument();
    });
  });

  describe("submitting the check-in", () => {
    it("persists the texts to Supabase on submit", async () => {
      const mockInsert = vi.fn(() => ({ error: null }));
      const { supabase } = await import("../src/supabaseClient");
      vi.mocked(supabase.from).mockReturnValue({
        insert: mockInsert,
      } as never);

      const user = userEvent.setup();
      render(<CheckInPage />);

      // Breathe -> Feel
      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.type(
        screen.getByPlaceholderText(/how are you feeling/i),
        "I feel calm",
      );

      // Feel -> Gratitude
      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.type(screen.getByPlaceholderText(/grateful/i), "My family");

      // Gratitude -> Intention
      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.type(screen.getByPlaceholderText(/intention/i), "Be present");

      await user.click(screen.getByRole("button", { name: /submit/i }));

      expect(supabase.from).toHaveBeenCalledWith("check_ins");
      expect(mockInsert).toHaveBeenCalledWith({
        feeling: "I feel calm",
        gratitude: "My family",
        intention: "Be present",
      });
    });

    it("shows a success screen after successful submit", async () => {
      const { supabase } = await import("../src/supabaseClient");
      vi.mocked(supabase.from).mockReturnValue({
        insert: vi.fn(() => ({ error: null })),
      } as never);

      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /next/i }));
      await user.click(screen.getByRole("button", { name: /submit/i }));

      const successScreen = await screen.findByRole("status");
      expect(successScreen).toBeInTheDocument();
      expect(
        screen.getByRole("heading", { name: /check-in complete/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/thank you for taking a moment for yourself today/i),
      ).toBeInTheDocument();
    });
  });

  describe("completed steps", () => {
    it("marks Breathe as completed after advancing past it", async () => {
      const user = userEvent.setup();
      render(<CheckInPage />);

      await user.click(screen.getByRole("button", { name: /next/i }));

      expect(screen.getByTestId("step-0")).toHaveClass("step--completed");
    });
  });
});
