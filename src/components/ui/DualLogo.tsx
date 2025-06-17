"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";

// AUP Logo Component (Primary logo on the left)
export const AupLogo: React.FC<{ size?: number }> = ({ size = 56 }) => (
  <Link
    href="/"
    className="flex items-center transition-opacity duration-200 hover:opacity-80"
    aria-label="Amity University Patna - Home"
  >
    <div className="relative">
      <Image
        src="/AUP logo .png"
        alt="AUP Logo"
        width={size}
        height={size}
        className="transition-transform duration-200 hover:scale-105"
        priority
      />
    </div>
  </Link>
);

// AIESR Logo Component (Secondary logo on the right)
export const AiesrLogoSecondary: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <div className="relative">
    <Image
      src="/AIESR logo .png"
      alt="AIESR Logo"
      width={size}
      height={size}
      className="transition-transform duration-200 hover:scale-105"
    />
  </div>
);
