// ============================================
// PROGRAM FORM - Create/Edit Program Form
// Comprehensive form for program management
// ============================================

"use client";

import { AlertCircle, Loader2, Plus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateProgram, useUpdateProgram } from "@/hooks/usePrograms";
import { generateSlug, validateProgramData } from "@/services/programs";
import { Program, CreateProgramData } from "@/types";

interface ProgramFormProps {
  program?: Program | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  description: string;
  short_description: string;
  duration: string;
  level: "undergraduate" | "postgraduate" | "doctoral" | "certificate";
  fees: string;
  image_url: string;
  slug: string;
  apply_link: string;
  learn_more_content: string;
  eligibility: string[];
  curriculum: string[];
  career_prospects: string[];
  highlights: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

const initialFormData: FormData = {
  title: "",
  description: "",
  short_description: "",
  duration: "",
  level: "undergraduate",
  fees: "",
  image_url: "",
  slug: "",
  apply_link: "",
  learn_more_content: "",
  eligibility: [],
  curriculum: [],
  career_prospects: [],
  highlights: [],
  is_active: true,
  is_featured: false,
  sort_order: 0,
};

export function ProgramForm({ program, onSuccess, onCancel }: ProgramFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);
  const [newEligibility, setNewEligibility] = useState("");
  const [newCurriculum, setNewCurriculum] = useState("");
  const [newCareerProspect, setNewCareerProspect] = useState("");
  const [newHighlight, setNewHighlight] = useState("");

  const createProgram = useCreateProgram();
  const updateProgram = useUpdateProgram();

  const isEditing = !!program;
  const isLoading = createProgram.isPending || updateProgram.isPending;

  // Load program data for editing
  useEffect(() => {
    if (program) {
      setFormData({
        title: program.title,
        description: program.description,
        short_description: program.short_description,
        duration: program.duration,
        level: program.level,
        fees: program.fees || "",
        image_url: program.image_url || "",
        slug: program.slug,
        apply_link: program.apply_link || "",
        learn_more_content: program.learn_more_content || "",
        eligibility: program.eligibility,
        curriculum: program.curriculum,
        career_prospects: program.career_prospects,
        highlights: program.highlights,
        is_active: program.is_active,
        is_featured: program.is_featured,
        sort_order: program.sort_order,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [program]);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = generateSlug(formData.title);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title, isEditing]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const addToArray = (
    field: "eligibility" | "curriculum" | "career_prospects" | "highlights",
    value: string
  ) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      }));

      // Clear the input
      switch (field) {
        case "eligibility":
          setNewEligibility("");
          break;
        case "curriculum":
          setNewCurriculum("");
          break;
        case "career_prospects":
          setNewCareerProspect("");
          break;
        case "highlights":
          setNewHighlight("");
          break;
      }
    }
  };

  const removeFromArray = (
    field: "eligibility" | "curriculum" | "career_prospects" | "highlights",
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateProgramData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const programData: CreateProgramData = {
        title: formData.title,
        description: formData.description,
        short_description: formData.short_description,
        duration: formData.duration,
        level: formData.level,
        fees: formData.fees || undefined,
        image_url: formData.image_url || undefined,
        slug: formData.slug,
        apply_link: formData.apply_link || undefined,
        learn_more_content: formData.learn_more_content || undefined,
        eligibility: formData.eligibility,
        curriculum: formData.curriculum,
        career_prospects: formData.career_prospects,
        highlights: formData.highlights,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        sort_order: formData.sort_order,
      };

      if (isEditing && program) {
        await updateProgram.mutateAsync({ id: program.id, data: programData });
      } else {
        await createProgram.mutateAsync(programData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving program:", error);
      setErrors([error instanceof Error ? error.message : "Failed to save program"]);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="rounded-md border border-red-200 bg-red-50 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Please fix the following errors:</h3>
              <ul className="mt-2 list-inside list-disc text-sm text-red-700">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="program-title" className="block text-sm font-medium text-gray-700">
              Program Title *
            </label>
            <input
              id="program-title"
              type="text"
              value={formData.title}
              onChange={e => handleInputChange("title", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="e.g., B.A. (Hons.) English Literature"
            />
          </div>

          <div>
            <label htmlFor="program-slug" className="block text-sm font-medium text-gray-700">
              URL Slug *
            </label>
            <input
              id="program-slug"
              type="text"
              value={formData.slug}
              onChange={e => handleInputChange("slug", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="e.g., ba-english-literature"
            />
            <p className="mt-1 text-xs text-gray-500">
              Used in the URL. Will be auto-generated from title if left empty.
            </p>
          </div>
        </div>

        <div>
          <label
            htmlFor="program-short-description"
            className="block text-sm font-medium text-gray-700"
          >
            Short Description *
          </label>
          <textarea
            id="program-short-description"
            value={formData.short_description}
            onChange={e => handleInputChange("short_description", e.target.value)}
            rows={2}
            className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            placeholder="Brief description for program cards"
          />
        </div>

        <div>
          <label htmlFor="program-description" className="block text-sm font-medium text-gray-700">
            Full Description *
          </label>
          <textarea
            id="program-description"
            value={formData.description}
            onChange={e => handleInputChange("description", e.target.value)}
            rows={4}
            className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            placeholder="Detailed program description"
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <label htmlFor="program-level" className="block text-sm font-medium text-gray-700">
              Level *
            </label>
            <select
              id="program-level"
              value={formData.level}
              onChange={e => handleInputChange("level", e.target.value as FormData["level"])}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              title="Select program level"
            >
              <option value="undergraduate">Undergraduate</option>
              <option value="postgraduate">Postgraduate</option>
              <option value="doctoral">Doctoral</option>
              <option value="certificate">Certificate</option>
            </select>
          </div>

          <div>
            <label htmlFor="program-duration" className="block text-sm font-medium text-gray-700">
              Duration *
            </label>
            <input
              id="program-duration"
              type="text"
              value={formData.duration}
              onChange={e => handleInputChange("duration", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="e.g., 3 Years"
            />
          </div>

          <div>
            <label htmlFor="program-fees" className="block text-sm font-medium text-gray-700">
              Fees
            </label>
            <input
              id="program-fees"
              type="text"
              value={formData.fees}
              onChange={e => handleInputChange("fees", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="e.g., ₹2,50,000 per year"
            />
          </div>
        </div>
      </div>

      {/* Links and Content */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Links & Content</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="program-apply-link" className="block text-sm font-medium text-gray-700">
              Custom Apply Link
            </label>
            <input
              id="program-apply-link"
              type="url"
              value={formData.apply_link}
              onChange={e => handleInputChange("apply_link", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="https://admissions.example.com/apply"
            />
            <p className="mt-1 text-xs text-gray-500">Leave empty to hide Apply Now button</p>
          </div>

          <div>
            <label htmlFor="program-image-url" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              id="program-image-url"
              type="url"
              value={formData.image_url}
              onChange={e => handleInputChange("image_url", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="program-learn-more-content"
            className="block text-sm font-medium text-gray-700"
          >
            Learn More Content (HTML)
          </label>
          <textarea
            id="program-learn-more-content"
            value={formData.learn_more_content}
            onChange={e => handleInputChange("learn_more_content", e.target.value)}
            rows={6}
            className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:outline-none"
            placeholder="<h2>Program Details</h2><p>Detailed program information...</p>"
          />
          <p className="mt-1 text-xs text-gray-500">HTML content for the dedicated program page</p>
        </div>
      </div>

      {/* Program Details Arrays */}
      <div className="space-y-8">
        <h3 className="text-lg font-medium text-gray-900">Program Details</h3>

        {/* Eligibility */}
        <div>
          <label
            htmlFor="program-eligibility-input"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Eligibility Requirements
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="program-eligibility-input"
              type="text"
              value={newEligibility}
              onChange={e => setNewEligibility(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Add eligibility requirement"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("eligibility", newEligibility);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addToArray("eligibility", newEligibility)}
              size="sm"
              title="Add eligibility requirement"
              aria-label="Add eligibility requirement"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.eligibility.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
              >
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("eligibility", index)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove eligibility requirement"
                  aria-label="Remove eligibility requirement"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Curriculum */}
        <div>
          <label
            htmlFor="program-curriculum-input"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Curriculum Highlights
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="program-curriculum-input"
              type="text"
              value={newCurriculum}
              onChange={e => setNewCurriculum(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Add curriculum topic"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("curriculum", newCurriculum);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addToArray("curriculum", newCurriculum)}
              size="sm"
              title="Add curriculum topic"
              aria-label="Add curriculum topic"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.curriculum.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
              >
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("curriculum", index)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove curriculum topic"
                  aria-label="Remove curriculum topic"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Career Prospects */}
        <div>
          <label
            htmlFor="program-career-prospect-input"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Career Prospects
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="program-career-prospect-input"
              type="text"
              value={newCareerProspect}
              onChange={e => setNewCareerProspect(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Add career opportunity"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("career_prospects", newCareerProspect);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addToArray("career_prospects", newCareerProspect)}
              size="sm"
              title="Add career opportunity"
              aria-label="Add career opportunity"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.career_prospects.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
              >
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("career_prospects", index)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove career opportunity"
                  aria-label="Remove career opportunity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label
            htmlFor="program-highlight-input"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Program Highlights
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="program-highlight-input"
              type="text"
              value={newHighlight}
              onChange={e => setNewHighlight(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Add program highlight"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("highlights", newHighlight);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addToArray("highlights", newHighlight)}
              size="sm"
              title="Add program highlight"
              aria-label="Add program highlight"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.highlights.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
              >
                <span className="text-sm">{item}</span>
                <button
                  type="button"
                  onClick={() => removeFromArray("highlights", index)}
                  className="text-red-600 hover:text-red-800"
                  title="Remove program highlight"
                  aria-label="Remove program highlight"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Display Settings</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={e => handleInputChange("is_active", e.target.checked)}
              className="text-burgundy focus:ring-burgundy h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
              Active (Visible to public)
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_featured"
              checked={formData.is_featured}
              onChange={e => handleInputChange("is_featured", e.target.checked)}
              className="text-burgundy focus:ring-burgundy h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
              Featured (Show on homepage)
            </label>
          </div>

          <div>
            <label htmlFor="program-sort-order" className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              id="program-sort-order"
              type="number"
              value={formData.sort_order}
              onChange={e => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 border-t pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          title="Cancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex items-center gap-2"
          title={isEditing ? "Update Program" : "Create Program"}
        >
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Update Program" : "Create Program"}
        </Button>
      </div>
    </form>
  );
}
