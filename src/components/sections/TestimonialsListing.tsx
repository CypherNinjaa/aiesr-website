"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useApprovedTestimonials } from "@/hooks/useTestimonials";
import { DatabaseTestimonial } from "@/types";

const ITEMS_PER_PAGE = 9;

const ProgramFilters = [
  { value: "", label: "All Programs" },
  { value: "BA English Literature", label: "BA English Literature" },
  { value: "MA English Literature", label: "MA English Literature" },
  { value: "PhD English Studies", label: "PhD English Studies" },
  { value: "Certificate Courses", label: "Certificate Courses" },
  { value: "Other", label: "Other" },
];

const TestimonialCard: React.FC<{ testimonial: DatabaseTestimonial }> = ({ testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  const shouldTruncate = testimonial.story_text.length > maxLength;

  const displayText =
    isExpanded || !shouldTruncate
      ? testimonial.story_text
      : testimonial.story_text.substring(0, maxLength) + "...";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Student Info Header */}
      <div className="mb-4 flex items-center">
        <div className="bg-gold mr-4 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
          {testimonial.photo_url ? (
            <Image
              src={testimonial.photo_url}
              alt={testimonial.student_name}
              width={64}
              height={64}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-burgundy text-xl font-bold">
              {testimonial.student_name
                .split(" ")
                .map((n: string) => n[0])
                .join("")}
            </span>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{testimonial.student_name}</h3>{" "}
          <p className="text-gold font-medium">
            {testimonial.academic_program || "AIESR Program"}
            {testimonial.graduation_year && ` • Class of ${testimonial.graduation_year}`}
          </p>
          {testimonial.current_position && (
            <p className="text-sm text-gray-600">
              {testimonial.current_position}
              {testimonial.company && ` at ${testimonial.company}`}
            </p>
          )}
        </div>
      </div>

      {/* Story */}
      <div className="mb-4">
        <div className="text-gold mb-2 text-4xl">&ldquo;</div>
        <p className="text-lg leading-relaxed text-gray-700 italic">{displayText}</p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-burgundy mt-2 text-sm font-medium hover:text-red-700"
          >
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
        <div className="text-gold mt-2 text-right text-4xl">&rdquo;</div>
      </div>

      {/* Featured Badge */}
      {testimonial.is_featured && (
        <div className="flex justify-end">
          <span className="bg-gold text-burgundy inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
            ⭐ Featured Story
          </span>
        </div>
      )}
    </motion.div>
  );
};

export const TestimonialsListing: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | undefined>();

  const {
    data: testimonialsData,
    isLoading,
    error,
  } = useApprovedTestimonials({
    academic_program: selectedProgram || undefined,
    graduation_year: selectedYear,
    limit: ITEMS_PER_PAGE,
    offset: (currentPage - 1) * ITEMS_PER_PAGE,
  });

  const testimonials = testimonialsData?.data || [];
  const totalCount = testimonialsData?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Generate year options (last 10 years)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedProgram, selectedYear]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="border-burgundy mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-t-2"></div>
          <p className="text-gray-600">Loading success stories...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <p className="mb-4 text-red-600">Unable to load testimonials at this time.</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Stats */}
      <div className="mb-8 text-center">
        <p className="text-gray-600">
          Showing {testimonials.length} of {totalCount} success stories
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Filter Stories</h3>
        <div className="grid gap-4 md:grid-cols-2">
          {" "}
          <div>
            <label
              htmlFor="program-filter"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Program
            </label>
            <select
              id="program-filter"
              title="Filter by academic program"
              value={selectedProgram}
              onChange={e => setSelectedProgram(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
            >
              {ProgramFilters.map(filter => (
                <option key={filter.value} value={filter.value}>
                  {filter.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="year-filter" className="mb-2 block text-sm font-medium text-gray-700">
              Graduation Year
            </label>
            <select
              id="year-filter"
              title="Filter by graduation year"
              value={selectedYear || ""}
              onChange={e => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
              className="focus:ring-burgundy focus:border-burgundy w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:outline-none"
            >
              <option value="">All Years</option>
              {yearOptions.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        {(selectedProgram || selectedYear) && (
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedProgram("");
                setSelectedYear(undefined);
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Testimonials Grid */}
      {testimonials.length > 0 ? (
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(testimonial => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📝</div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">No stories found</h3>
          <p className="text-gray-600">
            Try adjusting your filters or check back later for new success stories.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Previous
          </Button>

          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <Button
                key={pageNum}
                variant={isActive ? "default" : "outline"}
                onClick={() => setCurrentPage(pageNum)}
                className={isActive ? "bg-burgundy text-white" : ""}
              >
                {pageNum}
              </Button>
            );
          })}

          <Button
            variant="outline"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <div className="from-burgundy mt-12 rounded-lg bg-gradient-to-r to-red-900 p-8 text-center text-white">
        <h3 className="mb-4 text-2xl font-bold">Share Your Success Story</h3>
        <p className="mx-auto mb-6 max-w-2xl text-gray-200">
          Inspire future students by sharing your journey with AIESR. Your story could be the
          motivation someone needs to pursue their dreams.
        </p>
        <Button
          size="lg"
          className="bg-gold text-burgundy border-0 font-semibold hover:bg-yellow-600"
          onClick={() => (window.location.href = "/submit-testimonial")}
        >
          Share Your Story
        </Button>
      </div>
    </div>
  );
};
