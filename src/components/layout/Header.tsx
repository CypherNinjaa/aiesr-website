"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useSiteName } from "@/contexts/PublicSettingsContext";
import { cn } from "@/lib/utils";
import { NavigationItem } from "@/types";

const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about",
    children: [
      { label: "History & Legacy", href: "/about/history" },
      { label: "Mission & Vision", href: "/about/mission" },
      { label: "Leadership Team", href: "/about/leadership" },
      { label: "Infrastructure", href: "/about/infrastructure" },
    ],
  },
  {
    label: "Programs",
    href: "/programs",
    children: [
      { label: "Undergraduate", href: "/programs/undergraduate" },
      { label: "Postgraduate", href: "/programs/postgraduate" },
      { label: "Doctoral", href: "/programs/doctoral" },
      { label: "Certificate Courses", href: "/programs/certificate" },
    ],
  },
  { label: "Faculty", href: "/faculty" },
  { label: "Research", href: "/research" },
  { label: "Student Life", href: "/student-life" },
  { label: "Contact", href: "/contact" },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const siteName = useSiteName();

  // Create explicit ARIA attribute values to satisfy accessibility checkers
  const mobileMenuAriaExpanded = isMobileMenuOpen;
  const mobileMenuAriaHidden = !isMobileMenuOpen;

  // ARIA attributes objects for better accessibility checker compatibility
  const mobileToggleAriaProps = {
    "aria-expanded": mobileMenuAriaExpanded,
    "aria-controls": "mobile-menu",
  };

  const mobileMenuAriaProps = {
    "aria-hidden": mobileMenuAriaHidden,
    "aria-label": "Mobile navigation",
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      id="navigation"
      className={cn(
        "fixed top-0 right-0 left-0 z-50 transition-all duration-300",
        isScrolled ? "bg-white/95 shadow-lg backdrop-blur-md" : "bg-transparent"
      )}
      role="banner"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {" "}
          {/* Logo Section */}{" "}
          <Link href="/" className="flex items-center space-x-3" aria-label={`${siteName} - Home`}>
            <div className="bg-burgundy flex h-12 w-12 items-center justify-center rounded-full">
              <span className="font-primary text-lg font-bold text-white">A</span>
            </div>
            <div className="hidden md:block">
              <h1 className="font-primary text-burgundy text-xl font-bold">AIESR</h1>
              <p className="max-w-[200px] text-xs leading-tight text-gray-600">{siteName}</p>
            </div>
          </Link>{" "}
          {/* Desktop Navigation */}
          <nav
            className="hidden items-center space-x-8 lg:flex"
            role="navigation"
            aria-label="Main navigation"
          >
            {navigationItems.map(item => (
              <div key={item.label} className="group relative">
                {" "}
                <Link
                  href={item.href}
                  className="hover:text-burgundy font-medium text-gray-700 transition-colors duration-200"
                  aria-expanded={item.children ? "false" : undefined}
                  aria-haspopup={item.children ? "true" : undefined}
                >
                  {item.label}
                </Link>{" "}
                {/* Dropdown Menu */}
                {item.children && (
                  <ul
                    className="invisible absolute top-full left-0 z-50 mt-2 w-56 rounded-lg border bg-white opacity-0 shadow-lg transition-all duration-200 group-hover:visible group-hover:opacity-100"
                    role="list"
                    aria-label={`${item.label} submenu`}
                  >
                    {item.children.map(child => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="hover:text-burgundy block px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>{" "}
          {/* CTA Buttons - Desktop */}
          <div className="hidden items-center space-x-4 lg:flex">
            <Button size="sm">Apply Now</Button>{" "}
          </div>{" "}
          {/* Mobile Menu Toggle */}
          <button
            className="p-2 lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close mobile menu" : "Open mobile menu"}
            {...mobileToggleAriaProps}
          >
            <div className="relative flex h-5 w-6 flex-col justify-between">
              <span
                className={cn(
                  "bg-burgundy h-0.5 w-full transition-all duration-300",
                  isMobileMenuOpen ? "translate-y-2 rotate-45" : ""
                )}
              />
              <span
                className={cn(
                  "bg-burgundy h-0.5 w-full transition-all duration-300",
                  isMobileMenuOpen ? "opacity-0" : ""
                )}
              />
              <span
                className={cn(
                  "bg-burgundy h-0.5 w-full transition-all duration-300",
                  isMobileMenuOpen ? "-translate-y-2 -rotate-45" : ""
                )}
              />
            </div>
          </button>
        </div>{" "}
      </div>{" "}
      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden border-t bg-white transition-all duration-300 lg:hidden",
          isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        )}
        role="navigation"
        {...mobileMenuAriaProps}
      >
        <nav className="container mx-auto px-4 py-6">
          <div className="flex flex-col space-y-4">
            {navigationItems.map(item => (
              <div key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-burgundy block py-2 font-medium text-gray-700 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>

                {/* Mobile Submenu */}
                {item.children && (
                  <div className="mt-2 ml-4 space-y-2">
                    {item.children.map(child => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="hover:text-burgundy block py-1 text-sm text-gray-600 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}{" "}
            {/* Mobile CTA Buttons */}
            <div className="space-y-3 pt-4">
              <Button className="w-full">Apply Now</Button>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};
