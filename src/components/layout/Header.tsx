"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
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
	{ label: "Admissions", href: "/admissions" },
	{ label: "Student Life", href: "/student-life" },
	{ label: "Contact", href: "/contact" },
];

export const Header: React.FC = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				isScrolled ? "bg-white/95 backdrop-blur-md shadow-lg" : "bg-transparent"
			)}
		>
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-20">
					{/* Logo Section */}
					<Link href="/" className="flex items-center space-x-3">
						<div className="w-12 h-12 bg-burgundy rounded-full flex items-center justify-center">
							<span className="text-white font-primary font-bold text-lg">
								A
							</span>
						</div>
						<div className="hidden md:block">
							<h1 className="font-primary font-bold text-xl text-burgundy">
								AIESR
							</h1>
							<p className="text-xs text-gray-600 max-w-[200px] leading-tight">
								Amity Institute of English Studies and Research
							</p>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<nav className="hidden lg:flex items-center space-x-8">
						{navigationItems.map((item) => (
							<div key={item.label} className="relative group">
								<Link
									href={item.href}
									className="text-gray-700 hover:text-burgundy transition-colors duration-200 font-medium"
								>
									{item.label}
								</Link>

								{/* Dropdown Menu */}
								{item.children && (
									<div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
										<div className="py-2">
											{item.children.map((child) => (
												<Link
													key={child.label}
													href={child.href}
													className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-burgundy transition-colors"
												>
													{child.label}
												</Link>
											))}
										</div>
									</div>
								)}
							</div>
						))}
					</nav>

					{/* CTA Buttons - Desktop */}
					<div className="hidden lg:flex items-center space-x-4">
						<Button variant="outline" size="sm">
							Download Brochure
						</Button>
						<Button size="sm">Apply Now</Button>
					</div>

					{/* Mobile Menu Toggle */}
					<button
						className="lg:hidden p-2"
						onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						aria-label="Toggle mobile menu"
					>
						<div className="w-6 h-5 relative flex flex-col justify-between">
							<span
								className={cn(
									"w-full h-0.5 bg-burgundy transition-all duration-300",
									isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
								)}
							/>
							<span
								className={cn(
									"w-full h-0.5 bg-burgundy transition-all duration-300",
									isMobileMenuOpen ? "opacity-0" : ""
								)}
							/>
							<span
								className={cn(
									"w-full h-0.5 bg-burgundy transition-all duration-300",
									isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
								)}
							/>
						</div>
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			<div
				className={cn(
					"lg:hidden bg-white border-t transition-all duration-300 overflow-hidden",
					isMobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
				)}
			>
				<nav className="container mx-auto px-4 py-6">
					<div className="flex flex-col space-y-4">
						{navigationItems.map((item) => (
							<div key={item.label}>
								<Link
									href={item.href}
									className="block py-2 text-gray-700 hover:text-burgundy transition-colors font-medium"
									onClick={() => setIsMobileMenuOpen(false)}
								>
									{item.label}
								</Link>

								{/* Mobile Submenu */}
								{item.children && (
									<div className="ml-4 mt-2 space-y-2">
										{item.children.map((child) => (
											<Link
												key={child.label}
												href={child.href}
												className="block py-1 text-sm text-gray-600 hover:text-burgundy transition-colors"
												onClick={() => setIsMobileMenuOpen(false)}
											>
												{child.label}
											</Link>
										))}
									</div>
								)}
							</div>
						))}

						{/* Mobile CTA Buttons */}
						<div className="pt-4 space-y-3">
							<Button variant="outline" className="w-full">
								Download Brochure
							</Button>
							<Button className="w-full">Apply Now</Button>
						</div>
					</div>
				</nav>
			</div>
		</header>
	);
};
