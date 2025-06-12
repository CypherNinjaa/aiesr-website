// filepath: src/types/jest.d.ts
import "@testing-library/jest-dom";

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(className: string): R;
      toBeDisabled(): R;
      toHaveFocus(): R;
    }
  }
}
