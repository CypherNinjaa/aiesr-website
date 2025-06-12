import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiveRegion } from "../LiveRegion";
import { SkipLink } from "../SkipLink";

describe("Accessibility Components", () => {
  describe("SkipLink", () => {
    it("renders skip link with correct attributes", () => {
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const link = screen.getByRole("link", { name: /skip to main content/i });
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute("href", "#main-content");
      expect(link).toHaveClass("sr-only");
    });

    it("becomes visible when focused", async () => {
      const user = userEvent.setup();
      render(<SkipLink href="#main-content">Skip to main content</SkipLink>);

      const link = screen.getByRole("link", { name: /skip to main content/i });

      await user.tab();
      expect(link).toHaveFocus();
      expect(link).not.toHaveClass("sr-only");
    });
  });

  describe("LiveRegion", () => {
    it("renders live region with correct attributes", () => {
      render(<LiveRegion message="Test announcement" />);

      const region = screen.getByRole("status");
      expect(region).toBeInTheDocument();
      expect(region).toHaveAttribute("aria-live", "polite");
      expect(region).toHaveAttribute("aria-atomic", "true");
    });

    it("displays message content", () => {
      render(<LiveRegion message="Form submitted successfully" />);

      expect(screen.getByText(/form submitted successfully/i)).toBeInTheDocument();
    });

    it("supports different politeness levels", () => {
      render(<LiveRegion message="Urgent message" politeness="assertive" />);

      const region = screen.getByRole("status");
      expect(region).toHaveAttribute("aria-live", "assertive");
    });
  });
});
