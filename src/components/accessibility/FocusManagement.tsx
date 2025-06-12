// filepath: src/components/accessibility/FocusManagement.tsx
"use client";

import React, { useEffect, useRef, useCallback } from "react";

interface FocusTrapProps {
  children: React.ReactNode;
  active?: boolean;
  className?: string;
}

export const FocusTrap: React.FC<FocusTrapProps> = ({
  children,
  active = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedElement = useRef<HTMLElement | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!containerRef.current) return [];

    const focusableSelector = [
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      "a[href]",
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(", ");

    return Array.from(containerRef.current.querySelectorAll(focusableSelector)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active || e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [active, getFocusableElements]
  );

  useEffect(() => {
    if (!active) return;

    // Store the previously focused element
    previouslyFocusedElement.current = document.activeElement as HTMLElement;

    // Focus the first focusable element
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);

      // Restore focus to previously focused element
      if (previouslyFocusedElement.current) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [active, handleKeyDown, getFocusableElements]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};

// Hook for managing focus restoration
export const useFocusRestore = () => {
  const previousFocusRef = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousFocusRef.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, []);

  return { saveFocus, restoreFocus };
};
