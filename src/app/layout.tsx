import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { QueryProvider } from "@/providers/QueryProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { SkipLinks } from "@/components/accessibility";
import { generateMetadata } from "@/lib/seo";

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
            <Header />
            <main id="main-content" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
