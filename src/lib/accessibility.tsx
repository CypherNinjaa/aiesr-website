import { useEffect, useRef } from "react";

// Focus management utilities
export const useFocusManagement = () => {
  const focusableElements =
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

  const trapFocus = (container: HTMLElement) => {
    const focusableContent = container.querySelectorAll(focusableElements);
    const firstFocusableElement = focusableContent[0] as HTMLElement;
    const lastFocusableElement = focusableContent[focusableContent.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusableElement) {
          lastFocusableElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusableElement) {
          firstFocusableElement.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  };

  const restoreFocus = (previouslyFocusedElement: HTMLElement | null) => {
    if (previouslyFocusedElement) {
      previouslyFocusedElement.focus();
    }
  };

  return { trapFocus, restoreFocus };
};

// Screen reader announcements
export const useScreenReader = () => {
  const announce = (message: string, priority: "polite" | "assertive" = "polite") => {
    const announcer = document.createElement("div");
    announcer.setAttribute("aria-live", priority);
    announcer.setAttribute("aria-atomic", "true");
    announcer.setAttribute("class", "sr-only");
    announcer.textContent = message;

    document.body.appendChild(announcer);

    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  };

  return { announce };
};

// Skip link component
export const SkipLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  return (
    <a
      href={href}
      className="focus:bg-burgundy sr-only transition-all focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2 focus:font-medium focus:text-white"
      style={{ backgroundColor: "var(--primary-burgundy)" }}
    >
      {children}
    </a>
  );
};

// Reduced motion detection
export const usePrefersReducedMotion = () => {
  const prefersReducedMotion = useRef(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    prefersReducedMotion.current = mediaQuery.matches;

    const handleChange = (event: MediaQueryListEvent) => {
      prefersReducedMotion.current = event.matches;
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion.current;
};

// Keyboard navigation utilities
export const useKeyboardNavigation = () => {
  const handleArrowKeys = (
    e: KeyboardEvent,
    items: NodeListOf<HTMLElement>,
    currentIndex: number,
    setCurrentIndex: (index: number) => void
  ) => {
    switch (e.key) {
      case "ArrowDown":
      case "ArrowRight":
        e.preventDefault();
        const nextIndex = (currentIndex + 1) % items.length;
        setCurrentIndex(nextIndex);
        items[nextIndex].focus();
        break;
      case "ArrowUp":
      case "ArrowLeft":
        e.preventDefault();
        const prevIndex = (currentIndex - 1 + items.length) % items.length;
        setCurrentIndex(prevIndex);
        items[prevIndex].focus();
        break;
      case "Home":
        e.preventDefault();
        setCurrentIndex(0);
        items[0].focus();
        break;
      case "End":
        e.preventDefault();
        const lastIndex = items.length - 1;
        setCurrentIndex(lastIndex);
        items[lastIndex].focus();
        break;
    }
  };

  return { handleArrowKeys };
};

// ARIA utilities
export const generateAriaLabel = (text: string, context?: string) => {
  return context ? `${text}, ${context}` : text;
};

export const generateAriaDescribedBy = (ids: string[]) => {
  return ids.filter(Boolean).join(" ") || undefined;
};

// Color contrast utilities
export const meetsContrastRequirements = (
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA"
): boolean => {
  // This is a simplified version - in a real app, you'd use a proper color contrast library
  // Implementation would calculate actual contrast ratio based on the level
  console.log(`Checking contrast for ${foreground} on ${background} at ${level} level`);
  return true; // Placeholder - would implement actual contrast calculation
};

// Form accessibility helpers
export const getFormFieldProps = (
  name: string,
  error?: string,
  description?: string,
  required?: boolean
) => {
  const fieldId = `field-${name}`;
  const errorId = error ? `${fieldId}-error` : undefined;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  return {
    id: fieldId,
    "aria-required": required ? "true" : undefined,
    "aria-invalid": error ? "true" : "false",
    "aria-describedby": generateAriaDescribedBy(
      [errorId, descriptionId].filter(Boolean) as string[]
    ),
    errorId,
    descriptionId,
  };
};
