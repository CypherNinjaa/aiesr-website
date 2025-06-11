"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export const ContactSection: React.FC = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		program: "",
		message: "",
	});

	const handleInputChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", formData);
		// Here you would typically send the data to your backend
		alert("Thank you for your inquiry! We will get back to you soon.");
		setFormData({
			name: "",
			email: "",
			phone: "",
			program: "",
			message: "",
		});
	};

	const contactInfo = [
		{
			icon: "📧",
			title: "Email Us",
			details: ["admissions@aiesr.amity.edu", "info@aiesr.amity.edu"],
			action: "Send Email",
		},
		{
			icon: "📞",
			title: "Call Us",
			details: ["+91 612 2346789", "+91 612 2346790"],
			action: "Call Now",
		},
		{
			icon: "📍",
			title: "Visit Us",
			details: ["Amity University Campus", "Patna, Bihar 800014"],
			action: "Get Directions",
		},
		{
			icon: "💬",
			title: "Live Chat",
			details: ["Available 9 AM - 6 PM", "Monday to Saturday"],
			action: "Start Chat",
		},
	];

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
						Get in Touch
					</h2>
					<div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>{" "}
					<p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
						Have questions about our programs or admissions? We&apos;re here to
						help you start your journey in English Studies and Research. Reach
						out to us today!
					</p>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
					{/* Contact Form */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
					>
						<Card className="shadow-xl border-0">
							<CardHeader>
								<CardTitle className="text-2xl text-burgundy font-primary">
									Send us a Message
								</CardTitle>{" "}
								<p className="text-gray-600">
									Fill out the form below and we&apos;ll get back to you within
									24 hours.
								</p>
							</CardHeader>
							<CardContent>
								<form onSubmit={handleSubmit} className="space-y-6">
									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="name"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Full Name *
											</label>
											<input
												type="text"
												id="name"
												name="name"
												value={formData.name}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
												placeholder="Enter your full name"
											/>
										</div>
										<div>
											<label
												htmlFor="email"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Email Address *
											</label>
											<input
												type="email"
												id="email"
												name="email"
												value={formData.email}
												onChange={handleInputChange}
												required
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
												placeholder="Enter your email"
											/>
										</div>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
										<div>
											<label
												htmlFor="phone"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Phone Number
											</label>
											<input
												type="tel"
												id="phone"
												name="phone"
												value={formData.phone}
												onChange={handleInputChange}
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
												placeholder="Enter your phone number"
											/>
										</div>
										<div>
											<label
												htmlFor="program"
												className="block text-sm font-medium text-gray-700 mb-2"
											>
												Program of Interest
											</label>
											<select
												id="program"
												name="program"
												value={formData.program}
												onChange={handleInputChange}
												className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors"
											>
												<option value="">Select a program</option>
												<option value="ba-english">
													B.A. English Literature
												</option>
												<option value="ma-english">
													M.A. English Literature
												</option>
												<option value="phd-english">
													Ph.D. English Literature
												</option>
												<option value="creative-writing">
													Creative Writing Certificate
												</option>
												<option value="other">Other</option>
											</select>
										</div>
									</div>

									<div>
										<label
											htmlFor="message"
											className="block text-sm font-medium text-gray-700 mb-2"
										>
											Message *
										</label>
										<textarea
											id="message"
											name="message"
											value={formData.message}
											onChange={handleInputChange}
											required
											rows={5}
											className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gold focus:border-transparent transition-colors resize-none"
											placeholder="Tell us about your questions or interests..."
										></textarea>
									</div>

									<Button type="submit" size="lg" className="w-full">
										Send Message
									</Button>
								</form>
							</CardContent>
						</Card>
					</motion.div>

					{/* Contact Information */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8 }}
						viewport={{ once: true }}
						className="space-y-6"
					>
						{/* Contact Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
							{contactInfo.map((item, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: index * 0.1 }}
									viewport={{ once: true }}
								>
									<Card className="h-full hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
										<CardContent className="p-6 text-center">
											<div className="text-4xl mb-4">{item.icon}</div>
											<h3 className="font-semibold text-burgundy mb-3">
												{item.title}
											</h3>
											<div className="space-y-1 mb-4">
												{item.details.map((detail, idx) => (
													<p key={idx} className="text-sm text-gray-600">
														{detail}
													</p>
												))}
											</div>
											<Button variant="outline" size="sm" className="w-full">
												{item.action}
											</Button>
										</CardContent>
									</Card>
								</motion.div>
							))}
						</div>

						{/* Map Placeholder */}
						<Card className="overflow-hidden shadow-lg border-0">
							<div className="h-64 bg-gradient-to-br from-burgundy to-gold relative">
								<div className="absolute inset-0 bg-black/20"></div>
								<div className="absolute inset-0 flex items-center justify-center">
									<div className="text-center text-white">
										<div className="text-4xl mb-4">🗺️</div>
										<h3 className="text-xl font-semibold mb-2">
											Campus Location
										</h3>
										<p className="text-sm opacity-90">
											Interactive map coming soon
										</p>
										<Button
											variant="outline"
											className="mt-4 border-white text-white hover:bg-white hover:text-burgundy"
											size="sm"
										>
											View on Google Maps
										</Button>
									</div>
								</div>
							</div>
						</Card>

						{/* Additional Info */}
						<Card className="bg-burgundy text-white border-0">
							<CardContent className="p-6">
								<h3 className="text-xl font-semibold mb-4 font-primary">
									Admissions Office Hours
								</h3>
								<div className="space-y-3">
									<div className="flex justify-between">
										<span>Monday - Friday</span>
										<span>9:00 AM - 6:00 PM</span>
									</div>
									<div className="flex justify-between">
										<span>Saturday</span>
										<span>9:00 AM - 2:00 PM</span>
									</div>
									<div className="flex justify-between">
										<span>Sunday</span>
										<span>Closed</span>
									</div>
								</div>
								<div className="mt-6 pt-4 border-t border-white/20">
									<p className="text-sm text-gray-200">
										For urgent inquiries outside office hours, please email us
										at
										<span className="text-gold"> urgent@aiesr.amity.edu</span>
									</p>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</div>
			</div>
		</section>
	);
};
