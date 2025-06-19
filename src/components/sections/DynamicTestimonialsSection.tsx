"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useFeaturedTestimonials } from "@/hooks/useTestimonials";
import { DatabaseTestimonial } from "@/types";

// Component to transform database testimonial to display format
const transformTestimonial = (dbTestimonial: DatabaseTestimonial) => ({
  id: dbTestimonial.id,
  name: dbTestimonial.student_name,
  program: dbTestimonial.academic_program || "AIESR Program",
  year: dbTestimonial.graduation_year?.toString() || "Recent",
  quote: dbTestimonial.story_text,
  currentPosition: dbTestimonial.current_position,
  company: dbTestimonial.company,
  image: dbTestimonial.photo_url || "",
});

export const DynamicTestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Fetch featured testimonials from database
  const { data: dbTestimonials, isLoading, error } = useFeaturedTestimonials(6);
  // Transform database testimonials to display format
  const testimonials = dbTestimonials?.map(transformTestimonial) || [];

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 6000); // Slightly slower for reading

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
    setIsAutoPlaying(false);
  };

  const prevTestimonial = () => {
    if (testimonials.length === 0) return;
    setCurrentIndex(prev => (prev - 1 + testimonials.length) % testimonials.length);
    setIsAutoPlaying(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="from-burgundy via-burgundy relative overflow-hidden bg-gradient-to-br to-red-900 py-20 text-white">
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <div className="border-gold mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-t-2"></div>
            <p className="text-gray-200">Loading success stories...</p>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section className="from-burgundy via-burgundy relative overflow-hidden bg-gradient-to-br to-red-900 py-20 text-white">
        <div className="relative z-10 container mx-auto px-4">
          <div className="text-center">
            <p className="mb-4 text-red-200">Unable to load testimonials at this time.</p>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="hover:text-burgundy border-white text-white hover:bg-white"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  // No testimonials state
  if (testimonials.length === 0) {
    return (
      <section className="from-burgundy via-burgundy relative overflow-hidden bg-gradient-to-br to-red-900 py-20 text-white">
        <div className="relative z-10 container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-primary mb-6 text-4xl font-bold text-white md:text-5xl">
              Student Success Stories
            </h2>
            <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-200">
              Be the first to share your success story with AIESR!
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  const currentTestimonial = testimonials[currentIndex];

  return (
    <section className="from-burgundy via-burgundy relative overflow-hidden bg-gradient-to-br to-red-900 py-20 text-white">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="bg-gold absolute top-20 left-10 h-40 w-32 rotate-12 transform rounded-lg"></div>
        <div className="absolute right-10 bottom-20 h-32 w-24 -rotate-12 transform rounded-lg bg-white"></div>
        <div className="bg-gold absolute top-1/2 left-1/4 h-4 w-4 rounded-full"></div>
        <div className="absolute right-1/3 bottom-1/4 h-6 w-6 rounded-full bg-white"></div>
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
          <h2 className="font-primary mb-6 text-4xl font-bold text-white drop-shadow-lg md:text-5xl">
            Student Success Stories
          </h2>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full drop-shadow-md"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-200 drop-shadow-md">
            Hear from our alumni who have transformed their passion for literature into successful
            careers across various industries.
          </p>
        </motion.div>{" "}
        {/* Testimonial Carousel */}
        <div className="mx-auto max-w-4xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="rounded-2xl border border-white/10 bg-black/10 p-8 text-center backdrop-blur-sm"
            >
              {/* Quote */}
              <div className="mb-8">
                <div className="text-gold font-script mb-4 text-6xl drop-shadow-lg">&ldquo;</div>
                <blockquote className="text-2xl leading-relaxed font-light text-gray-100 italic drop-shadow-lg md:text-3xl">
                  {currentTestimonial.quote}
                </blockquote>
                <div className="text-gold font-script mt-4 rotate-180 transform text-6xl drop-shadow-lg">
                  &rdquo;
                </div>
              </div>

              {/* Student Info */}
              <div className="flex flex-col items-center">
                {" "}
                {/* Avatar */}
                <div className="bg-gold mb-4 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 shadow-lg">
                  {currentTestimonial.image ? (
                    <Image
                      src={currentTestimonial.image}
                      alt={currentTestimonial.name}
                      width={80}
                      height={80}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-burgundy text-2xl font-bold drop-shadow-sm">
                      {currentTestimonial.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </span>
                  )}
                </div>
                {/* Name and Details */}
                <h3 className="mb-2 text-2xl font-bold text-white drop-shadow-lg">
                  {currentTestimonial.name}
                </h3>
                <p className="text-gold mb-1 font-medium drop-shadow-md">
                  {currentTestimonial.program} • Class of {currentTestimonial.year}
                </p>
                {currentTestimonial.currentPosition && (
                  <p className="text-sm text-gray-200 drop-shadow-md">
                    {currentTestimonial.currentPosition}
                    {currentTestimonial.company && ` at ${currentTestimonial.company}`}
                  </p>
                )}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="mt-12 flex items-center justify-center space-x-6">
            <button
              onClick={prevTestimonial}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
              aria-label="Previous testimonial"
            >
              <svg
                className="h-6 w-6 text-white"
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
            </button>{" "}
            {/* Indicators */}
            <div className="flex space-x-2">
              {testimonials.map((_, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsAutoPlaying(false);
                  }}
                  className={`h-3 w-3 rounded-full transition-colors ${
                    index === currentIndex ? "bg-gold" : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30"
              aria-label="Next testimonial"
            >
              <svg
                className="h-6 w-6 text-white"
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
          className="mt-16 text-center"
        >
          <h3 className="font-primary mb-4 text-2xl font-bold text-white">
            Ready to Write Your Success Story?
          </h3>
          <p className="mx-auto mb-8 max-w-2xl text-gray-200">
            Join our community of successful alumni and start your journey towards literary
            excellence and career success.
          </p>{" "}
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-gold text-burgundy border-0 font-semibold hover:bg-yellow-600"
            >
              Start Your Application
            </Button>{" "}
            <Button
              variant="outline"
              size="lg"
              className="border-white font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white hover:!text-[#8b0000]"
              onClick={() => (window.location.href = "/submit-testimonial")}
            >
              Share Your Story
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
