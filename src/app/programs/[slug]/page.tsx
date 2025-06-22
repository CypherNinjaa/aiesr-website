// ============================================
// DYNAMIC PROGRAM DETAIL PAGE
// Shows detailed program information with admin-controlled content
// ============================================

"use client";

import { ExternalLink, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import React from "react";
import { Button } from "@/components/ui/Button";
import { useProgramBySlug } from "@/hooks/usePrograms";

interface ProgramDetailPageProps {
  params: {
    slug: string;
  };
}

export default function ProgramDetailPage({ params }: ProgramDetailPageProps) {
  const { data: program, isLoading, error } = useProgramBySlug(params.slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="text-burgundy mx-auto h-8 w-8 animate-spin" />
            <p className="mt-4 text-gray-600">Loading program details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    notFound();
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "undergraduate":
        return "bg-green-100 text-green-800";
      case "postgraduate":
        return "bg-blue-100 text-blue-800";
      case "doctoral":
        return "bg-purple-100 text-purple-800";
      case "certificate":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="from-burgundy to-gold bg-gradient-to-r py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4 flex justify-center">
              <span
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${getLevelColor(program.level)} text-opacity-90`}
              >
                {program.level} Program
              </span>
            </div>
            <h1 className="font-primary mb-6 text-4xl font-bold md:text-6xl">{program.title}</h1>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-white/90 md:text-2xl">
              {program.short_description}
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-white/80">
              <div className="text-center">
                <div className="text-lg font-semibold">Duration</div>
                <div className="text-2xl font-bold">{program.duration}</div>
              </div>
              {program.fees && (
                <div className="text-center">
                  <div className="text-lg font-semibold">Fees</div>
                  <div className="text-2xl font-bold">{program.fees}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-6xl">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              {/* Main Content */}
              <div className="space-y-8 lg:col-span-2">
                {/* Program Description */}
                <div className="rounded-lg bg-white p-8 shadow-lg">
                  <h2 className="text-burgundy mb-6 text-3xl font-bold">About This Program</h2>
                  <p className="text-lg leading-relaxed text-gray-700">{program.description}</p>
                </div>

                {/* Custom Learn More Content */}
                {program.learn_more_content && (
                  <div className="rounded-lg bg-white p-8 shadow-lg">
                    <div
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: program.learn_more_content }}
                    />
                  </div>
                )}

                {/* Curriculum */}
                {program.curriculum.length > 0 && (
                  <div className="rounded-lg bg-white p-8 shadow-lg">
                    <h3 className="text-burgundy mb-6 text-2xl font-bold">Curriculum Highlights</h3>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      {program.curriculum.map((item, index) => (
                        <div key={index} className="flex items-start">
                          <div className="bg-gold mt-2 mr-4 h-3 w-3 flex-shrink-0 rounded-full"></div>
                          <span className="text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Career Prospects */}
                {program.career_prospects.length > 0 && (
                  <div className="rounded-lg bg-white p-8 shadow-lg">
                    <h3 className="text-burgundy mb-6 text-2xl font-bold">Career Opportunities</h3>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      {program.career_prospects.map((career, index) => (
                        <div key={index} className="rounded-lg bg-gray-50 p-4 text-center">
                          <span className="font-medium text-gray-800">{career}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Info */}
                <div className="rounded-lg bg-white p-6 shadow-lg">
                  <h3 className="text-burgundy mb-4 text-xl font-bold">Program Information</h3>
                  <div className="space-y-4">
                    <div>
                      <span className="text-sm text-gray-500">Level</span>
                      <p className="font-semibold text-gray-900 capitalize">{program.level}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Duration</span>
                      <p className="font-semibold text-gray-900">{program.duration}</p>
                    </div>
                    {program.fees && (
                      <div>
                        <span className="text-sm text-gray-500">Fees</span>
                        <p className="text-gold font-semibold">{program.fees}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Program Highlights */}
                {program.highlights.length > 0 && (
                  <div className="rounded-lg bg-white p-6 shadow-lg">
                    <h3 className="text-burgundy mb-4 text-xl font-bold">Program Highlights</h3>
                    <ul className="space-y-3">
                      {program.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-gold mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full"></div>
                          <span className="text-sm text-gray-700">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Eligibility */}
                {program.eligibility.length > 0 && (
                  <div className="rounded-lg bg-white p-6 shadow-lg">
                    <h3 className="text-burgundy mb-4 text-xl font-bold">
                      Eligibility Requirements
                    </h3>
                    <ul className="space-y-3">
                      {program.eligibility.map((requirement, index) => (
                        <li key={index} className="flex items-start">
                          <div className="bg-burgundy mt-2 mr-3 h-2 w-2 flex-shrink-0 rounded-full"></div>
                          <span className="text-sm text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Apply Now */}
                {program.apply_link && (
                  <div className="from-burgundy to-gold rounded-lg bg-gradient-to-r p-6 text-center text-white">
                    <h3 className="mb-4 text-xl font-bold">Ready to Apply?</h3>
                    <p className="mb-6 text-sm text-white/90">
                      Take the first step towards your academic journey with us.
                    </p>
                    <Button
                      className="text-burgundy flex w-full items-center justify-center gap-2 bg-white hover:bg-gray-100"
                      onClick={() => window.open(program.apply_link, "_blank")}
                    >
                      Apply Now
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Contact */}
                <div className="rounded-lg bg-white p-6 shadow-lg">
                  <h3 className="text-burgundy mb-4 text-xl font-bold">Need More Information?</h3>
                  <p className="mb-4 text-sm text-gray-600">
                    Get in touch with our admissions team for personalized guidance.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => (window.location.href = "/contact")}
                  >
                    Contact Us
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
