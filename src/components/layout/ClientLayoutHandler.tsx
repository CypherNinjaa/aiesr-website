"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface ClientLayoutHandlerProps {
  children: React.ReactNode;
}

export function ClientLayoutHandler({ children }: ClientLayoutHandlerProps) {
  const pathname = usePathname();
  
  // Check if current route is an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  
  if (isAdminRoute) {
    // Admin layout - no header or footer, just the children
    return (
      <main id="main-content" tabIndex={-1} className="min-h-screen">
        {children}
      </main>
    );
  }
  
  // Regular layout - with header and footer
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
