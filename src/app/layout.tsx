import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
	title: "AIESR - Amity Institute of English Studies and Research",
	description:
		"Shape your future in English Studies and Research at one of India's premier institutes. Discover our comprehensive programs in literature, linguistics, and creative writing.",
	keywords:
		"English Studies, Literature, Research, Amity University, Patna, English Literature, Creative Writing, Linguistics",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className="antialiased">
				<Header />
				<main>{children}</main>
				<Footer />
			</body>
		</html>
	);
}
