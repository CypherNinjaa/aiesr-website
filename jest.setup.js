// filepath: jest.setup.js
import "@testing-library/jest-dom";

// Extend Jest matchers with Testing Library matchers
expect.extend({
  toBeInTheDocument: received => {
    return received && received.ownerDocument
      ? { pass: true, message: () => "" }
      : { pass: false, message: () => `Expected element to be in the document` };
  },
  toHaveAttribute: (received, attr, value) => {
    const hasAttr = received && received.getAttribute && received.getAttribute(attr) === value;
    return hasAttr
      ? { pass: true, message: () => "" }
      : { pass: false, message: () => `Expected element to have attribute ${attr}=${value}` };
  },
  toHaveClass: (received, className) => {
    const hasClass = received && received.classList && received.classList.contains(className);
    return hasClass
      ? { pass: true, message: () => "" }
      : { pass: false, message: () => `Expected element to have class ${className}` };
  },
  toBeDisabled: received => {
    const isDisabled = received && received.disabled;
    return isDisabled
      ? { pass: true, message: () => "" }
      : { pass: false, message: () => `Expected element to be disabled` };
  },
  toHaveFocus: received => {
    const hasFocus = received && document.activeElement === received;
    return hasFocus
      ? { pass: true, message: () => "" }
      : { pass: false, message: () => `Expected element to have focus` };
  },
});

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
