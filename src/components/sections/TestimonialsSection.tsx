"use client";

import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import testimonialsData from "@/data/testimonials.json";
import { Testimonial } from "@/types";

const testimonials = testimonialsData as Testimonial[];

export const TestimonialsSection: React.FC = () => {
	const [currentIndex, setCurrentIndex] = useState(0);
	const [isAutoPlaying, setIsAutoPlaying] = useState(true);

	useEffect(() => {
		if (!isAutoPlaying) return;

		const interval = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % testimonials.length);
		}, 5000);

		return () => clearInterval(interval);
	}, [isAutoPlaying]);

	const nextTestimonial = () => {
		setCurrentIndex((prev) => (prev + 1) % testimonials.length);
		setIsAutoPlaying(false);
	};

	const prevTestimonial = () => {
		setCurrentIndex(
			(prev) => (prev - 1 + testimonials.length) % testimonials.length
		);
		setIsAutoPlaying(false);
	};

	const currentTestimonial = testimonials[currentIndex];

	return (
		<section className="py-20 bg-gradient-to-br from-burgundy via-burgundy to-red-900 text-white relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 opacity-10">
				<div className="absolute top-20 left-10 w-32 h-40 bg-gold rounded-lg transform rotate-12"></div>
				<div className="absolute bottom-20 right-10 w-24 h-32 bg-white rounded-lg transform -rotate-12"></div>
				<div className="absolute top-1/2 left-1/4 w-4 h-4 bg-gold rounded-full"></div>
				<div className="absolute bottom-1/4 right-1/3 w-6 h-6 bg-white rounded-full"></div>
			</div>

			<div className="container mx-auto px-4 relative z-10">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-primary font-bold text-white mb-6">
						Student Success Stories
					</h2>
					<div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
					<p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
						Hear from our alumni who have transformed their passion for
						literature into successful careers across various industries.
					</p>
				</motion.div>

				{/* Testimonial Carousel */}
				<div className="max-w-4xl mx-auto">
					<AnimatePresence mode="wait">
						<motion.div
							key={currentIndex}
							initial={{ opacity: 0, x: 50 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -50 }}
							transition={{ duration: 0.5 }}
							className="text-center"
						>
							{" "}
							{/* Quote */}
							<div className="mb-8">
								<div className="text-6xl text-gold mb-4 font-script">
									&ldquo;
								</div>
								<blockquote className="text-2xl md:text-3xl font-light leading-relaxed text-gray-100 italic">
									{currentTestimonial.quote}
								</blockquote>
								<div className="text-6xl text-gold mt-4 font-script transform rotate-180">
									&rdquo;
								</div>
							</div>
							{/* Student Info */}
							<div className="flex flex-col items-center">
								{/* Avatar */}
								<div className="w-20 h-20 bg-gold rounded-full flex items-center justify-center mb-4 shadow-lg">
									<span className="text-2xl font-bold text-burgundy">
										{currentTestimonial.name
											.split(" ")
											.map((n) => n[0])
											.join("")}
									</span>
								</div>

								{/* Name and Details */}
								<h3 className="text-2xl font-bold text-white mb-2">
									{currentTestimonial.name}
								</h3>
								<p className="text-gold font-medium mb-1">
									{currentTestimonial.program} • Class of{" "}
									{currentTestimonial.year}
								</p>
								{currentTestimonial.currentPosition && (
									<p className="text-gray-300 text-sm">
										{currentTestimonial.currentPosition}
										{currentTestimonial.company &&
											` at ${currentTestimonial.company}`}
									</p>
								)}
							</div>
						</motion.div>
					</AnimatePresence>

					{/* Navigation */}
					<div className="flex justify-center items-center mt-12 space-x-6">
						<button
							onClick={prevTestimonial}
							className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
							aria-label="Previous testimonial"
						>
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
						</button>

						{/* Indicators */}
						<div className="flex space-x-2">
							{testimonials.map((_, index) => (
								<button
									key={index}
									onClick={() => {
										setCurrentIndex(index);
										setIsAutoPlaying(false);
									}}
									className={`w-3 h-3 rounded-full transition-colors ${
										index === currentIndex ? "bg-gold" : (
											"bg-white/30 hover:bg-white/50"
										)
									}`}
									aria-label={`Go to testimonial ${index + 1}`}
								/>
							))}
						</div>

						<button
							onClick={nextTestimonial}
							className="w-12 h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
							aria-label="Next testimonial"
						>
							<svg
								className="w-6 h-6 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<h3 className="text-2xl font-primary font-bold text-white mb-4">
						Ready to Write Your Success Story?
					</h3>
					<p className="text-gray-200 mb-8 max-w-2xl mx-auto">
						Join our community of successful alumni and start your journey
						towards literary excellence and career success.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Button
							size="lg"
							className="bg-gold hover:bg-yellow-600 text-burgundy border-0 font-semibold"
						>
							Start Your Application
						</Button>
						<Button
							variant="outline"
							size="lg"
							className="border-white text-white hover:bg-white hover:text-burgundy"
						>
							Connect with Alumni
						</Button>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
