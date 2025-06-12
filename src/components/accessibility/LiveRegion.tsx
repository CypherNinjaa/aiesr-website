// filepath: src/components/accessibility/LiveRegion.tsx
"use client";

import React, { useEffect, useState } from "react";

interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive" | "off";
  atomic?: boolean;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  politeness = "polite",
  atomic = true,
  className = "sr-only",
}) => {
  const [displayMessage, setDisplayMessage] = useState("");

  useEffect(() => {
    if (message) {
      setDisplayMessage(message);
      // Clear the message after a delay to allow for new announcements
      const timer = setTimeout(() => setDisplayMessage(""), 1000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div role="status" aria-live={politeness} aria-atomic={atomic} className={className}>
      {displayMessage}
    </div>
  );
};

// Hook to manage announcements
export const useAnnouncement = () => {
  const [message, setMessage] = useState("");

  const announce = (text: string) => {
    setMessage(text);
  };

  const clear = () => {
    setMessage("");
  };

  return { message, announce, clear };
};
