// ============================================
// GALLERY FORM - Create/Edit gallery slides with dual upload options
// Supports both URL input and direct file upload
// ============================================

"use client";

import { Upload, X, ExternalLink, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/Loading";
import { useNotifications } from "@/contexts/NotificationContext";
import { useFormValidation } from "@/hooks/useFormValidation";
import { commonValidationRules } from "@/hooks/useFormValidation";
import {
  useCreateGallerySlide,
  useUpdateGallerySlide,
  useUploadGalleryImage,
} from "@/hooks/useGallery";
import type { GallerySlide, CreateGallerySlideData, UpdateGallerySlideData } from "@/types";

interface GalleryFormProps {
  slide?: GallerySlide | null;
  onSuccess: () => void;
  onCancel: () => void;
}

type UploadMethod = "url" | "file";

export function GalleryForm({ slide, onSuccess, onCancel }: GalleryFormProps) {
  const { showSuccess, showError } = useNotifications();
  const { validateAndNotify } = useFormValidation();

  const createSlide = useCreateGallerySlide();
  const updateSlide = useUpdateGallerySlide();
  const uploadImage = useUploadGalleryImage();

  const isEditing = !!slide;
  const isSubmitting = createSlide.isPending || updateSlide.isPending || uploadImage.isPending;

  // Form state
  const [formData, setFormData] = useState({
    title: slide?.title || "",
    subtitle: slide?.subtitle || "",
    description: slide?.description || "",
    image_url: slide?.image_url || "",
    image_alt: slide?.image_alt || "",
    link_url: slide?.link_url || "",
    link_text: slide?.link_text || "",
    sort_order: slide?.sort_order || 0,
    is_active: slide?.is_active ?? true,
  });

  const [uploadMethod, setUploadMethod] = useState<UploadMethod>("url");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(slide?.image_url || "");

  // File upload handling
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
      setFormData(prev => ({ ...prev, image_url: "" }));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp", ".gif"],
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
  });

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Update preview for URL input
    if (field === "image_url" && typeof value === "string") {
      setPreviewUrl(value);
      setUploadedFile(null);
    }
  };

  const handleUploadMethodChange = (method: UploadMethod) => {
    setUploadMethod(method);
    if (method === "url") {
      setUploadedFile(null);
      setPreviewUrl(formData.image_url);
    } else {
      setFormData(prev => ({ ...prev, image_url: "" }));
      setPreviewUrl("");
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setPreviewUrl(formData.image_url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation rules
    const validationRules = [
      commonValidationRules.required("title", "Title"),
      commonValidationRules.minLength("title", "Title", 3),
      {
        field: "image_source",
        label: "Image",
        custom: () => {
          if (uploadMethod === "url" && !formData.image_url.trim()) {
            return "Please provide an image URL";
          }
          if (uploadMethod === "file" && !uploadedFile && !slide?.image_url) {
            return "Please select an image file";
          }
          return null;
        },
      },
      {
        field: "image_url",
        label: "Image URL",
        custom: (value: unknown) => {
          if (uploadMethod === "url" && value && !isValidUrl(value as string)) {
            return "Please provide a valid image URL";
          }
          return null;
        },
      },
      {
        field: "link_url",
        label: "Link URL",
        custom: (value: unknown) => {
          if (value && !isValidUrl(value as string)) {
            return "Please provide a valid link URL";
          }
          return null;
        },
      },
    ];

    if (!validateAndNotify(formData, validationRules)) {
      return;
    }

    try {
      let finalImageUrl = formData.image_url;

      // Upload file if using file method
      if (uploadMethod === "file" && uploadedFile) {
        finalImageUrl = await uploadImage.mutateAsync({
          file: uploadedFile,
          fileName: `gallery-${Date.now()}-${uploadedFile.name}`,
        });
      }

      const slideData = {
        ...formData,
        image_url: finalImageUrl,
        image_alt: formData.image_alt || formData.title,
      };

      if (isEditing) {
        await updateSlide.mutateAsync({
          id: slide.id,
          data: slideData as UpdateGallerySlideData,
        });
        showSuccess("Slide Updated", `"${formData.title}" has been updated successfully!`);
      } else {
        await createSlide.mutateAsync(slideData as CreateGallerySlideData);
        showSuccess("Slide Created", `"${formData.title}" has been created successfully!`);
      }

      onSuccess();
    } catch (error) {
      showError(
        isEditing ? "Update Failed" : "Creation Failed",
        error instanceof Error ? error.message : "An unexpected error occurred."
      );
    }
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={e => handleInputChange("title", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter slide title"
            required
          />
        </div>

        <div>
          <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700">
            Subtitle
          </label>
          <input
            type="text"
            id="subtitle"
            value={formData.subtitle}
            onChange={e => handleInputChange("subtitle", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter slide subtitle"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          rows={3}
          value={formData.description}
          onChange={e => handleInputChange("description", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter slide description"
        />
      </div>

      {/* Image Upload Section */}
      <div>
        <div className="mb-3 block text-sm font-medium text-gray-700">
          Image *
          <span className="ml-2 text-xs text-gray-500">
            (Recommended: 1920x1080px or similar aspect ratio)
          </span>
        </div>

        {/* Upload Method Tabs */}
        <div className="mb-4 flex space-x-1 rounded-lg bg-gray-100 p-1">
          <button
            type="button"
            onClick={() => handleUploadMethodChange("url")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              uploadMethod === "url"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ExternalLink className="mr-2 inline h-4 w-4" />
            Image URL
          </button>
          <button
            type="button"
            onClick={() => handleUploadMethodChange("file")}
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
              uploadMethod === "file"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Upload className="mr-2 inline h-4 w-4" />
            Upload File
          </button>
        </div>

        {uploadMethod === "url" ? (
          /* URL Input */
          <div>
            <input
              type="url"
              value={formData.image_url}
              onChange={e => handleInputChange("image_url", e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://example.com/image.jpg"
            />
          </div>
        ) : (
          /* File Upload */
          <div>
            {uploadedFile ? (
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <div className="flex items-center">
                  <ImageIcon className="mr-2 h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-700">{uploadedFile.name}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    ({(uploadedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeFile}
                  className="flex items-center gap-1"
                >
                  <X className="h-3 w-3" />
                  Remove
                </Button>
              </div>
            ) : (
              <div
                {...getRootProps()}
                className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  isDragActive
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <input {...getInputProps()} />
                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="text-sm text-gray-600">
                  {isDragActive
                    ? "Drop the image here..."
                    : "Drag & drop an image here, or click to select"}
                </p>
                <p className="mt-2 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
              </div>
            )}
          </div>
        )}

        {/* Image Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-gray-700">Preview:</p>
            <div className="relative h-32 w-full max-w-md">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="rounded-lg border object-cover"
                onError={() => setPreviewUrl("")}
              />
            </div>
          </div>
        )}
      </div>

      {/* Image Alt Text */}
      <div>
        <label htmlFor="image_alt" className="block text-sm font-medium text-gray-700">
          Image Alt Text
        </label>
        <input
          type="text"
          id="image_alt"
          value={formData.image_alt}
          onChange={e => handleInputChange("image_alt", e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Describe the image for accessibility"
        />
      </div>

      {/* Link Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="link_url" className="block text-sm font-medium text-gray-700">
            Link URL
          </label>
          <input
            type="url"
            id="link_url"
            value={formData.link_url}
            onChange={e => handleInputChange("link_url", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label htmlFor="link_text" className="block text-sm font-medium text-gray-700">
            Link Text
          </label>
          <input
            type="text"
            id="link_text"
            value={formData.link_text}
            onChange={e => handleInputChange("link_text", e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Learn More"
          />
        </div>
      </div>

      {/* Display Settings */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div>
          <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
            Sort Order
          </label>
          <input
            type="number"
            id="sort_order"
            value={formData.sort_order}
            onChange={e => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            min="0"
          />
        </div>

        <div className="flex items-center pt-6">
          <input
            type="checkbox"
            id="is_active"
            checked={formData.is_active}
            onChange={e => handleInputChange("is_active", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
            Active (visible in gallery)
          </label>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
          {isSubmitting && <LoadingSpinner size="sm" />}
          {isEditing ? "Update Slide" : "Create Slide"}
        </Button>
      </div>
    </form>
  );
}
