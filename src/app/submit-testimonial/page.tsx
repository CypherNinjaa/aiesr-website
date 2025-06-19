"use client";

import React from "react";
import { TestimonialSubmissionForm } from "@/components/forms/TestimonialSubmissionForm";

export default function SubmitTestimonialPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="font-primary mb-6 text-4xl font-bold text-gray-900 md:text-5xl">
              Share Your Success Story
            </h1>
            <div className="bg-gold mx-auto mb-6 h-1 w-24 rounded-full"></div>
            <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-600">
              Your journey matters. Inspire future students by sharing how AIESR helped shape your
              career and personal growth.
            </p>
          </div>
          {/* Benefits Section */}
          <div className="mb-12 grid gap-8 md:grid-cols-3">
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <div className="mb-4 text-4xl">🌟</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Inspire Others</h3>
              <p className="text-gray-600">
                Your story can motivate and guide prospective students on their educational journey.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <div className="mb-4 text-4xl">🤝</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Build Community</h3>
              <p className="text-gray-600">
                Connect with fellow alumni and strengthen the AIESR community network.
              </p>
            </div>
            <div className="rounded-lg bg-white p-6 text-center shadow-sm">
              <div className="mb-4 text-4xl">📚</div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Share Knowledge</h3>
              <p className="text-gray-600">
                Provide valuable insights about career paths and opportunities in literature.
              </p>
            </div>
          </div>{" "}
          {/* Form Section */}
          <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <TestimonialSubmissionForm />
          </div>
          {/* Additional Information */}
          <div className="mt-12 rounded-lg border border-blue-200 bg-blue-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-blue-900">📋 Submission Guidelines</h3>
            <ul className="space-y-2 text-blue-800">
              <li>• All submissions are reviewed before publication</li>
              <li>
                • We may contact you for additional information or permission to feature your story
              </li>
              <li>• Anonymous submissions are welcome - just leave the email field blank</li>
              <li>• High-quality photos are preferred but optional</li>
              <li>
                • Stories should be authentic and focus on your educational and career journey
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
