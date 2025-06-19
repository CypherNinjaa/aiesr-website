"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { StorageService } from "@/services/storage";
import { TestimonialsService } from "@/services/testimonials";
import { DatabaseTestimonialFormData } from "@/types";

interface TestimonialSubmissionFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const TestimonialSubmissionForm: React.FC<TestimonialSubmissionFormProps> = ({
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState<DatabaseTestimonialFormData>({
    student_name: "",
    email: "",
    story_text: "",
    graduation_year: undefined,
    current_position: "",
    company: "",
    program: undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Photo upload states
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "graduation_year" ? (value ? parseInt(value) : undefined) : value,
    }));
  };

  // Photo upload handlers
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a JPG, PNG, or WebP image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      // 5MB limit
      setError("Photo size must be less than 5MB");
      return;
    }

    setSelectedPhoto(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = e => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handlePhotoRemove = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.student_name.trim()) {
        throw new Error("Student name is required");
      }
      if (!formData.story_text.trim()) {
        throw new Error("Your success story is required");
      }

      console.log("Form data being submitted:", formData);

      let photoUrl = "";

      // Upload photo if selected
      if (selectedPhoto) {
        setIsUploadingPhoto(true);
        console.log("Uploading photo...");

        const uploadResult = await StorageService.uploadTestimonialPhoto(selectedPhoto);

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Failed to upload photo");
        }

        photoUrl = uploadResult.url || "";
        console.log("Photo uploaded successfully:", photoUrl);
      }

      // Submit testimonial with photo URL
      const testimonialData = {
        ...formData,
        photo_url: photoUrl,
      };

      await TestimonialsService.submitTestimonial(testimonialData);

      setShowSuccess(true);
      if (onSuccess) {
        setTimeout(onSuccess, 2000);
      }
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "Failed to submit testimonial");
    } finally {
      setIsSubmitting(false);
      setIsUploadingPhoto(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="rounded-lg bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg
            className="h-8 w-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-semibold text-green-900">Thank You!</h3>
        <p className="mb-4 text-green-700">
          Your success story has been submitted successfully. Our team will review it and get back
          to you soon.
        </p>
        <p className="text-sm text-green-600">
          We typically review submissions within 2-3 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-bold text-gray-900">Share Your Success Story</h2>
          <p className="text-gray-600">
            Help inspire future students by sharing your journey and achievements with AIESR
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex">
              <svg
                className="mt-0.5 mr-3 h-5 w-5 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="student_name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name *
              </label>
              <input
                type="text"
                id="student_name"
                name="student_name"
                value={formData.student_name}
                onChange={handleInputChange}
                required
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2"
                placeholder="your.email@example.com"
              />{" "}
              <p className="mt-1 text-xs text-gray-500">Optional - for follow-up communication</p>
            </div>
          </div>{" "}
          {/* Photo Upload Section */}
          <div>
            <label htmlFor="photo-upload" className="mb-2 block text-sm font-medium text-gray-700">
              Your Photo
            </label>
            <div className="flex flex-col space-y-4">
              {!photoPreview ? (
                <div className="hover:border-burgundy rounded-lg border-2 border-dashed border-gray-300 p-6 text-center transition-colors">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="rounded-full bg-gray-100 p-4">
                      <svg
                        className="h-8 w-8 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="mb-2 text-sm text-gray-600">
                        Add a professional photo to make your testimonial more personal
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-sm"
                      >
                        Choose Photo
                      </Button>
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                    aria-label="Upload your photo"
                  />
                </div>
              ) : (
                <div className="flex items-start space-x-4 rounded-lg border border-gray-200 p-4">
                  <div className="relative">
                    <Image
                      src={photoPreview}
                      alt="Photo preview"
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                    {isUploadingPhoto && (
                      <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center rounded-lg bg-black">
                        <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {selectedPhoto?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedPhoto && (selectedPhoto.size / 1024 / 1024).toFixed(1)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handlePhotoRemove}
                      className="mt-2 text-xs"
                      disabled={isUploadingPhoto}
                    >
                      Remove Photo
                    </Button>
                  </div>
                </div>
              )}
              <p className="text-xs text-gray-500">
                Optional • JPG, PNG, or WebP • Max 5MB • Recommended: 400x400px or larger
              </p>
            </div>
          </div>
          {/* Academic Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              {" "}
              <label htmlFor="program" className="mb-2 block text-sm font-medium text-gray-700">
                Program Studied
              </label>
              <select
                id="program"
                name="program"
                value={formData.program || ""}
                onChange={handleInputChange}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2"
              >
                <option value="">Select your program</option>
                <option value="BA English Literature">BA English Literature</option>
                <option value="MA English Literature">MA English Literature</option>
                <option value="PhD English Studies">PhD English Studies</option>
                <option value="Certificate Courses">Certificate Courses</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="graduation_year"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Graduation Year
              </label>
              <input
                type="number"
                id="graduation_year"
                name="graduation_year"
                value={formData.graduation_year || ""}
                onChange={handleInputChange}
                min="2000"
                max={new Date().getFullYear() + 10}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2"
                placeholder="2023"
              />
            </div>
          </div>
          {/* Professional Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label
                htmlFor="current_position"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Current Position
              </label>
              <input
                type="text"
                id="current_position"
                name="current_position"
                value={formData.current_position}
                onChange={handleInputChange}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2"
                placeholder="e.g., Content Writer, Teacher, Author"
              />
            </div>

            <div>
              <label htmlFor="company" className="mb-2 block text-sm font-medium text-gray-700">
                Company/Organization
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2"
                placeholder="e.g., Google, Oxford University, Freelance"
              />
            </div>
          </div>
          {/* Success Story */}
          <div>
            <label htmlFor="story_text" className="mb-2 block text-sm font-medium text-gray-700">
              Your Success Story *
            </label>
            <textarea
              id="story_text"
              name="story_text"
              value={formData.story_text}
              onChange={handleInputChange}
              required
              rows={6}
              className="focus:ring-burgundy focus:border-burgundy w-full resize-none rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:ring-2"
              placeholder="Share your journey, achievements, and how AIESR helped shape your career. What advice would you give to current students?"
            />
            <p className="mt-2 text-sm text-gray-500">
              Tell us about your journey, key achievements, and how AIESR contributed to your
              success.
            </p>
          </div>
          {/* Privacy Notice */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="mb-2 text-sm font-medium text-gray-900">Privacy Notice</h4>
            <p className="text-xs text-gray-600">
              By submitting this form, you consent to AIESR using your testimonial for promotional
              purposes on our website, social media, and marketing materials. Your contact
              information will be kept confidential and used only for verification purposes.
            </p>
          </div>
          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-6 sm:flex-row">
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex-1"
              >
                Cancel
              </Button>
            )}{" "}
            <Button
              type="submit"
              disabled={isSubmitting || isUploadingPhoto}
              className="bg-burgundy hover:bg-burgundy/90 flex-1"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      className="opacity-25"
                    />
                    <path
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      className="opacity-75"
                    />{" "}
                  </svg>
                  {isUploadingPhoto ? "Uploading Photo..." : "Submitting..."}
                </div>
              ) : (
                "Submit My Story"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
