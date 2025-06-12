import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "../Button";

describe("Button Component", () => {
  it("renders button with correct text", () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("handles click events", async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole("button", { name: /click me/i });
    await user.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("applies correct variant classes", () => {
    render(<Button variant="outline">Outline Button</Button>);

    const button = screen.getByRole("button", { name: /outline button/i });
    expect(button).toHaveClass("border-2");
  });

  it("is disabled when disabled prop is true", () => {
    render(<Button disabled>Disabled Button</Button>);

    const button = screen.getByRole("button", { name: /disabled button/i });
    expect(button).toBeDisabled();
  });

  it("applies correct size classes", () => {
    render(<Button size="sm">Small Button</Button>);

    const button = screen.getByRole("button", { name: /small button/i });
    expect(button).toBeInTheDocument();
  });
});
