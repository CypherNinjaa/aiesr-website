"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useEvent, useCreateEvent, useUpdateEvent } from "@/hooks/useEvents";
import { CategoryService } from "@/services/category";
import { StorageService } from "@/services/storage";
import { Event, Category } from "@/types";

interface EventFormProps {
  eventId?: string;
}

export default function EventForm({ eventId }: EventFormProps) {
  const router = useRouter();
  const { adminUser } = useAdminAuth();
  const isEditing = !!eventId;

  const { data: existingEvent, isLoading: loadingEvent } = useEvent(eventId || "", {
    enabled: isEditing,
  });

  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const [formData, setFormData] = useState<Partial<Event>>({
    title: "",
    description: "",
    shortDescription: "",
    date: new Date(),
    endDate: undefined,
    location: "",
    type: "academic",
    category_id: undefined, // New dynamic category field
    image: "",
    posterImage: "", // New poster image field
    pdfBrochure: "", // New PDF brochure field
    registrationRequired: true,
    registrationDeadline: undefined,
    featured: false,
    capacity: undefined,
    speakers: [],
    schedule: [],
    tags: [],
    status: "draft",
  });
  const [speakers, setSpeakers] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [schedule, setSchedule] = useState<string>("");
  const [imageUploadMode, setImageUploadMode] = useState<"url" | "upload">("url");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [posterImagePreview, setPosterImagePreview] = useState<string>("");
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [posterUploadProgress, setPosterUploadProgress] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const posterFileInputRef = useRef<HTMLInputElement>(null);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setCategoriesLoading(true);
        const fetchedCategories = await CategoryService.getActiveCategories();
        setCategories(fetchedCategories);
      } catch (error) {
        console.error("Failed to load categories:", error);
        setUploadError("Failed to load categories. Please refresh the page.");
      } finally {
        setCategoriesLoading(false);
      }
    };

    loadCategories();
  }, []);
  useEffect(() => {
    if (existingEvent) {
      setFormData(existingEvent);
      setSpeakers(existingEvent.speakers?.join(", ") || "");
      setTags(existingEvent.tags?.join(", ") || "");
      setSchedule(JSON.stringify(existingEvent.schedule || [], null, 2));
      setImagePreview(existingEvent.image || "");
      setPosterImagePreview(existingEvent.posterImage || "");
    }
  }, [existingEvent]);
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      setUploadError("");

      // Upload to Supabase Storage
      const result = await StorageService.uploadImage(file, "event-images", "events");

      if (result.success && result.url) {
        setImagePreview(result.url);
        handleInputChange("image", result.url);
      } else {
        setUploadError(result.error || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("Upload failed. Please try again.");
    } finally {
      setUploadProgress(false);
    }
  };

  const handleImageUrlChange = async (url: string) => {
    if (!url) {
      handleInputChange("image", "");
      setImagePreview("");
      setUploadError("");
      return;
    }

    try {
      setUploadError("");

      // Validate the URL
      const validation = await StorageService.validateImageUrl(url);
      if (!validation.valid) {
        setUploadError(validation.error || "Invalid image URL");
        return;
      }

      handleInputChange("image", url);
      setImagePreview(url);
    } catch (_error) {
      setUploadError("Failed to validate image URL");
    }
  };

  const clearImage = () => {
    setImagePreview("");
    setUploadError("");
    handleInputChange("image", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  const handlePosterImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setPosterUploadProgress(true);
      setUploadError(""); // Upload to Supabase Storage
      const result = await StorageService.uploadImage(file, "event-images", "posters");

      if (result.success && result.url) {
        setPosterImagePreview(result.url);
        handleInputChange("posterImage", result.url);
      } else {
        setUploadError(result.error || "Poster upload failed");
      }
    } catch (error) {
      console.error("Poster upload error:", error);
      setUploadError("Poster upload failed. Please try again.");
    } finally {
      setPosterUploadProgress(false);
    }
  };

  const handlePosterImageUrlChange = async (url: string) => {
    if (!url) {
      handleInputChange("posterImage", "");
      setPosterImagePreview("");
      return;
    }

    try {
      // Validate the URL
      const validation = await StorageService.validateImageUrl(url);
      if (!validation.valid) {
        setUploadError(validation.error || "Invalid poster image URL");
        return;
      }

      handleInputChange("posterImage", url);
      setPosterImagePreview(url);
    } catch (_error) {
      setUploadError("Failed to validate poster image URL");
    }
  };

  const clearPosterImage = () => {
    setPosterImagePreview("");
    handleInputChange("posterImage", "");
    if (posterFileInputRef.current) {
      posterFileInputRef.current.value = "";
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!adminUser?.user?.id) {
      console.error("User must be logged in as an admin to perform this action");
      return;
    }

    // Validate registration link requirement
    if (formData.registrationRequired && !formData.customRegistrationLink?.trim()) {
      setUploadError("Registration link is required when registration is enabled.");
      return;
    }

    try {
      const eventData = {
        ...formData,
        speakers: speakers
          .split(",")
          .map(s => s.trim())
          .filter(Boolean),
        tags: tags
          .split(",")
          .map(t => t.trim())
          .filter(Boolean),
        schedule: schedule ? JSON.parse(schedule) : undefined,
      };

      if (isEditing) {
        await updateEvent.mutateAsync({
          id: eventId!,
          updates: eventData,
        });
      } else {
        await createEvent.mutateAsync({
          ...eventData,
          createdBy: adminUser.user.id,
        });
      }

      router.push("/admin/events");
    } catch (error) {
      console.error("Error saving event:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      // Handle error appropriately - could show toast notification or set error state
      setUploadError(errorMessage);
    }
  };
  const handleInputChange = (field: keyof Event, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (isEditing && loadingEvent) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? "Edit Event" : "Create New Event"}
        </h1>
        <p className="mt-2 text-gray-600">
          {isEditing ? "Update event details" : "Fill in the details for the new event"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-lg bg-white shadow-sm">
        <div className="space-y-6 px-6 py-8">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              {" "}
              <label htmlFor="event-title" className="mb-2 block text-sm font-medium text-gray-700">
                Event Title *
              </label>
              <input
                id="event-title"
                type="text"
                required
                value={formData.title}
                onChange={e => handleInputChange("title", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Enter event title"
              />
            </div>{" "}
            <div>
              <label
                htmlFor="event-category"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Event Category *
              </label>
              {categoriesLoading ? (
                <div className="flex items-center justify-center rounded-md border border-gray-300 px-3 py-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                  <span className="ml-2 text-sm text-gray-500">Loading categories...</span>
                </div>
              ) : (
                <select
                  id="event-category"
                  required
                  value={formData.category_id || ""}
                  onChange={e => handleInputChange("category_id", e.target.value || undefined)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.icon_emoji} {category.name}
                    </option>
                  ))}
                </select>
              )}
              {categories.length === 0 && !categoriesLoading && (
                <p className="mt-1 text-sm text-gray-500">
                  No categories available. Please create categories first.
                </p>
              )}
            </div>{" "}
            <div>
              <label
                htmlFor="event-status"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Status *
              </label>
              <select
                id="event-status"
                required
                value={formData.status}
                onChange={e => handleInputChange("status", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>{" "}
            {/* Start Date and Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label
                  htmlFor="start-date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Start Date *
                </label>
                <input
                  id="start-date"
                  type="date"
                  required
                  value={formData.date ? new Date(formData.date).toISOString().slice(0, 10) : ""}
                  onChange={e => {
                    const newDate = new Date(e.target.value);
                    if (formData.date) {
                      // Preserve existing time
                      const existingTime = new Date(formData.date);
                      newDate.setHours(existingTime.getHours());
                      newDate.setMinutes(existingTime.getMinutes());
                    }
                    handleInputChange("date", newDate);
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="start-time"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Start Time *
                </label>
                <input
                  id="start-time"
                  type="time"
                  required
                  value={formData.date ? new Date(formData.date).toTimeString().slice(0, 5) : ""}
                  onChange={e => {
                    const [hours, minutes] = e.target.value.split(":");
                    const newDate = formData.date ? new Date(formData.date) : new Date();
                    newDate.setHours(parseInt(hours, 10));
                    newDate.setMinutes(parseInt(minutes, 10));
                    handleInputChange("date", newDate);
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
            {/* End Date and Time */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="end-date" className="mb-2 block text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  id="end-date"
                  type="date"
                  value={
                    formData.endDate ? new Date(formData.endDate).toISOString().slice(0, 10) : ""
                  }
                  onChange={e => {
                    if (e.target.value) {
                      const newDate = new Date(e.target.value);
                      if (formData.endDate) {
                        // Preserve existing time
                        const existingTime = new Date(formData.endDate);
                        newDate.setHours(existingTime.getHours());
                        newDate.setMinutes(existingTime.getMinutes());
                      } else {
                        // Default to 2 hours after start time
                        const startDate = formData.date ? new Date(formData.date) : new Date();
                        newDate.setHours(startDate.getHours() + 2);
                        newDate.setMinutes(startDate.getMinutes());
                      }
                      handleInputChange("endDate", newDate);
                    } else {
                      handleInputChange("endDate", undefined);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="end-time" className="mb-2 block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  id="end-time"
                  type="time"
                  value={
                    formData.endDate ? new Date(formData.endDate).toTimeString().slice(0, 5) : ""
                  }
                  onChange={e => {
                    if (e.target.value) {
                      const [hours, minutes] = e.target.value.split(":");
                      const newDate = formData.endDate
                        ? new Date(formData.endDate)
                        : formData.date
                          ? new Date(formData.date)
                          : new Date();
                      newDate.setHours(parseInt(hours, 10));
                      newDate.setMinutes(parseInt(minutes, 10));
                      handleInputChange("endDate", newDate);
                    } else if (formData.endDate) {
                      // If time is cleared but date exists, keep the date but clear time
                      handleInputChange("endDate", undefined);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>{" "}
            <div>
              <label
                htmlFor="event-location"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Location *
              </label>
              <input
                id="event-location"
                type="text"
                required
                value={formData.location}
                onChange={e => handleInputChange("location", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Event location"
              />
            </div>
            <div>
              {" "}
              <label
                htmlFor="event-capacity"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Capacity
              </label>
              <input
                id="event-capacity"
                type="number"
                value={formData.capacity || ""}
                onChange={e =>
                  handleInputChange(
                    "capacity",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Maximum attendees"
              />
            </div>
          </div>
          {/* Descriptions */}{" "}
          <div>
            <label
              htmlFor="event-short-description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Short Description *
            </label>
            <textarea
              id="event-short-description"
              required
              rows={2}
              value={formData.shortDescription}
              onChange={e => handleInputChange("shortDescription", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Brief description for event listings"
            />
          </div>{" "}
          <div>
            <label
              htmlFor="event-description"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Full Description *
            </label>
            <textarea
              id="event-description"
              required
              rows={6}
              value={formData.description}
              onChange={e => handleInputChange("description", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Detailed description of the event"
            />
          </div>
          {/* Additional Fields */}{" "}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {" "}
            {/* Image Upload Section */}
            <div className="md:col-span-2">
              <fieldset className="rounded-lg border border-gray-200 p-4">
                <legend className="px-2 text-sm font-medium text-gray-700">Event Image</legend>
                {/* Toggle between URL and Upload */}
                <div className="mb-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("url")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      imageUploadMode === "url"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("upload")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      imageUploadMode === "upload"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Upload Image
                  </button>
                </div>
                {/* URL Input */}
                {imageUploadMode === "url" && (
                  <div>
                    <label htmlFor="event-image-url" className="sr-only">
                      Image URL
                    </label>
                    <input
                      id="event-image-url"
                      type="url"
                      value={formData.image || ""}
                      onChange={e => handleImageUrlChange(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                )}{" "}
                {/* File Upload */}
                {imageUploadMode === "upload" && (
                  <div>
                    <label htmlFor="event-image-file" className="sr-only">
                      Upload Image File
                    </label>
                    <input
                      id="event-image-file"
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadProgress}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Supported formats: JPG, PNG, GIF, WebP (max 10MB)
                    </p>
                  </div>
                )}
                {/* Upload Progress */}
                {uploadProgress && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-gray-600">Uploading image...</span>
                  </div>
                )}
                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-3 rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Preview:</span>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={imagePreview}
                        alt="Event image preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
              </fieldset>
            </div>
            {/* Poster Image Upload Section */}
            <div className="md:col-span-2">
              <fieldset className="rounded-lg border border-gray-200 p-4">
                <legend className="px-2 text-sm font-medium text-gray-700">
                  Event Poster Image
                </legend>
                {/* Toggle between URL and Upload */}
                <div className="mb-4 flex gap-4">
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("url")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      imageUploadMode === "url"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Image URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode("upload")}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      imageUploadMode === "upload"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Upload Image
                  </button>
                </div>
                {/* URL Input */}
                {imageUploadMode === "url" && (
                  <div>
                    <label htmlFor="event-poster-image-url" className="sr-only">
                      Poster Image URL
                    </label>
                    <input
                      id="event-poster-image-url"
                      type="url"
                      value={formData.posterImage || ""}
                      onChange={e => handlePosterImageUrlChange(e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="https://example.com/poster-image.jpg"
                    />
                  </div>
                )}{" "}
                {/* File Upload */}
                {imageUploadMode === "upload" && (
                  <div>
                    <label htmlFor="event-poster-image-file" className="sr-only">
                      Upload Poster Image File
                    </label>
                    <input
                      id="event-poster-image-file"
                      ref={posterFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePosterImageUpload}
                      disabled={posterUploadProgress}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Supported formats: JPG, PNG, GIF, WebP (max 10MB)
                    </p>
                  </div>
                )}
                {/* Upload Progress */}
                {posterUploadProgress && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-gray-600">Uploading poster image...</span>
                  </div>
                )}
                {/* Upload Error */}
                {uploadError && (
                  <div className="mt-3 rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}
                {/* Image Preview */}
                {posterImagePreview && (
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Preview:</span>
                      <button
                        type="button"
                        onClick={clearPosterImage}
                        className="text-sm font-medium text-red-600 hover:text-red-800"
                      >
                        Remove Image
                      </button>
                    </div>
                    <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={posterImagePreview}
                        alt="Event poster image preview"
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  </div>
                )}
              </fieldset>
            </div>
            {/* PDF Brochure Section */}
            <div className="md:col-span-2">
              <fieldset className="rounded-lg border border-gray-200 p-4">
                <legend className="px-2 text-sm font-medium text-gray-700">PDF Brochure</legend>
                <div>
                  <label htmlFor="event-pdf-brochure" className="sr-only">
                    PDF Brochure URL
                  </label>
                  <input
                    id="event-pdf-brochure"
                    type="url"
                    value={formData.pdfBrochure || ""}
                    onChange={e => handleInputChange("pdfBrochure", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://example.com/event-brochure.pdf"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    URL to downloadable PDF brochure for the event
                  </p>
                </div>
                {/* PDF Preview Link */}
                {formData.pdfBrochure && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Preview:</span>
                      <a
                        href={formData.pdfBrochure}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                      >
                        📄 View PDF
                      </a>
                    </div>
                  </div>
                )}
              </fieldset>
            </div>
            {/* Registration Deadline */}
            <div>
              <label
                htmlFor="registration-deadline"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Registration Deadline
              </label>
              <input
                id="registration-deadline"
                type="datetime-local"
                value={
                  formData.registrationDeadline
                    ? new Date(formData.registrationDeadline).toISOString().slice(0, 16)
                    : ""
                }
                onChange={e =>
                  handleInputChange(
                    "registrationDeadline",
                    e.target.value ? new Date(e.target.value) : undefined
                  )
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>{" "}
          <div>
            <label
              htmlFor="event-speakers"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Speakers (comma-separated)
            </label>
            <input
              id="event-speakers"
              type="text"
              value={speakers}
              onChange={e => setSpeakers(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Dr. John Doe, Prof. Jane Smith"
            />
          </div>{" "}
          <div>
            <label htmlFor="event-tags" className="mb-2 block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              id="event-tags"
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="literature, festival, academic"
            />
          </div>{" "}
          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.registrationRequired}
                onChange={e => handleInputChange("registrationRequired", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Registration Required</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={e => handleInputChange("featured", e.target.checked)}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Featured Event</span>
            </label>
          </div>
          {/* Registration Link - Required when registration is enabled */}
          {formData.registrationRequired && (
            <div>
              <label
                htmlFor="registration-link"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Registration Link <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                id="registration-link"
                value={formData.customRegistrationLink || ""}
                onChange={e => handleInputChange("customRegistrationLink", e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="https://example.com/register"
                required={formData.registrationRequired}
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter the URL where users can register for this event. This is required when
                registration is enabled.
              </p>
            </div>
          )}{" "}
          {/* Schedule (JSON) */}
          <div>
            <label
              htmlFor="event-schedule"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Schedule (JSON format)
            </label>
            <textarea
              id="event-schedule"
              rows={6}
              value={schedule}
              onChange={e => setSchedule(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder={JSON.stringify(
                [
                  {
                    time: "09:00 AM",
                    title: "Registration & Welcome",
                    speaker: "Event Team",
                    description: "Welcome and registration process",
                  },
                ],
                null,
                2
              )}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter schedule as JSON array. Leave empty if no schedule needed.
            </p>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 border-t border-gray-200 bg-gray-50 px-6 py-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={createEvent.isPending || updateEvent.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {createEvent.isPending || updateEvent.isPending
              ? "Saving..."
              : isEditing
                ? "Update Event"
                : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}
