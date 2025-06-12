"use client";

import { motion } from "framer-motion";
import React from "react";
import { Button } from "@/components/ui/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/Card";
import programsData from "@/data/programs.json";
import { Program } from "@/types";

const programs = programsData as Program[];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.2,
		},
	},
};

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 50,
		scale: 0.95,
	},
	visible: {
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.6,
			ease: "easeOut",
		},
	},
};

export const ProgramsSection: React.FC = () => {
	return (
		<section className="py-20 bg-gray-50">
			<div className="container mx-auto px-4">
				{/* Section Header */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-4xl md:text-5xl font-primary font-bold text-burgundy mb-6">
						Academic Programs
					</h2>
					<div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
					<p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
						Discover our comprehensive range of programs designed to nurture
						literary excellence and critical thinking. From undergraduate
						studies to doctoral research, we offer pathways for every aspiring
						scholar.
					</p>
				</motion.div>

				{/* Programs Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-6xl mx-auto"
				>
					{programs.map((program) => (
						<motion.div
							key={program.id}
							variants={cardVariants}
							className="program-card group"
						>
							<Card className="h-full bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
								{/* Program Level Badge */}
								<div className="absolute top-4 right-4 z-10">
									<span
										className={`
                    px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                    ${program.level === "undergraduate" ? "bg-green-100 text-green-800" : ""}
                    ${program.level === "postgraduate" ? "bg-blue-100 text-blue-800" : ""}
                    ${program.level === "doctoral" ? "bg-purple-100 text-purple-800" : ""}
                    ${program.level === "certificate" ? "bg-orange-100 text-orange-800" : ""}
                  `}
									>
										{program.level}
									</span>
								</div>

								{/* Card Header */}
								<CardHeader className="pb-4">
									<CardTitle className="text-2xl text-burgundy group-hover:text-gold transition-colors duration-300">
										{program.title}
									</CardTitle>
									<CardDescription className="text-gray-600 text-base leading-relaxed">
										{program.shortDescription}
									</CardDescription>
								</CardHeader>

								{/* Card Content */}
								<CardContent className="space-y-6">
									{/* Duration and Fees */}
									<div className="flex justify-between items-center">
										<div>
											<span className="text-sm text-gray-500">Duration</span>
											<p className="font-semibold text-burgundy">
												{program.duration}
											</p>
										</div>
										{program.fees && (
											<div className="text-right">
												<span className="text-sm text-gray-500">Fees</span>
												<p className="font-semibold text-gold">
													{program.fees}
												</p>
											</div>
										)}
									</div>

									{/* Program Highlights */}
									<div>
										<h4 className="font-semibold text-gray-800 mb-3">
											Program Highlights
										</h4>
										<ul className="space-y-2">
											{program.highlights.slice(0, 3).map((highlight, idx) => (
												<li key={idx} className="flex items-start">
													<div className="w-2 h-2 bg-gold rounded-full mt-2 mr-3 flex-shrink-0"></div>
													<span className="text-gray-600 text-sm">
														{highlight}
													</span>
												</li>
											))}
										</ul>
									</div>

									{/* Career Prospects Preview */}
									<div>
										<h4 className="font-semibold text-gray-800 mb-2">
											Career Opportunities
										</h4>
										<div className="flex flex-wrap gap-2">
											{program.careerProspects
												.slice(0, 4)
												.map((career, idx) => (
													<span
														key={idx}
														className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
													>
														{career}
													</span>
												))}
										</div>
									</div>

									{/* Action Buttons */}
									<div className="flex gap-3 pt-4">
										<Button
											className="flex-1"
											onClick={() =>
												(window.location.href = `/programs/${program.slug}`)
											}
										>
											Learn More
										</Button>
										<Button
											variant="outline"
											size="sm"
											onClick={() => (window.location.href = "/apply")}
										>
											Apply Now
										</Button>
									</div>
								</CardContent>

								{/* Hover Effect Overlay */}
								<div className="absolute inset-0 bg-gradient-to-t from-burgundy/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
							</Card>
						</motion.div>
					))}
				</motion.div>

				{/* Call to Action */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-12"
				>
					<p className="text-gray-600 mb-6">
						Can&apos;t find what you&apos;re looking for? Explore our complete
						program catalog.
					</p>
					<Button size="lg" variant="outline">
						View All Programs
					</Button>
				</motion.div>
			</div>
		</section>
	);
};
