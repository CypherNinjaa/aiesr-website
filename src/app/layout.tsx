import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { SkipLinks } from "@/components/accessibility";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LayoutSwitcher } from "@/components/layout/LayoutSwitcher";
import { PublicSettingsProvider } from "@/contexts/PublicSettingsContext";
import { generateMetadata } from "@/lib/seo";
import { QueryProvider } from "@/providers/QueryProvider";

export const metadata: Metadata = generateMetadata({
  title: "AIESR - Amity Institute of English Studies and Research",
  description:
    "Shape your future in English Studies and Research at one of India's premier institutes. Discover our comprehensive programs in literature, linguistics, and creative writing.",
  keywords:
    "English Studies, Literature, Research, Amity University, Patna, English Literature, Creative Writing, Linguistics",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <SkipLinks />
        <ErrorBoundary>
          <QueryProvider>
            <PublicSettingsProvider>
              <LayoutSwitcher>{children}</LayoutSwitcher>
            </PublicSettingsProvider>
          </QueryProvider>
        </ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#363636",
              color: "#fff",
            },
            success: {
              style: {
                background: "#4caf50",
              },
            },
            error: {
              style: {
                background: "#f44336",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
