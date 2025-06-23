// ============================================
// FACULTY FORM - Create/Edit Faculty Form
// Comprehensive form for faculty management with photo upload
// ============================================

"use client";

import { AlertCircle, Loader2, Plus, X, Upload, User, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useCreateFaculty, useUpdateFaculty, useUploadFacultyPhoto } from "@/hooks/useFaculty";
import { validateFacultyData } from "@/services/faculty";
import { Faculty, CreateFacultyData, FacultyPublication } from "@/types";

interface FacultyFormProps {
  faculty?: Faculty | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  designation: string;
  email: string;
  phone: string;
  specialization: string[];
  experience: number;
  education: string[];
  qualifications: string[];
  research_areas: string[];
  publications: FacultyPublication[];
  achievements: string[];
  bio: string;
  profile_image_url: string;
  office_location: string;
  office_hours: string;
  linkedin_url: string;
  research_gate_url: string;
  google_scholar_url: string;
  personal_website: string;
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
}

const initialFormData: FormData = {
  name: "",
  designation: "",
  email: "",
  phone: "",
  specialization: [],
  experience: 0,
  education: [],
  qualifications: [],
  research_areas: [],
  publications: [],
  achievements: [],
  bio: "",
  profile_image_url: "",
  office_location: "",
  office_hours: "",
  linkedin_url: "",
  research_gate_url: "",
  google_scholar_url: "",
  personal_website: "",
  is_active: true,
  is_featured: false,
  sort_order: 0,
};

const initialPublication: FacultyPublication = {
  title: "",
  year: new Date().getFullYear(),
  journal: "",
  url: "",
};

export function FacultyForm({ faculty, onSuccess, onCancel }: FacultyFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Input states for array fields
  const [newSpecialization, setNewSpecialization] = useState("");
  const [newEducation, setNewEducation] = useState("");
  const [_newQualification, _setNewQualification] = useState("");
  const [newResearchArea, setNewResearchArea] = useState("");
  const [_newAchievement, _setNewAchievement] = useState("");
  const [newPublication, setNewPublication] = useState<FacultyPublication>(initialPublication);

  const createFaculty = useCreateFaculty();
  const updateFaculty = useUpdateFaculty();
  const uploadPhoto = useUploadFacultyPhoto();

  const isEditing = !!faculty;
  const isLoading = createFaculty.isPending || updateFaculty.isPending || uploadPhoto.isPending;

  // Load faculty data for editing
  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name,
        designation: faculty.designation,
        email: faculty.email || "",
        phone: faculty.phone || "",
        specialization: faculty.specialization,
        experience: faculty.experience,
        education: faculty.education,
        qualifications: faculty.qualifications,
        research_areas: faculty.research_areas,
        publications: faculty.publications,
        achievements: faculty.achievements,
        bio: faculty.bio || "",
        profile_image_url: faculty.profile_image_url || "",
        office_location: faculty.office_location || "",
        office_hours: faculty.office_hours || "",
        linkedin_url: faculty.linkedin_url || "",
        research_gate_url: faculty.research_gate_url || "",
        google_scholar_url: faculty.google_scholar_url || "",
        personal_website: faculty.personal_website || "",
        is_active: faculty.is_active,
        is_featured: faculty.is_featured,
        sort_order: faculty.sort_order,
      });
      setPhotoPreview(faculty.profile_image_url || "");
    } else {
      setFormData(initialFormData);
      setPhotoPreview("");
    }
  }, [faculty]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setSelectedFile(null);
    setPhotoPreview("");
    setFormData(prev => ({ ...prev, profile_image_url: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addToArray = (
    field: keyof Pick<
      FormData,
      "specialization" | "education" | "qualifications" | "research_areas" | "achievements"
    >,
    value: string
  ) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()],
      })); // Clear the input
      switch (field) {
        case "specialization":
          setNewSpecialization("");
          break;
        case "education":
          setNewEducation("");
          break;
        case "qualifications":
          _setNewQualification("");
          break;
        case "research_areas":
          setNewResearchArea("");
          break;
        case "achievements":
          _setNewAchievement("");
          break;
      }
    }
  };

  const removeFromArray = (
    field: keyof Pick<
      FormData,
      "specialization" | "education" | "qualifications" | "research_areas" | "achievements"
    >,
    index: number
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const addPublication = () => {
    if (newPublication.title.trim()) {
      setFormData(prev => ({
        ...prev,
        publications: [...prev.publications, { ...newPublication }],
      }));
      setNewPublication(initialPublication);
    }
  };

  const removePublication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      publications: prev.publications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateFacultyData(formData);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      let photoUrl = formData.profile_image_url;

      // Upload photo if a new file is selected
      if (selectedFile) {
        const tempId = faculty?.id || "temp-" + Date.now();
        photoUrl = await uploadPhoto.mutateAsync({ file: selectedFile, facultyId: tempId });
      }

      const facultyData: CreateFacultyData = {
        name: formData.name,
        designation: formData.designation,
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        specialization: formData.specialization,
        experience: formData.experience,
        education: formData.education,
        qualifications: formData.qualifications,
        research_areas: formData.research_areas,
        publications: formData.publications,
        achievements: formData.achievements,
        bio: formData.bio || undefined,
        profile_image_url: photoUrl || undefined,
        office_location: formData.office_location || undefined,
        office_hours: formData.office_hours || undefined,
        linkedin_url: formData.linkedin_url || undefined,
        research_gate_url: formData.research_gate_url || undefined,
        google_scholar_url: formData.google_scholar_url || undefined,
        personal_website: formData.personal_website || undefined,
        is_active: formData.is_active,
        is_featured: formData.is_featured,
        sort_order: formData.sort_order,
      };

      if (isEditing && faculty) {
        await updateFaculty.mutateAsync({ id: faculty.id, data: facultyData });
      } else {
        await createFaculty.mutateAsync(facultyData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving faculty:", error);
      setErrors([error instanceof Error ? error.message : "Failed to save faculty member"]);
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

      {/* Profile Photo */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Profile Photo</h3>

        <div className="flex items-start space-x-6">
          <div className="relative">
            <div className="h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-100">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Faculty photo preview"
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
            </div>
            {photoPreview && (
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                title="Remove photo"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex-1">
            <label htmlFor="photo-upload" className="sr-only">
              Upload faculty photo
            </label>
            <input
              id="photo-upload"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              title="Upload faculty photo"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              {photoPreview ? "Change Photo" : "Upload Photo"}
            </Button>
            <p className="mt-2 text-sm text-gray-500">
              Upload a professional photo. Recommended size: 400x400px. Max size: 10MB.
            </p>
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="faculty-name" className="block text-sm font-medium text-gray-700">
              Full Name *
            </label>
            <input
              id="faculty-name"
              type="text"
              value={formData.name}
              onChange={e => handleInputChange("name", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Dr. John Doe"
            />
          </div>

          <div>
            <label
              htmlFor="faculty-designation"
              className="block text-sm font-medium text-gray-700"
            >
              Designation *
            </label>
            <input
              id="faculty-designation"
              type="text"
              value={formData.designation}
              onChange={e => handleInputChange("designation", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Professor of English Literature"
            />
          </div>

          <div>
            <label htmlFor="faculty-email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="faculty-email"
              type="email"
              value={formData.email}
              onChange={e => handleInputChange("email", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="john.doe@university.edu"
            />
          </div>

          <div>
            <label htmlFor="faculty-phone" className="block text-sm font-medium text-gray-700">
              Phone
            </label>
            <input
              id="faculty-phone"
              type="tel"
              value={formData.phone}
              onChange={e => handleInputChange("phone", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label htmlFor="faculty-experience" className="block text-sm font-medium text-gray-700">
              Experience (Years) *
            </label>
            <input
              id="faculty-experience"
              type="number"
              value={formData.experience}
              onChange={e => handleInputChange("experience", parseInt(e.target.value) || 0)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              min="0"
            />
          </div>

          <div>
            <label htmlFor="faculty-sort-order" className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              id="faculty-sort-order"
              type="number"
              value={formData.sort_order}
              onChange={e => handleInputChange("sort_order", parseInt(e.target.value) || 0)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              min="0"
            />
          </div>
        </div>

        <div>
          <label htmlFor="faculty-bio" className="block text-sm font-medium text-gray-700">
            Biography
          </label>
          <textarea
            id="faculty-bio"
            value={formData.bio}
            onChange={e => handleInputChange("bio", e.target.value)}
            rows={4}
            className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
            placeholder="Brief biography and background information..."
          />
        </div>
      </div>

      {/* Professional Information */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label
              htmlFor="faculty-office-location"
              className="block text-sm font-medium text-gray-700"
            >
              Office Location
            </label>
            <input
              id="faculty-office-location"
              type="text"
              value={formData.office_location}
              onChange={e => handleInputChange("office_location", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Room 123, Building A"
            />
          </div>

          <div>
            <label
              htmlFor="faculty-office-hours"
              className="block text-sm font-medium text-gray-700"
            >
              Office Hours
            </label>
            <input
              id="faculty-office-hours"
              type="text"
              value={formData.office_hours}
              onChange={e => handleInputChange("office_hours", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Mon-Fri 2:00-4:00 PM"
            />
          </div>
        </div>{" "}
        {/* Specialization */}
        <div>
          <label
            htmlFor="specialization-input"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Specialization Areas *
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="specialization-input"
              type="text"
              value={newSpecialization}
              onChange={e => setNewSpecialization(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Add specialization area"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("specialization", newSpecialization);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addToArray("specialization", newSpecialization)}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.specialization.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
              >
                <span className="text-sm">{item}</span>{" "}
                <button
                  type="button"
                  onClick={() => removeFromArray("specialization", index)}
                  className="text-red-600 hover:text-red-800"
                  title={`Remove specialization: ${item}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        {/* Continue with other array fields... */} {/* Education */}
        <div>
          <label htmlFor="education-input" className="mb-3 block text-sm font-medium text-gray-700">
            Education
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="education-input"
              type="text"
              value={newEducation}
              onChange={e => setNewEducation(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Add education qualification"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("education", newEducation);
                }
              }}
            />
            <Button type="button" onClick={() => addToArray("education", newEducation)} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.education.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
              >
                <span className="text-sm">{item}</span>{" "}
                <button
                  type="button"
                  onClick={() => removeFromArray("education", index)}
                  className="text-red-600 hover:text-red-800"
                  title={`Remove education: ${item}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>{" "}
        {/* Research Areas */}
        <div>
          <label
            htmlFor="research-area-input"
            className="mb-3 block text-sm font-medium text-gray-700"
          >
            Research Areas
          </label>
          <div className="mb-3 flex gap-2">
            <input
              id="research-area-input"
              type="text"
              value={newResearchArea}
              onChange={e => setNewResearchArea(e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="Add research area"
              onKeyPress={e => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addToArray("research_areas", newResearchArea);
                }
              }}
            />
            <Button
              type="button"
              onClick={() => addToArray("research_areas", newResearchArea)}
              size="sm"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.research_areas.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded bg-gray-50 px-3 py-2"
              >
                <span className="text-sm">{item}</span>{" "}
                <button
                  type="button"
                  onClick={() => removeFromArray("research_areas", index)}
                  className="text-red-600 hover:text-red-800"
                  title={`Remove research area: ${item}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Publications */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Publications</h3>

        <div className="rounded-lg border bg-gray-50 p-4">
          <h4 className="mb-4 font-medium text-gray-900">Add New Publication</h4>{" "}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="pub-title" className="mb-1 block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                id="pub-title"
                type="text"
                value={newPublication.title}
                onChange={e => setNewPublication(prev => ({ ...prev, title: e.target.value }))}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                placeholder="Publication title"
              />
            </div>
            <div>
              <label htmlFor="pub-year" className="mb-1 block text-sm font-medium text-gray-700">
                Year
              </label>
              <input
                id="pub-year"
                type="number"
                value={newPublication.year}
                onChange={e =>
                  setNewPublication(prev => ({
                    ...prev,
                    year: parseInt(e.target.value) || new Date().getFullYear(),
                  }))
                }
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                min="1900"
                max={new Date().getFullYear() + 5}
                title="Publication year"
              />
            </div>
            <div>
              <label htmlFor="pub-journal" className="mb-1 block text-sm font-medium text-gray-700">
                Journal/Book
              </label>
              <input
                id="pub-journal"
                type="text"
                value={newPublication.journal || ""}
                onChange={e => setNewPublication(prev => ({ ...prev, journal: e.target.value }))}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                placeholder="Journal or book name"
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="pub-url" className="mb-1 block text-sm font-medium text-gray-700">
                URL (optional)
              </label>
              <input
                id="pub-url"
                type="url"
                value={newPublication.url || ""}
                onChange={e => setNewPublication(prev => ({ ...prev, url: e.target.value }))}
                className="focus:ring-burgundy focus:border-burgundy w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
                placeholder="https://example.com/publication"
              />
            </div>
          </div>
          <Button type="button" onClick={addPublication} className="mt-4" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Publication
          </Button>
        </div>

        <div className="space-y-3">
          {formData.publications.map((pub, index) => (
            <div
              key={index}
              className="flex items-start justify-between rounded border bg-white p-4"
            >
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{pub.title}</h4>
                <p className="text-sm text-gray-600">
                  {pub.journal && `${pub.journal}, `}
                  {pub.year}
                </p>
                {pub.url && (
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Publication
                  </a>
                )}
              </div>{" "}
              <button
                type="button"
                onClick={() => removePublication(index)}
                className="text-red-600 hover:text-red-800"
                title={`Remove publication: ${pub.title}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* External Links */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Professional Links</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="faculty-linkedin" className="block text-sm font-medium text-gray-700">
              LinkedIn URL
            </label>
            <input
              id="faculty-linkedin"
              type="url"
              value={formData.linkedin_url}
              onChange={e => handleInputChange("linkedin_url", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label
              htmlFor="faculty-google-scholar"
              className="block text-sm font-medium text-gray-700"
            >
              Google Scholar URL
            </label>
            <input
              id="faculty-google-scholar"
              type="url"
              value={formData.google_scholar_url}
              onChange={e => handleInputChange("google_scholar_url", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="https://scholar.google.com/citations?user=..."
            />
          </div>

          <div>
            <label
              htmlFor="faculty-research-gate"
              className="block text-sm font-medium text-gray-700"
            >
              ResearchGate URL
            </label>
            <input
              id="faculty-research-gate"
              type="url"
              value={formData.research_gate_url}
              onChange={e => handleInputChange("research_gate_url", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="https://researchgate.net/profile/..."
            />
          </div>

          <div>
            <label htmlFor="faculty-website" className="block text-sm font-medium text-gray-700">
              Personal Website
            </label>
            <input
              id="faculty-website"
              type="url"
              value={formData.personal_website}
              onChange={e => handleInputChange("personal_website", e.target.value)}
              className="focus:ring-burgundy focus:border-burgundy mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none"
              placeholder="https://personal-website.com"
            />
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Display Settings</h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4 border-t pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading} className="flex items-center gap-2">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
          {isEditing ? "Update Faculty" : "Create Faculty"}
        </Button>
      </div>
    </form>
  );
}
