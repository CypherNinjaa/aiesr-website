"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { useFeaturedTestimonials } from "@/hooks/useTestimonials";

export const TestimonialsManagement: React.FC = () => {
  const { data: testimonials, isLoading, error, refetch } = useFeaturedTestimonials();
  const [statusFilter, setStatusFilter] = useState("all");

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="border-burgundy h-32 w-32 animate-spin rounded-full border-b-2"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-700">Error loading testimonials: {error.message}</p>
        <Button onClick={() => refetch()} className="mt-2">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">📝</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Total</dt>
                  <dd className="text-lg font-medium text-gray-900">{testimonials?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">⏳</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Pending</dt>
                  <dd className="text-lg font-medium text-yellow-600">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">✅</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Approved</dt>
                  <dd className="text-lg font-medium text-green-600">
                    {testimonials?.length || 0}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="text-2xl">⭐</div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="truncate text-sm font-medium text-gray-500">Featured</dt>
                  <dd className="text-gold text-lg font-medium">{testimonials?.length || 0}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy rounded-md border border-gray-300 px-3 py-2 focus:ring-2"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <Button onClick={() => refetch()} variant="outline">
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Quote
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Program
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {testimonials?.map(testimonial => (
              <tr key={testimonial.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="mr-3 text-2xl">👤</div>
                    <div>
                      {" "}
                      <div className="text-sm font-medium text-gray-900">
                        {testimonial.student_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {testimonial.graduation_year
                          ? `Class of ${testimonial.graduation_year}`
                          : "Current Student"}
                      </div>
                    </div>
                  </div>
                </td>{" "}
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {testimonial.story_text.length > 100
                      ? `${testimonial.story_text.substring(0, 100)}...`
                      : testimonial.story_text}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {testimonial.academic_program || "N/A"}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {testimonial.current_position || "N/A"}
                  </div>
                  {testimonial.company && (
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-green-600 text-white hover:bg-green-700">
                      Approved
                    </Button>
                    <Button size="sm" className="bg-gold hover:bg-gold/90 text-white">
                      Featured
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!testimonials || testimonials.length === 0) && (
          <div className="py-12 text-center">
            <div className="mb-4 text-4xl">📝</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No testimonials found</h3>
            <p className="text-gray-500">No testimonials have been submitted yet.</p>
          </div>
        )}
      </div>

      {/* Coming Soon Notice */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
        <div className="flex items-center">
          <div className="mr-4 text-2xl">🚧</div>
          <div>
            <h3 className="mb-2 text-lg font-medium text-blue-900">
              Database Integration Coming Soon
            </h3>
            <p className="mb-2 text-blue-700">
              The full testimonials management system with database integration is currently being
              implemented. This includes:
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-blue-600">
              <li>Student submission form for new testimonials</li>
              <li>Admin approval/rejection workflow</li>
              <li>Featured testimonials management</li>
              <li>Dynamic display on the website</li>
            </ul>
            <p className="mt-2 text-sm text-blue-600">
              Currently showing static testimonials from the JSON file.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
