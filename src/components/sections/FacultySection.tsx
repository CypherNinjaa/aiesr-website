"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useActiveFaculty } from "@/hooks/useFaculty";
import { getPublicPhotoUrl } from "@/services/faculty";

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
  const { data: faculty = [], isLoading, error } = useActiveFaculty();

  if (isLoading) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="border-burgundy inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 text-gray-600">Loading faculty members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-red-600">Failed to load faculty members. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  if (faculty.length === 0) {
    return (
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No faculty members available at the moment.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-20">
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
            Distinguished Faculty
          </h2>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            Our renowned faculty members are accomplished scholars, published authors, and dedicated
            mentors who bring decades of academic excellence and industry experience to guide your
            literary journey.
          </p>
        </motion.div>

        {/* Faculty Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {faculty.map(member => (
            <motion.div key={member.id} variants={cardVariants} className="group">
              <Card className="h-full overflow-hidden border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
                {/* Faculty Photo */}
                <div className="from-burgundy to-gold relative h-64 overflow-hidden bg-gradient-to-br">
                  {member.profile_image_url ? (
                    <Image
                      src={getPublicPhotoUrl(member.profile_image_url)}
                      alt={`${member.name} - Faculty Photo`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      priority={false}
                    />
                  ) : (
                    <div className="from-burgundy to-gold absolute inset-0 bg-gradient-to-br"></div>
                  )}
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute right-4 bottom-4 left-4">
                    <div className="text-white">
                      <h3 className="font-primary mb-1 text-lg font-bold">{member.name}</h3>
                      <p className="text-sm opacity-90">{member.designation}</p>
                    </div>
                  </div>
                  {/* Profile Initials (fallback) */}
                  {!member.profile_image_url && (
                    <div className="absolute top-4 right-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
                        <span className="text-lg font-bold text-white">
                          {member.name
                            .split(" ")
                            .map(n => n[0])
                            .join("")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Faculty Details */}
                <CardContent className="p-6">
                  {/* Specialization */}
                  <div className="mb-4">
                    <h4 className="mb-2 text-sm font-semibold text-gray-800">Specialization</h4>
                    <div className="flex flex-wrap gap-1">
                      {member.specialization.slice(0, 2).map((spec, idx) => (
                        <span
                          key={idx}
                          className="bg-burgundy/10 text-burgundy rounded-full px-2 py-1 text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                      {member.specialization.length > 2 && (
                        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                          +{member.specialization.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Experience</span>
                      <span className="text-gold font-semibold">{member.experience}+ years</span>
                    </div>
                  </div>

                  {/* Publications */}
                  <div className="mb-4">
                    <span className="text-sm text-gray-600">Publications</span>
                    <div className="mt-1 flex items-center">
                      <div className="flex space-x-1">
                        {[...Array(Math.min(member.publications.length, 3))].map((_, i) => (
                          <div key={i} className="bg-gold h-2 w-2 rounded-full"></div>
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {member.publications.length} publications
                      </span>
                    </div>
                  </div>

                  {/* Research Areas Preview */}
                  {member.research_areas && member.research_areas.length > 0 && (
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-semibold text-gray-800">Research Focus</h4>
                      <p className="text-xs text-gray-600">
                        {member.research_areas.slice(0, 2).join(", ")}
                        {member.research_areas.length > 2 && "..."}
                      </p>
                    </div>
                  )}

                  {/* View Profile Button */}
                  {(() => {
                    const slug = member.name
                      .toLowerCase()
                      .replace(/\s+/g, "-")
                      .replace(/[^a-z0-9-]/g, "");
                    return (
                      <Link href={`/faculty/${slug}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="group-hover:bg-burgundy mt-4 w-full transition-colors group-hover:text-white"
                        >
                          View Profile
                        </Button>
                      </Link>
                    );
                  })()}
                </CardContent>

                {/* Hover Effect */}
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
          className="mt-16 text-center"
        >
          <div className="mx-auto max-w-4xl rounded-2xl bg-gray-50 p-8">
            <h3 className="font-primary text-burgundy mb-4 text-2xl font-bold">
              Want to Learn from Our Experts?
            </h3>
            <p className="mb-6 text-gray-700">
              Connect with our distinguished faculty members and explore research opportunities,
              mentorship programs, and collaborative projects.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
