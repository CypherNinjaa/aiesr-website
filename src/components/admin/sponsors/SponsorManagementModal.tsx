"use client";

import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useCreateSponsor, useUpdateSponsor } from "@/hooks/useSponsors";
import { StorageService } from "@/services/storage";
import { SPONSOR_TIERS, CreateSponsorData, Sponsor } from "@/types";

interface SponsorManagementModalProps {
  sponsor?: Sponsor | null;
  mode: "create" | "edit";
  onClose: () => void;
}

const SponsorManagementModal: React.FC<SponsorManagementModalProps> = ({
  sponsor,
  mode,
  onClose,
}) => {
  const [formData, setFormData] = useState<CreateSponsorData>({
    name: "",
    logo_url: "",
    website_url: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    tier: "bronze",
    status: "active",
  });

  const [logoUploadMode, setLogoUploadMode] = useState<"url" | "upload">("url");
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createSponsor = useCreateSponsor();
  const updateSponsor = useUpdateSponsor();

  // Initialize form data when editing
  useEffect(() => {
    if (mode === "edit" && sponsor) {
      setFormData({
        name: sponsor.name || "",
        logo_url: sponsor.logo_url || "",
        website_url: sponsor.website_url || "",
        description: sponsor.description || "",
        contact_email: sponsor.contact_email || "",
        contact_phone: sponsor.contact_phone || "",
        tier: sponsor.tier || "bronze",
        status: sponsor.status || "active",
      });
      setLogoPreview(sponsor.logo_url || "");
    }
  }, [mode, sponsor]);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      setUploadError("");

      const result = await StorageService.uploadImage(file, "sponsor-logos", "sponsors");

      if (result.success && result.url) {
        setLogoPreview(result.url);
        setFormData(prev => ({ ...prev, logo_url: result.url }));
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

  const handleLogoUrlChange = (url: string) => {
    setFormData(prev => ({ ...prev, logo_url: url }));
    setLogoPreview(url);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setUploadError("Sponsor name is required");
      return;
    }

    try {
      if (mode === "create") {
        await createSponsor.mutateAsync(formData);
      } else if (sponsor) {
        await updateSponsor.mutateAsync({
          id: sponsor.id,
          updates: formData,
        });
      }
      onClose();
    } catch (error) {
      console.error(`Failed to ${mode} sponsor:`, error);
      setUploadError(`Failed to ${mode} sponsor. Please try again.`);
    }
  };

  const isLoading = createSponsor.isPending || updateSponsor.isPending;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="bg-opacity-50 fixed inset-0 bg-black transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "create" ? "Create New Sponsor" : "Edit Sponsor"}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" type="button">
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Sponsor Name */}
              <div>
                <label
                  htmlFor="sponsor-name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Sponsor Name *
                </label>
                <input
                  id="sponsor-name"
                  type="text"
                  value={formData.name || ""}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="Company name"
                  required
                />
              </div>

              {/* Tier */}
              <div>
                <label
                  htmlFor="sponsor-tier"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Tier
                </label>
                <select
                  id="sponsor-tier"
                  value={formData.tier || "bronze"}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      tier: e.target.value as "platinum" | "gold" | "silver" | "bronze" | "partner",
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  {SPONSOR_TIERS.map(tier => (
                    <option key={tier.tier} value={tier.tier}>
                      {tier.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Website URL */}
              <div>
                <label
                  htmlFor="sponsor-website"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Website URL
                </label>
                <input
                  id="sponsor-website"
                  type="url"
                  value={formData.website_url || ""}
                  onChange={e => setFormData(prev => ({ ...prev, website_url: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="https://example.com"
                />
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="sponsor-status"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="sponsor-status"
                  value={formData.status || "active"}
                  onChange={e =>
                    setFormData(prev => ({
                      ...prev,
                      status: e.target.value as "active" | "inactive",
                    }))
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Contact Email */}
              <div>
                <label
                  htmlFor="sponsor-email"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Contact Email
                </label>
                <input
                  id="sponsor-email"
                  type="email"
                  value={formData.contact_email || ""}
                  onChange={e => setFormData(prev => ({ ...prev, contact_email: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="contact@sponsor.com"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label
                  htmlFor="sponsor-phone"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Contact Phone
                </label>
                <input
                  id="sponsor-phone"
                  type="tel"
                  value={formData.contact_phone || ""}
                  onChange={e => setFormData(prev => ({ ...prev, contact_phone: e.target.value }))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="sponsor-description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="sponsor-description"
                value={formData.description || ""}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Brief description of the sponsor"
              />
            </div>

            {/* Logo Upload */}
            <div>
              <fieldset>
                <legend className="mb-2 block text-sm font-medium text-gray-700">Logo</legend>

                <div className="mb-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLogoUploadMode("url")}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                      logoUploadMode === "url"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    URL
                  </button>
                  <button
                    type="button"
                    onClick={() => setLogoUploadMode("upload")}
                    className={`rounded-md px-3 py-1 text-sm font-medium transition-colors ${
                      logoUploadMode === "upload"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    Upload
                  </button>
                </div>

                {logoUploadMode === "url" ? (
                  <input
                    type="url"
                    value={formData.logo_url || ""}
                    onChange={e => handleLogoUrlChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://example.com/logo.png"
                    aria-label="Logo URL"
                  />
                ) : (
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadProgress}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                      aria-label="Upload logo file"
                    />
                    <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                )}

                {uploadProgress && (
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm text-gray-600">Uploading...</span>
                  </div>
                )}

                {uploadError && (
                  <div className="mt-2 rounded-md bg-red-50 p-2">
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}

                {logoPreview && (
                  <div className="mt-3">
                    <div className="relative h-16 w-32 overflow-hidden rounded-md bg-gray-100">
                      <Image
                        src={logoPreview}
                        alt="Logo preview"
                        fill
                        className="object-contain"
                        sizes="128px"
                      />
                    </div>
                  </div>
                )}
              </fieldset>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !formData.name.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading
                  ? mode === "create"
                    ? "Creating..."
                    : "Updating..."
                  : mode === "create"
                    ? "Create Sponsor"
                    : "Update Sponsor"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SponsorManagementModal;
