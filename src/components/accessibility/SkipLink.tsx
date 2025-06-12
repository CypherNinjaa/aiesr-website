// filepath: src/components/accessibility/SkipLink.tsx
"use client";

import React from "react";

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export const SkipLink: React.FC<SkipLinkProps> = ({ href, children, className = "" }) => {
  return (
    <a
      href={href}
      className={`skip-link sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 ${className} `}
      onFocus={_e => {
        // Ensure the target element exists and is focusable
        const target = document.querySelector(href);
        if (target && !target.getAttribute("tabindex")) {
          target.setAttribute("tabindex", "-1");
        }
      }}
    >
      {children}
    </a>
  );
};

// Skip Links Container
export const SkipLinks: React.FC = () => {
  return (
    <div className="skip-links">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#footer">Skip to footer</SkipLink>
    </div>
  );
};

// Screen Reader Only utility component
export const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <span className="sr-only">{children}</span>;
};
