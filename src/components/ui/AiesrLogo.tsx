"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { cn } from "@/lib/utils";

interface AiesrLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  href?: string;
  siteName?: string;
}

const sizeConfig = {
  sm: {
    logoSize: 32,
    textSize: "text-sm",
    spacing: "space-x-2",
    titleSize: "text-base",
    descSize: "text-xs",
  },
  md: {
    logoSize: 48,
    textSize: "text-base",
    spacing: "space-x-3",
    titleSize: "text-xl",
    descSize: "text-xs",
  },
  lg: {
    logoSize: 64,
    textSize: "text-lg",
    spacing: "space-x-4",
    titleSize: "text-2xl",
    descSize: "text-sm",
  },
  xl: {
    logoSize: 80,
    textSize: "text-xl",
    spacing: "space-x-5",
    titleSize: "text-3xl",
    descSize: "text-base",
  },
};

export const AiesrLogo: React.FC<AiesrLogoProps> = ({
  size = "md",
  showText = true,
  className,
  href = "/",
  siteName = "AIESR - Amity Institute of English Studies & Research",
}) => {
  const config = sizeConfig[size];

  const LogoContent = () => (
    <div className={cn("flex items-center", config.spacing, className)}>
      {/* Logo Image */}
      <div className="relative">
        <Image
          src="/aiesr-logo.svg"
          alt="AIESR Logo"
          width={config.logoSize}
          height={config.logoSize}
          className="transition-transform duration-200 hover:scale-105"
          priority
        />
      </div>

      {/* Text Content */}
      {showText && (
        <div className="hidden md:block">
          <h1 className={cn("font-primary text-burgundy font-bold", config.titleSize)}>AIESR</h1>
          <p className={cn("max-w-[200px] leading-tight text-gray-600", config.descSize)}>
            {siteName}
          </p>
        </div>
      )}
    </div>
  );

  // If href is provided, wrap in Link, otherwise render as div
  if (href) {
    return (
      <Link
        href={href}
        className="transition-opacity duration-200 hover:opacity-80"
        aria-label={`${siteName} - Home`}
      >
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

// Alternative simplified logo for small spaces
export const AiesrLogoSimple: React.FC<{ size?: number; className?: string }> = ({
  size = 32,
  className,
}) => (
  <div className={cn("relative", className)}>
    <Image
      src="/aiesr-logo.svg"
      alt="AIESR"
      width={size}
      height={size}
      className="transition-transform duration-200 hover:scale-105"
    />
  </div>
);
