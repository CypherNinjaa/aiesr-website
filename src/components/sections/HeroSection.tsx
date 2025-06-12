"use client";

import { motion } from "framer-motion";
import React, { useEffect, useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";

export const HeroSection: React.FC = () => {
	const [currentText, setCurrentText] = useState("");
	const [textIndex, setTextIndex] = useState(0);
	const [charIndex, setCharIndex] = useState(0);
	const [isDeleting, setIsDeleting] = useState(false);

	const texts = useMemo(
		() => [
			"Where Words Come Alive",
			"Craft Your Literary Legacy",
			"Discover the Power of Language",
			"Shape Your Future in Literature",
		],
		[]
	);

	useEffect(() => {
		const currentFullText = texts[textIndex];
		const typingSpeed = isDeleting ? 50 : 100;
		const pauseTime = isDeleting ? 500 : 2000;

		const timeout = setTimeout(() => {
			if (!isDeleting) {
				if (charIndex < currentFullText.length) {
					setCurrentText(currentFullText.slice(0, charIndex + 1));
					setCharIndex(charIndex + 1);
				} else {
					setTimeout(() => setIsDeleting(true), pauseTime);
				}
			} else {
				if (charIndex > 0) {
					setCurrentText(currentFullText.slice(0, charIndex - 1));
					setCharIndex(charIndex - 1);
				} else {
					setIsDeleting(false);
					setTextIndex((textIndex + 1) % texts.length);
				}
			}
		}, typingSpeed);

		return () => clearTimeout(timeout);
	}, [charIndex, isDeleting, textIndex, texts]);

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				delayChildren: 0.3,
				staggerChildren: 0.2,
			},
		},
	};

	const itemVariants = {
		hidden: { y: 50, opacity: 0 },
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.8,
				ease: "easeOut",
			},
		},
	};

	return (
		<section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream via-white to-gray-50">
			{/* Background Elements */}
			<div className="absolute inset-0 z-0">
				{/* Floating Books */}
				<div className="absolute top-20 left-10 floating-books opacity-20">
					<div className="w-16 h-20 bg-burgundy rounded shadow-lg transform -rotate-12"></div>
				</div>
				<div className="absolute top-40 right-20 floating-books opacity-15 animation-delay-2000">
					<div className="w-12 h-16 bg-gold rounded shadow-lg transform rotate-12"></div>
				</div>
				<div className="absolute bottom-40 left-20 floating-books opacity-25 animation-delay-4000">
					<div className="w-14 h-18 bg-gray-600 rounded shadow-lg transform rotate-6"></div>
				</div>

				{/* Decorative Elements */}
				<div className="absolute top-1/4 right-1/4 w-2 h-2 bg-gold rounded-full opacity-40"></div>
				<div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-burgundy rounded-full opacity-30"></div>
				<div className="absolute top-2/3 right-1/3 w-1 h-1 bg-gray-400 rounded-full opacity-50"></div>

				{/* Ink Blot Effect */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-burgundy rounded-full opacity-5 blur-3xl"></div>
				<div className="absolute bottom-0 left-0 w-80 h-80 bg-gold rounded-full opacity-5 blur-3xl"></div>
			</div>

			{/* Main Content */}
			<motion.div
				className="relative z-10 container mx-auto px-4 text-center"
				variants={containerVariants}
				initial="hidden"
				animate="visible"
			>
				<div className="max-w-4xl mx-auto">
					{/* Main Heading */}
					<motion.div variants={itemVariants} className="mb-8">
						<h1 className="text-5xl md:text-6xl lg:text-7xl font-primary font-bold text-burgundy mb-4">
							<span className="block">
								{currentText}
								<span className="border-r-3 border-gold animate-pulse ml-1">
									|
								</span>
							</span>
						</h1>
						<div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
					</motion.div>
					{/* Subtitle */}{" "}
					<motion.p
						variants={itemVariants}
						className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed max-w-3xl mx-auto"
					>
						Shape your future in English Studies and Research at one of
						India&apos;s premier institutes. Join a community of scholars,
						writers, and researchers passionate about literature.
					</motion.p>
					{/* Statistics */}
					<motion.div
						variants={itemVariants}
						className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 max-w-2xl mx-auto"
					>
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-burgundy font-primary">
								500+
							</div>
							<div className="text-gray-600 text-sm uppercase tracking-wide">
								Students
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-burgundy font-primary">
								50+
							</div>
							<div className="text-gray-600 text-sm uppercase tracking-wide">
								Faculty
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-burgundy font-primary">
								25+
							</div>
							<div className="text-gray-600 text-sm uppercase tracking-wide">
								Programs
							</div>
						</div>
						<div className="text-center">
							<div className="text-3xl md:text-4xl font-bold text-burgundy font-primary">
								95%
							</div>
							<div className="text-gray-600 text-sm uppercase tracking-wide">
								Placement
							</div>
						</div>
					</motion.div>
					{/* Call-to-Action Buttons */}
					<motion.div
						variants={itemVariants}
						className="flex flex-col sm:flex-row gap-4 justify-center items-center"
					>
						<Button size="lg" className="px-8 py-4 text-lg">
							Explore Programs
						</Button>
						<Button variant="outline" size="lg" className="px-8 py-4 text-lg">
							Virtual Campus Tour
						</Button>
					</motion.div>
					{/* Scroll Indicator */}
					<motion.div
						variants={itemVariants}
						className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
					>
						<div className="flex flex-col items-center">
							<span className="text-sm text-gray-500 mb-2">
								Scroll to explore
							</span>
							<div className="w-6 h-10 border-2 border-gray-300 rounded-full flex justify-center">
								<div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-bounce"></div>
							</div>
						</div>
					</motion.div>
				</div>
			</motion.div>

			{/* Quote Section */}
			<div className="absolute bottom-20 left-8 right-8 md:left-20 md:right-20">
				<motion.blockquote
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 1.5, duration: 0.8 }}
					className="text-center"
				>
					{" "}
					<p className="text-lg md:text-xl text-gray-600 font-script italic">
						&ldquo;Literature is the most agreeable way of ignoring life.&rdquo;
					</p>
					<cite className="text-sm text-gray-500 mt-2 block">
						— Fernando Pessoa
					</cite>
				</motion.blockquote>
			</div>
		</section>
	);
};
