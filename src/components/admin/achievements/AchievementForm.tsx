"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useCreateAchievement, useUpdateAchievement } from "@/hooks/useAchievements";
import { useActiveCategories } from "@/hooks/useCategories";
import { AchievementFormData } from "@/types";

interface AchievementFormProps {
  initialData?: Partial<AchievementFormData>;
  achievementId?: string;
  isEdit?: boolean;
}

export const AchievementForm: React.FC<AchievementFormProps> = ({
  initialData,
  achievementId,
  isEdit = false,
}) => {
  const router = useRouter();
  const createMutation = useCreateAchievement();
  const updateMutation = useUpdateAchievement();
  const { data: categories = [], isLoading: _categoriesLoading } = useActiveCategories();

  const [formData, setFormData] = useState<AchievementFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category_id: initialData?.category_id || "",
    type: initialData?.type || "award",
    achiever_name: initialData?.achiever_name || "",
    achiever_type: initialData?.achiever_type || "student",
    date_achieved: initialData?.date_achieved || new Date().toISOString().split("T")[0],
    image_url: initialData?.image_url || "",
    details: {
      institution: initialData?.details?.institution || "",
      award_body: initialData?.details?.award_body || "",
      amount: initialData?.details?.amount || "",
      rank: initialData?.details?.rank || "",
      publication_details: initialData?.details?.publication_details || "",
      collaboration_partners: initialData?.details?.collaboration_partners || [],
      impact: initialData?.details?.impact || "",
      media_links: initialData?.details?.media_links || [],
    },
    is_featured: initialData?.is_featured || false,
    sort_order: initialData?.sort_order || 0,
    status: initialData?.status || "draft",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Set default category when categories load and no category is selected
  useEffect(() => {
    if (categories.length > 0 && !formData.category_id && !initialData?.category_id) {
      setFormData(prev => ({
        ...prev,
        category_id: categories[0].id,
      }));
    }
  }, [categories, formData.category_id, initialData?.category_id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetailsChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value,
      },
    }));
  };

  const handleArrayInput = (field: string, value: string) => {
    const array = value
      .split(",")
      .map(item => item.trim())
      .filter(item => item);
    handleDetailsChange(field, array);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationError("");
    setSuccessMessage("");

    // Validate required fields
    if (!formData.category_id) {
      setValidationError("Please select a category");
      setIsSubmitting(false);
      return;
    }

    // Debug: Log the data being sent
    console.log("Submitting achievement data:", formData);

    try {
      if (isEdit && achievementId) {
        await updateMutation.mutateAsync({ id: achievementId, data: formData });
        setSuccessMessage("Achievement updated successfully!");
      } else {
        await createMutation.mutateAsync({ data: formData, userId: "admin" });
        setSuccessMessage("Achievement created successfully!");
      }

      // Wait a moment to show success message, then redirect
      setTimeout(() => {
        router.push("/admin/achievements");
      }, 1500);
    } catch (error) {
      console.error("Error submitting form:", error);
      setValidationError("An error occurred while saving. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {validationError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-600">{validationError}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4">
          <p className="text-sm text-green-600">{successMessage}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Basic Information</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Achievement Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label htmlFor="achiever_name" className="block text-sm font-medium text-gray-700">
                Achiever Name *
              </label>
              <input
                type="text"
                id="achiever_name"
                name="achiever_name"
                required
                value={formData.achiever_name}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>{" "}
            <div>
              <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category_id"
                name="category_id"
                required
                value={formData.category_id}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select a category</option>
                {categories.length === 0 ? (
                  <option value="" disabled>
                    Loading categories...
                  </option>
                ) : (
                  categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon_emoji} {category.name}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="award">Award</option>
                <option value="publication">Publication</option>
                <option value="recognition">Recognition</option>
                <option value="milestone">Milestone</option>
                <option value="collaboration">Collaboration</option>
              </select>
            </div>
            <div>
              <label htmlFor="achiever_type" className="block text-sm font-medium text-gray-700">
                Achiever Type *
              </label>
              <select
                id="achiever_type"
                name="achiever_type"
                required
                value={formData.achiever_type}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="student">Student</option>
                <option value="faculty">Faculty</option>
                <option value="department">Department</option>
                <option value="institution">Institution</option>
              </select>
            </div>
            <div>
              <label htmlFor="date_achieved" className="block text-sm font-medium text-gray-700">
                Date Achieved *
              </label>
              <input
                type="date"
                id="date_achieved"
                name="date_achieved"
                required
                value={formData.date_achieved}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              value={formData.description}
              onChange={handleInputChange}
              className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="image_url" className="block text-sm font-medium text-gray-700">
              Image URL
            </label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleInputChange}
              className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* Additional Details */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Additional Details</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="institution" className="block text-sm font-medium text-gray-700">
                Institution
              </label>
              <input
                type="text"
                id="institution"
                value={formData.details?.institution || ""}
                onChange={e => handleDetailsChange("institution", e.target.value)}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="award_body" className="block text-sm font-medium text-gray-700">
                Award Body
              </label>
              <input
                type="text"
                id="award_body"
                value={formData.details?.award_body || ""}
                onChange={e => handleDetailsChange("award_body", e.target.value)}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                Amount/Prize
              </label>
              <input
                type="text"
                id="amount"
                value={formData.details?.amount || ""}
                onChange={e => handleDetailsChange("amount", e.target.value)}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="rank" className="block text-sm font-medium text-gray-700">
                Rank/Position
              </label>
              <input
                type="text"
                id="rank"
                value={formData.details?.rank || ""}
                onChange={e => handleDetailsChange("rank", e.target.value)}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
          </div>

          <div className="mt-4">
            <label
              htmlFor="publication_details"
              className="block text-sm font-medium text-gray-700"
            >
              Publication Details
            </label>
            <textarea
              id="publication_details"
              rows={3}
              value={formData.details?.publication_details || ""}
              onChange={e => handleDetailsChange("publication_details", e.target.value)}
              className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="mt-4">
            <label
              htmlFor="collaboration_partners"
              className="block text-sm font-medium text-gray-700"
            >
              Collaboration Partners (comma-separated)
            </label>
            <input
              type="text"
              id="collaboration_partners"
              value={formData.details?.collaboration_partners?.join(", ") || ""}
              onChange={e => handleArrayInput("collaboration_partners", e.target.value)}
              className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="impact" className="block text-sm font-medium text-gray-700">
              Impact/Significance
            </label>
            <textarea
              id="impact"
              rows={3}
              value={formData.details?.impact || ""}
              onChange={e => handleDetailsChange("impact", e.target.value)}
              className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="media_links" className="block text-sm font-medium text-gray-700">
              Media Links (comma-separated)
            </label>
            <input
              type="text"
              id="media_links"
              value={formData.details?.media_links?.join(", ") || ""}
              onChange={e => handleArrayInput("media_links", e.target.value)}
              className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
        </div>

        {/* Settings */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Settings</h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
                Sort Order
              </label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                value={formData.sort_order}
                onChange={handleInputChange}
                className="focus:border-burgundy focus:ring-burgundy mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                id="is_featured"
                name="is_featured"
                type="checkbox"
                checked={formData.is_featured}
                onChange={handleInputChange}
                className="text-burgundy focus:ring-burgundy h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-900">
                Featured Achievement
              </label>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || categories.length === 0 || !formData.category_id}
            className="bg-burgundy hover:bg-burgundy/90 rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {isSubmitting ? "Saving..." : isEdit ? "Update Achievement" : "Create Achievement"}
          </button>
        </div>
      </form>
    </div>
  );
};
