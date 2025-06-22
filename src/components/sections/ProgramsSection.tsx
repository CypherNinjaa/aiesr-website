"use client";

import { motion } from "framer-motion";
import { Loader2, ExternalLink } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useFeaturedPrograms } from "@/hooks/usePrograms";

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
  const { data: programs, isLoading, error } = useFeaturedPrograms();

  if (isLoading) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="text-burgundy mx-auto h-8 w-8 animate-spin" />
            <p className="mt-4 text-gray-600">Loading programs...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Error loading programs. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (!programs || programs.length === 0) {
    return (
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No programs available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <h2 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            Academic Programs
          </h2>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            Discover our comprehensive range of programs designed to nurture literary excellence and
            critical thinking. From undergraduate studies to doctoral research, we offer pathways
            for every aspiring scholar.
          </p>
        </motion.div>

        {/* Programs Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2"
        >
          {programs.map(program => (
            <motion.div key={program.id} variants={cardVariants} className="program-card group">
              <Card className="h-full overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl">
                {/* Program Level Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase ${program.level === "undergraduate" ? "bg-green-100 text-green-800" : ""} ${program.level === "postgraduate" ? "bg-blue-100 text-blue-800" : ""} ${program.level === "doctoral" ? "bg-purple-100 text-purple-800" : ""} ${program.level === "certificate" ? "bg-orange-100 text-orange-800" : ""} `}
                  >
                    {program.level}
                  </span>
                </div>

                {/* Card Header */}
                <CardHeader className="pb-4">
                  <CardTitle className="text-burgundy group-hover:text-gold text-2xl transition-colors duration-300">
                    {program.title}
                  </CardTitle>
                  <CardDescription className="text-base leading-relaxed text-gray-600">
                    {program.short_description}
                  </CardDescription>
                </CardHeader>

                {/* Card Content */}
                <CardContent className="space-y-6">
                  {/* Duration and Fees */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm text-gray-500">Duration</span>
                      <p className="text-burgundy font-semibold">{program.duration}</p>
                    </div>
                    {program.fees && (
                      <div className="text-right">
                        <span className="text-sm text-gray-500">Fees</span>
                        <p className="text-gold font-semibold">{program.fees}</p>
                      </div>
                    )}
                  </div>

                  {/* Program Highlights */}
                  <div>
                    <h4 className="mb-3 font-semibold text-gray-800">Program Highlights</h4>
                    <ul className="space-y-2">
                      {program.highlights.slice(0, 3).map((highlight, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="bg-gold mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full"></div>
                          <span className="text-sm text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Career Prospects Preview */}
                  <div>
                    <h4 className="mb-2 font-semibold text-gray-800">Career Opportunities</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.career_prospects.slice(0, 4).map((career, idx) => (
                        <span
                          key={idx}
                          className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700"
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
                      onClick={() => {
                        if (program.learn_more_content) {
                          window.location.href = `/programs/${program.slug}`;
                        } else {
                          window.location.href = `/programs`;
                        }
                      }}
                    >
                      Learn More
                    </Button>
                    {program.apply_link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => window.open(program.apply_link, "_blank")}
                      >
                        Apply Now
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className="from-burgundy/5 pointer-events-none absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
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
          className="mt-12 text-center"
        >
          <p className="mb-6 text-gray-600">
            Can&apos;t find what you&apos;re looking for? Explore our complete program catalog.
          </p>
          <Button size="lg" variant="outline" onClick={() => (window.location.href = "/programs")}>
            View All Programs
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
