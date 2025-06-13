"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface LayoutSwitcherProps {
  children: React.ReactNode;
}

export function LayoutSwitcher({ children }: LayoutSwitcherProps) {
  const pathname = usePathname();

  // Hide header and footer for admin routes
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return (
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        {children}
      </main>
    );
  }

  // Regular layout with header and footer
  return (
    <>
      <Header />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </>
  );
}
