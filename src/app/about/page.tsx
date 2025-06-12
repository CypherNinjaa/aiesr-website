import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function AboutPage() {
	return (
		<div className="min-h-screen pt-20">
			{/* Hero Section */}
			<section className="py-20 bg-gradient-to-br from-burgundy to-red-900 text-white">
				<div className="container mx-auto px-4 text-center">
					<h1 className="text-5xl md:text-6xl font-primary font-bold mb-6">
						About AIESR
					</h1>
					<div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
					<p className="text-xl max-w-3xl mx-auto leading-relaxed">
						Discover the rich history, mission, and vision that drives our
						commitment to excellence in English Studies and Research.
					</p>
				</div>
			</section>

			{/* History Section */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div>
							<h2 className="text-4xl font-primary font-bold text-burgundy mb-6">
								Our Legacy
							</h2>{" "}
							<p className="text-lg text-gray-700 leading-relaxed mb-6">
								Established as part of Amity University&apos;s commitment to
								liberal arts education, the Amity Institute of English Studies
								and Research (AIESR) has been at the forefront of literary
								education and research in Eastern India.
							</p>
							<p className="text-lg text-gray-700 leading-relaxed mb-6">
								Since our inception, we have nurtured thousands of students,
								helping them develop critical thinking skills, literary
								appreciation, and creative expression that serve them throughout
								their careers.
							</p>
							<Button size="lg">Learn More About Our History</Button>
						</div>
						<div className="bg-gradient-to-br from-gold to-burgundy rounded-2xl p-8 text-white">
							<h3 className="text-2xl font-bold mb-6">Key Milestones</h3>
							<div className="space-y-4">
								<div className="flex items-center space-x-4">
									<div className="w-3 h-3 bg-white rounded-full"></div>
									<span>Established as premier English studies institute</span>
								</div>
								<div className="flex items-center space-x-4">
									<div className="w-3 h-3 bg-white rounded-full"></div>
									<span>Launched Ph.D. programs in Literature</span>
								</div>
								<div className="flex items-center space-x-4">
									<div className="w-3 h-3 bg-white rounded-full"></div>
									<span>Achieved 95% placement rate</span>
								</div>
								<div className="flex items-center space-x-4">
									<div className="w-3 h-3 bg-white rounded-full"></div>
									<span>Published 200+ research papers</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Mission & Vision */}
			<section className="py-20 bg-gray-50">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-primary font-bold text-burgundy mb-6">
							Mission & Vision
						</h2>
						<div className="w-24 h-1 bg-gold mx-auto rounded-full"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
						<Card className="shadow-xl border-0">
							<CardHeader>
								<CardTitle className="text-2xl text-burgundy font-primary flex items-center">
									<span className="text-3xl mr-3">🎯</span>
									Our Mission
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-700 leading-relaxed">
									To provide world-class education in English Studies and
									Research, fostering critical thinking, creative expression,
									and scholarly excellence. We aim to prepare students for
									successful careers while contributing to the advancement of
									literary knowledge and cultural understanding.
								</p>
							</CardContent>
						</Card>

						<Card className="shadow-xl border-0">
							<CardHeader>
								<CardTitle className="text-2xl text-burgundy font-primary flex items-center">
									<span className="text-3xl mr-3">🌟</span>
									Our Vision
								</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-gray-700 leading-relaxed">
									To be recognized as a leading institute for English Studies
									and Research in India and globally, known for academic
									excellence, innovative research, and the holistic development
									of students who become leaders in their fields and
									contributors to society.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</section>

			{/* Values */}
			<section className="py-20 bg-white">
				<div className="container mx-auto px-4">
					<div className="text-center mb-16">
						<h2 className="text-4xl font-primary font-bold text-burgundy mb-6">
							Our Values
						</h2>
						<div className="w-24 h-1 bg-gold mx-auto rounded-full mb-6"></div>
						<p className="text-xl text-gray-700 max-w-3xl mx-auto">
							The principles that guide everything we do at AIESR
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						{[
							{
								icon: "📚",
								title: "Academic Excellence",
								description:
									"Commitment to the highest standards of teaching, learning, and research in all our programs.",
							},
							{
								icon: "🤝",
								title: "Inclusive Community",
								description:
									"Fostering a diverse, welcoming environment where all voices are heard and valued.",
							},
							{
								icon: "💡",
								title: "Innovation",
								description:
									"Encouraging creative thinking and new approaches to literary studies and research.",
							},
							{
								icon: "🌍",
								title: "Global Perspective",
								description:
									"Preparing students to engage with literature and culture in an interconnected world.",
							},
							{
								icon: "⚖️",
								title: "Integrity",
								description:
									"Upholding the highest ethical standards in all academic and professional endeavors.",
							},
							{
								icon: "🚀",
								title: "Growth Mindset",
								description:
									"Continuous learning and improvement for students, faculty, and the institution.",
							},
						].map((value, index) => (
							<Card
								key={index}
								className="text-center shadow-lg border-0 hover:shadow-xl transition-shadow"
							>
								<CardContent className="p-8">
									<div className="text-5xl mb-4">{value.icon}</div>
									<h3 className="text-xl font-bold text-burgundy mb-4">
										{value.title}
									</h3>
									<p className="text-gray-600 leading-relaxed">
										{value.description}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
