"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Faculty } from "@/types";
import facultyData from "@/data/faculty.json";

const faculty = facultyData as Faculty[];

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.15,
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

export const FacultySection: React.FC = () => {
	return (
		<section className="py-20 bg-white">
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
						Distinguished Faculty
					</h2>
					<div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
					<p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
						Our renowned faculty members are accomplished scholars, published
						authors, and dedicated mentors who bring decades of academic
						excellence and industry experience to guide your literary journey.
					</p>
				</motion.div>

				{/* Faculty Grid */}
				<motion.div
					variants={containerVariants}
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true, margin: "-100px" }}
					className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
				>
					{faculty.map((member) => (
						<motion.div
							key={member.id}
							variants={cardVariants}
							className="group"
						>
							<Card className="h-full bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
								{/* Faculty Photo */}
								<div className="relative h-64 bg-gradient-to-br from-burgundy to-gold overflow-hidden">
									<div className="absolute inset-0 bg-black/20"></div>
									<div className="absolute bottom-4 left-4 right-4">
										<div className="text-white">
											<h3 className="font-primary font-bold text-lg mb-1">
												{member.name}
											</h3>
											<p className="text-sm opacity-90">{member.designation}</p>
										</div>
									</div>
									{/* Placeholder for actual photo */}
									<div className="absolute top-4 right-4">
										<div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
											<span className="text-white font-bold text-lg">
												{member.name
													.split(" ")
													.map((n) => n[0])
													.join("")}
											</span>
										</div>
									</div>
								</div>

								{/* Faculty Details */}
								<CardContent className="p-6">
									{/* Specialization */}
									<div className="mb-4">
										<h4 className="font-semibold text-gray-800 mb-2 text-sm">
											Specialization
										</h4>
										<div className="flex flex-wrap gap-1">
											{member.specialization.slice(0, 2).map((spec, idx) => (
												<span
													key={idx}
													className="px-2 py-1 bg-burgundy/10 text-burgundy rounded-full text-xs"
												>
													{spec}
												</span>
											))}
										</div>
									</div>

									{/* Experience */}
									<div className="mb-4">
										<div className="flex justify-between items-center">
											<span className="text-sm text-gray-600">Experience</span>
											<span className="font-semibold text-gold">
												{member.experience}+ years
											</span>
										</div>
									</div>

									{/* Publications */}
									<div className="mb-4">
										<span className="text-sm text-gray-600">Publications</span>
										<div className="flex items-center mt-1">
											<div className="flex space-x-1">
												{[
													...Array(Math.min(member.publications.length, 3)),
												].map((_, i) => (
													<div
														key={i}
														className="w-2 h-2 bg-gold rounded-full"
													></div>
												))}
											</div>
											<span className="ml-2 text-sm font-medium text-gray-700">
												{member.publications.length} publications
											</span>
										</div>
									</div>

									{/* Research Areas Preview */}
									{member.researchAreas && (
										<div className="mb-4">
											<h4 className="font-semibold text-gray-800 mb-2 text-sm">
												Research Focus
											</h4>
											<p className="text-xs text-gray-600">
												{member.researchAreas.slice(0, 2).join(", ")}
												{member.researchAreas.length > 2 && "..."}
											</p>
										</div>
									)}

									{/* View Profile Button */}
									<Button
										variant="outline"
										size="sm"
										className="w-full mt-4 group-hover:bg-burgundy group-hover:text-white transition-colors"
									>
										View Profile
									</Button>
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
					transition={{ duration: 0.8, delay: 0.4 }}
					viewport={{ once: true }}
					className="text-center mt-16"
				>
					<div className="bg-gray-50 rounded-2xl p-8 max-w-4xl mx-auto">
						<h3 className="text-2xl font-primary font-bold text-burgundy mb-4">
							Want to Learn from Our Experts?
						</h3>
						<p className="text-gray-700 mb-6">
							Connect with our distinguished faculty members and explore
							research opportunities, mentorship programs, and collaborative
							projects.
						</p>
						<div className="flex flex-col sm:flex-row gap-4 justify-center">
							<Button size="lg">Meet Our Faculty</Button>
							<Button variant="outline" size="lg">
								Research Opportunities
							</Button>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
};
