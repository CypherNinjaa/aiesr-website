"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { useAchievementStats } from "@/hooks/useAchievements";

const features = [
  {
    icon: "🏆",
    title: "Our Achievements",
    description:
      "Celebrating remarkable accomplishments of our students, faculty, and institution in academic excellence and research.",
    stats: "View All",
    link: "/achievements",
    isExternal: false,
  },
  {
    icon: "🎓",
    title: "Academic Excellence",
    description:
      "Top-ranked faculty with decades of experience and published research in prestigious journals.",
    stats: "95% Success Rate",
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
    icon: "👥",
    title: "Our Alumni",
    description:
      "Our distinguished alumni network spans across various industries, from academia to corporate leadership, making significant contributions worldwide.",
    stats: "500+ Alumni Network",
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
  const { data: achievementStats } = useAchievementStats();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-white py-20">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="text-burgundy font-script absolute top-20 left-10 text-8xl">❝</div>
        <div className="text-gold absolute right-10 bottom-20 text-6xl">✍️</div>
        <div className="bg-burgundy absolute top-1/2 left-1/4 h-40 w-32 rotate-12 transform rounded-lg"></div>
        <div className="bg-gold absolute right-1/3 bottom-1/4 h-32 w-24 -rotate-12 transform rounded-lg"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            Why Choose AIESR?
          </h2>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            Discover what makes AIESR the premier destination for English Studies and Research. Our
            commitment to excellence, innovation, and student success sets us apart.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {" "}
          {features.map((feature, index) => {
            return (
              <motion.div key={index} variants={cardVariants} className="group">
                {" "}
                {feature.link ? (
                  <Link href={feature.link} className="block">
                    <Card className="h-full cursor-pointer overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                      <CardContent className="p-8 text-center">
                        {/* Icon */}
                        <div className="mb-6 text-6xl transition-transform duration-300 group-hover:scale-110">
                          {feature.icon}
                        </div>

                        {/* Title */}
                        <h3 className="font-primary mb-4 text-2xl font-bold text-red-800 transition-colors duration-300 group-hover:text-yellow-600">
                          {feature.title}
                        </h3>

                        {/* Description */}
                        <p className="mb-6 leading-relaxed text-gray-600">{feature.description}</p>

                        {/* Stats */}
                        <div className="inline-block rounded-full bg-gradient-to-r from-red-800 to-yellow-600 px-4 py-2">
                          <span className="text-sm font-semibold text-white">
                            {feature.title === "Our Achievements" && achievementStats
                              ? `${achievementStats.total}+ Achievements`
                              : feature.stats}
                          </span>
                        </div>
                      </CardContent>

                      {/* Hover Effect */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-800/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </Card>
                  </Link>
                ) : (
                  <Card className="h-full overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                    <CardContent className="p-8 text-center">
                      {/* Icon */}
                      <div className="mb-6 text-6xl transition-transform duration-300 group-hover:scale-110">
                        {feature.icon}
                      </div>

                      {/* Title */}
                      <h3 className="font-primary mb-4 text-2xl font-bold text-red-800 transition-colors duration-300 group-hover:text-yellow-600">
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="mb-6 leading-relaxed text-gray-600">{feature.description}</p>

                      {/* Stats */}
                      <div className="inline-block rounded-full bg-gradient-to-r from-red-800 to-yellow-600 px-4 py-2">
                        <span className="text-sm font-semibold text-white">{feature.stats}</span>
                      </div>
                    </CardContent>

                    {/* Hover Effect */}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-red-800/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </Card>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
