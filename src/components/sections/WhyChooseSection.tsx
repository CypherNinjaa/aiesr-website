"use client";

import { motion } from "framer-motion";
import React from "react";
import { Card, CardContent } from "@/components/ui/Card";

const features = [
	{
		icon: "🏆",
		title: "Academic Excellence",
		description:
			"Top-ranked faculty with decades of experience and published research in prestigious journals.",
		stats: "95% Success Rate",
	},
	{
		icon: "🔬",
		title: "Research Opportunities",
		description:
			"State-of-the-art research facilities and opportunities to publish in international journals.",
		stats: "200+ Publications",
	},
	{
		icon: "🤝",
		title: "Industry Connections",
		description:
			"Strong alumni network and partnerships with leading publishers, media houses, and educational institutions.",
		stats: "500+ Alumni Network",
	},
	{
		icon: "🌱",
		title: "Holistic Development",
		description:
			"Literary societies, writing workshops, and cultural events to nurture creative and critical thinking.",
		stats: "50+ Events/Year",
	},
	{
		icon: "💼",
		title: "Career Support",
		description:
			"Dedicated placement cell with career guidance, internship opportunities, and job placement assistance.",
		stats: "85% Placement Rate",
	},
	{
		icon: "🏛️",
		title: "Modern Infrastructure",
		description:
			"Digital libraries, smart classrooms, research centers, and collaborative learning spaces.",
		stats: "50,000+ Books",
	},
];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 30,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.5,
			ease: "easeOut",
		},
	},
};

export const WhyChooseSection: React.FC = () => {
	return (
		<section className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
			{/* Background Elements */}
			<div className="absolute inset-0 opacity-5">
				<div className="absolute top-20 left-10 text-8xl text-burgundy font-script">
					❝
				</div>
				<div className="absolute bottom-20 right-10 text-6xl text-gold">✍️</div>
				<div className="absolute top-1/2 left-1/4 w-32 h-40 bg-burgundy rounded-lg transform rotate-12"></div>
				<div className="absolute bottom-1/4 right-1/3 w-24 h-32 bg-gold rounded-lg transform -rotate-12"></div>
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
					<h2 className="text-4xl md:text-5xl font-primary font-bold text-burgundy mb-6">
						Why Choose AIESR?
					</h2>
					<div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
					<p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
						Discover what makes AIESR the premier destination for English
						Studies and Research. Our commitment to excellence, innovation, and
						student success sets us apart.
					</p>
				</motion.div>

				{/* Features Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
				>
					{features.map((feature, index) => (
						<motion.div key={index} variants={cardVariants} className="group">
							<Card className="h-full bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
								<CardContent className="p-8 text-center">
									{/* Icon */}
									<div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
										{feature.icon}
									</div>

									{/* Title */}
									<h3 className="text-2xl font-primary font-bold text-burgundy mb-4 group-hover:text-gold transition-colors duration-300">
										{feature.title}
									</h3>

									{/* Description */}
									<p className="text-gray-600 leading-relaxed mb-6">
										{feature.description}
									</p>

									{/* Stats */}
									<div className="bg-gradient-to-r from-burgundy to-gold rounded-full py-2 px-4 inline-block">
										<span className="text-white font-semibold text-sm">
											{feature.stats}
										</span>
									</div>
								</CardContent>

								{/* Hover Effect */}
								<div className="absolute inset-0 bg-gradient-to-t from-burgundy/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.6 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-burgundy rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-white relative overflow-hidden">
						{/* Background Pattern */}
						<div className="absolute inset-0 opacity-10">
							<div className="absolute top-4 right-4 text-4xl text-gold">
								📖
							</div>
							<div className="absolute bottom-4 left-4 text-3xl text-gold font-script">
								✨
							</div>
						</div>

						<div className="relative z-10">
							<h3 className="text-3xl md:text-4xl font-primary font-bold mb-6">
								Ready to Begin Your Literary Journey?
							</h3>
							<p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
								Join thousands of successful alumni who have transformed their
								passion for literature into rewarding careers. Your story starts
								here.
							</p>

							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="bg-gold hover:bg-yellow-600 text-burgundy px-8 py-4 rounded-lg font-semibold text-lg transition-colors duration-300 shadow-lg"
								>
									Apply Now
								</motion.button>
								<motion.button
									whileHover={{ scale: 1.05 }}
									whileTap={{ scale: 0.95 }}
									className="border-2 border-white text-white hover:bg-white hover:text-burgundy px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
								>
									Schedule Campus Visit
								</motion.button>
							</div>

							{/* Additional Info */}
							<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/20">
								<div className="text-center">
									<div className="text-2xl font-bold text-gold mb-2">₹2.5L</div>
									<div className="text-sm text-gray-200">
										Average Starting Package
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gold mb-2">100%</div>
									<div className="text-sm text-gray-200">
										Scholarship Available
									</div>
								</div>
								<div className="text-center">
									<div className="text-2xl font-bold text-gold mb-2">24/7</div>
									<div className="text-sm text-gray-200">Student Support</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
