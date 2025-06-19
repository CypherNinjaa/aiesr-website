import React from "react";
import { TestimonialsListing } from "@/components/sections/TestimonialsListing";

export const metadata = {
  title: "Student Success Stories | AIESR",
  description:
    "Read inspiring success stories from AIESR alumni who have transformed their passion for literature into successful careers.",
};

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="from-burgundy via-burgundy bg-gradient-to-br to-red-900 py-16 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="font-primary mb-6 text-4xl font-bold text-white md:text-5xl">
              Student Success Stories
            </h1>
            <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-200">
              Discover how our alumni have transformed their passion for literature into successful
              careers across various industries.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials Listing */}
      <TestimonialsListing />
    </div>
  );
}
