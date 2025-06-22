// ============================================
// PROGRAMS PAGE - Public Programs Listing
// Public page showing all active programs
// ============================================

"use client";

import { Loader2 } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { useActivePrograms } from "@/hooks/usePrograms";

export default function ProgramsPage() {
  const { data: programs, isLoading, error } = useActivePrograms();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <Loader2 className="text-burgundy mx-auto h-8 w-8 animate-spin" />
            <p className="mt-4 text-gray-600">Loading programs...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="mb-4 text-red-600">Error loading programs. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  const groupedPrograms =
    programs?.reduce(
      (acc, program) => {
        if (!acc[program.level]) {
          acc[program.level] = [];
        }
        acc[program.level].push(program);
        return acc;
      },
      {} as Record<string, typeof programs>
    ) || {};

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-16 text-center">
          <h1 className="font-primary text-burgundy mb-6 text-4xl font-bold md:text-5xl">
            All Academic Programs
          </h1>
          <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-700">
            Explore our comprehensive range of programs designed to nurture literary excellence and
            critical thinking across all academic levels.
          </p>
        </div>

        {/* Programs by Level */}
        {Object.entries(groupedPrograms).map(([level, levelPrograms]) => (
          <div key={level} className="mb-16">
            <h2 className="text-burgundy mb-8 text-3xl font-bold capitalize">{level} Programs</h2>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {levelPrograms.map(program => (
                <Card
                  key={program.id}
                  className="h-full border-0 bg-white shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  <CardHeader>
                    <div className="mb-2 flex items-start justify-between">
                      <CardTitle className="text-burgundy hover:text-gold text-xl transition-colors">
                        {program.title}
                      </CardTitle>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          program.level === "undergraduate"
                            ? "bg-green-100 text-green-800"
                            : program.level === "postgraduate"
                              ? "bg-blue-100 text-blue-800"
                              : program.level === "doctoral"
                                ? "bg-purple-100 text-purple-800"
                                : "bg-orange-100 text-orange-800"
                        }`}
                      >
                        {program.level}
                      </span>
                    </div>
                    <CardDescription>{program.short_description}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Duration and Fees */}
                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="text-burgundy ml-2 font-medium">{program.duration}</span>
                      </div>
                      {program.fees && (
                        <div>
                          <span className="text-gray-500">Fees:</span>
                          <span className="text-gold ml-2 font-medium">{program.fees}</span>
                        </div>
                      )}
                    </div>

                    {/* Highlights Preview */}
                    {program.highlights.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-800">Key Highlights:</h4>
                        <ul className="space-y-1 text-sm text-gray-600">
                          {program.highlights.slice(0, 3).map((highlight, idx) => (
                            <li key={idx} className="flex items-start">
                              <div className="bg-gold mt-2 mr-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"></div>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Career Prospects Preview */}
                    {program.career_prospects.length > 0 && (
                      <div>
                        <h4 className="mb-2 text-sm font-medium text-gray-800">
                          Career Opportunities:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {program.career_prospects.slice(0, 3).map((career, idx) => (
                            <span
                              key={idx}
                              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700"
                            >
                              {career}
                            </span>
                          ))}
                          {program.career_prospects.length > 3 && (
                            <span className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-500">
                              +{program.career_prospects.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          if (program.learn_more_content) {
                            window.location.href = `/programs/${program.slug}`;
                          }
                        }}
                        disabled={!program.learn_more_content}
                      >
                        Learn More
                      </Button>
                      {program.apply_link && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(program.apply_link, "_blank")}
                        >
                          Apply Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Empty State */}
        {(!programs || programs.length === 0) && (
          <div className="py-16 text-center">
            <p className="mb-4 text-gray-600">No programs are currently available.</p>
            <p className="text-sm text-gray-500">Please check back later for updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
