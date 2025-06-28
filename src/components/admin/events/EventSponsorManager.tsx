"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import SponsorManagementModal from "@/components/admin/sponsors/SponsorManagementModal";
import {
  useSponsors,
  useSearchSponsors,
  useAddEventSponsor,
  useRemoveEventSponsor,
  useCreateSponsor,
} from "@/hooks/useSponsors";
import { StorageService } from "@/services/storage";
import { SPONSOR_TIERS, CreateSponsorData, EventSponsor, Sponsor } from "@/types";
import styles from "./EventSponsorManager.module.css";

interface EventSponsorManagerProps {
  eventId: string;
  eventSponsors: EventSponsor[];
}

const EventSponsorManager: React.FC<EventSponsorManagerProps> = ({ eventId, eventSponsors }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSponsor, setSelectedSponsor] = useState<string>("");
  const [sponsorTier, setSponsorTier] = useState<string>("bronze");
  const [isFeatured, setIsFeatured] = useState(false);
  const [customDescription, setCustomDescription] = useState("");

  // New sponsor form
  const [showNewSponsorForm, setShowNewSponsorForm] = useState(false);
  const [newSponsorData, setNewSponsorData] = useState<CreateSponsorData>({
    name: "",
    logo_url: "",
    website_url: "",
    description: "",
    tier: "bronze",
  });
  const [logoUploadMode, setLogoUploadMode] = useState<"url" | "upload">("url");
  const [logoPreview, setLogoPreview] = useState("");
  const [uploadProgress, setUploadProgress] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New state for sponsor editing
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Hooks
  const { data: allSponsors = [] } = useSponsors({ status: "active" });
  const { data: searchResults = [] } = useSearchSponsors(searchQuery, searchQuery.length > 0);
  const addEventSponsor = useAddEventSponsor();
  const removeEventSponsor = useRemoveEventSponsor();
  const createSponsor = useCreateSponsor();

  // Available sponsors (not already added to event)
  const availableSponsors =
    searchQuery.length > 0
      ? searchResults
      : allSponsors.filter(sponsor => !eventSponsors.some(es => es.sponsor_id === sponsor.id));

  const handleAddSponsor = async () => {
    if (!selectedSponsor || !eventId) return;

    try {
      await addEventSponsor.mutateAsync({
        event_id: eventId,
        sponsor_id: selectedSponsor,
        sponsor_tier: sponsorTier as "platinum" | "gold" | "silver" | "bronze" | "partner",
        is_featured: isFeatured,
        custom_description: customDescription || undefined,
      });

      // Reset form
      setSelectedSponsor("");
      setSponsorTier("bronze");
      setIsFeatured(false);
      setCustomDescription("");
      setShowAddForm(false);
    } catch (error) {
      console.error("Failed to add sponsor:", error);
    }
  };

  const handleRemoveSponsor = async (eventSponsorId: string) => {
    try {
      await removeEventSponsor.mutateAsync({
        id: eventSponsorId,
        eventId,
      });
    } catch (error) {
      console.error("Failed to remove sponsor:", error);
    }
  };

  // New sponsor creation
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(true);
      setUploadError("");

      const result = await StorageService.uploadImage(file, "sponsor-logos", "sponsors");

      if (result.success && result.url) {
        setLogoPreview(result.url);
        setNewSponsorData(prev => ({ ...prev, logo_url: result.url }));
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
    setNewSponsorData(prev => ({ ...prev, logo_url: url }));
    setLogoPreview(url);
  };

  const handleCreateNewSponsor = async () => {
    if (!newSponsorData.name.trim()) return;

    try {
      const sponsor = await createSponsor.mutateAsync(newSponsorData);

      // Add to event immediately
      await addEventSponsor.mutateAsync({
        event_id: eventId,
        sponsor_id: sponsor.id,
        sponsor_tier: sponsor.tier,
        is_featured: false,
      });

      // Reset form
      setNewSponsorData({
        name: "",
        logo_url: "",
        website_url: "",
        description: "",
        tier: "bronze",
      });
      setLogoPreview("");
      setShowNewSponsorForm(false);
    } catch (error) {
      console.error("Failed to create sponsor:", error);
    }
  };

  const getTierLabel = (tier: string): string => {
    const tierConfig = SPONSOR_TIERS.find(t => t.tier === tier);
    return tierConfig?.label || tier;
  };

  const getTierClassName = (tier: string): string => {
    switch (tier) {
      case "platinum":
        return styles.tierPlatinum;
      case "gold":
        return styles.tierGold;
      case "silver":
        return styles.tierSilver;
      case "bronze":
        return styles.tierBronze;
      case "partner":
        return styles.tierPartner;
      default:
        return styles.tierBronze;
    }
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setShowEditModal(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Event Sponsors</h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowNewSponsorForm(true)}
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            + New Sponsor
          </button>
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            + Add Existing
          </button>
        </div>
      </div>

      {/* Create New Sponsor Form */}
      {showNewSponsorForm && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Create New Sponsor</h4>
            <button
              type="button"
              onClick={() => setShowNewSponsorForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                value={newSponsorData.name || ""}
                onChange={e => setNewSponsorData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Sponsor company name"
              />
            </div>

            <div>
              <label
                htmlFor="sponsor-tier"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tier
              </label>
              <select
                id="sponsor-tier"
                value={newSponsorData.tier || "bronze"}
                onChange={e =>
                  setNewSponsorData(prev => ({
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
                value={newSponsorData.website_url || ""}
                onChange={e =>
                  setNewSponsorData(prev => ({ ...prev, website_url: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="https://example.com"
              />
            </div>

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
                value={newSponsorData.contact_email || ""}
                onChange={e =>
                  setNewSponsorData(prev => ({ ...prev, contact_email: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="contact@sponsor.com"
              />
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="sponsor-description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="sponsor-description"
                value={newSponsorData.description || ""}
                onChange={e =>
                  setNewSponsorData(prev => ({ ...prev, description: e.target.value }))
                }
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Brief description of the sponsor"
              />
            </div>

            {/* Logo Upload */}
            <div className="md:col-span-2">
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
                    value={newSponsorData.logo_url || ""}
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
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowNewSponsorForm(false)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreateNewSponsor}
              disabled={!newSponsorData.name.trim() || createSponsor.isPending}
              className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              {createSponsor.isPending ? "Creating..." : "Create & Add"}
            </button>
          </div>
        </div>
      )}

      {/* Add Existing Sponsor Form */}
      {showAddForm && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="font-medium text-gray-900">Add Existing Sponsor</h4>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="sponsor-search"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Search Sponsors
              </label>
              <input
                id="sponsor-search"
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Search by name..."
              />

              {availableSponsors.length > 0 && (
                <div className="mt-2 max-h-32 overflow-y-auto rounded-md border border-gray-200 bg-white">
                  {availableSponsors.map(sponsor => (
                    <button
                      key={sponsor.id}
                      type="button"
                      onClick={() => {
                        setSelectedSponsor(sponsor.id);
                        setSponsorTier(sponsor.tier);
                        setSearchQuery("");
                      }}
                      className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      <div className="flex items-center gap-2">
                        {sponsor.logo_url && (
                          <div className="relative h-6 w-12 overflow-hidden rounded">
                            <Image
                              src={sponsor.logo_url}
                              alt=""
                              fill
                              className="object-contain"
                              sizes="48px"
                            />
                          </div>
                        )}
                        <span>{sponsor.name}</span>
                        <span
                          className={`ml-auto rounded-full px-2 py-1 text-xs font-medium text-white ${getTierClassName(sponsor.tier)}`}
                        >
                          {getTierLabel(sponsor.tier)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label
                htmlFor="event-sponsor-tier"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Sponsor Tier for this Event
              </label>
              <select
                id="event-sponsor-tier"
                value={sponsorTier}
                onChange={e => setSponsorTier(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
              >
                {SPONSOR_TIERS.map(tier => (
                  <option key={tier.tier} value={tier.tier}>
                    {tier.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="featured-sponsor" className="flex items-center gap-2">
                <input
                  id="featured-sponsor"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">Featured Sponsor</span>
              </label>
            </div>

            <div className="md:col-span-2">
              <label
                htmlFor="custom-description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Custom Description (optional)
              </label>
              <textarea
                id="custom-description"
                value={customDescription}
                onChange={e => setCustomDescription(e.target.value)}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                placeholder="Event-specific description for this sponsor"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAddSponsor}
              disabled={!selectedSponsor || addEventSponsor.isPending}
              className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {addEventSponsor.isPending ? "Adding..." : "Add Sponsor"}
            </button>
          </div>
        </div>
      )}

      {/* Current Event Sponsors */}
      {eventSponsors.length > 0 && (
        <div>
          <h4 className="mb-3 font-medium text-gray-900">
            Current Sponsors ({eventSponsors.length})
          </h4>

          <div className="space-y-3">
            {eventSponsors.map(eventSponsor => (
              <div key={eventSponsor.id} className="rounded-lg border bg-white p-4 shadow-sm">
                <div className="flex items-center gap-4">
                  {eventSponsor.sponsor.logo_url && (
                    <div className="relative h-12 w-24 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={eventSponsor.sponsor.logo_url}
                        alt={eventSponsor.sponsor.name}
                        fill
                        className="object-contain"
                        sizes="96px"
                      />
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-gray-900">{eventSponsor.sponsor.name}</h5>
                      {eventSponsor.is_featured && (
                        <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium text-white ${getTierClassName(eventSponsor.sponsor_tier)}`}
                      >
                        {getTierLabel(eventSponsor.sponsor_tier)}
                      </span>
                    </div>

                    {eventSponsor.custom_description && (
                      <p className="mt-1 text-sm text-gray-600">
                        {eventSponsor.custom_description}
                      </p>
                    )}

                    {eventSponsor.sponsor.website_url && (
                      <a
                        href={eventSponsor.sponsor.website_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 text-sm text-blue-600 hover:text-blue-800"
                      >
                        {eventSponsor.sponsor.website_url}
                      </a>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditSponsor(eventSponsor.sponsor)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit sponsor"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveSponsor(eventSponsor.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Remove sponsor"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {eventSponsors.length === 0 && (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
          <p className="text-gray-500">No sponsors added yet</p>
          <p className="text-sm text-gray-400">
            Click "Add Existing" or "New Sponsor" to get started
          </p>
        </div>
      )}

      {/* Edit Sponsor Modal */}
      {showEditModal && editingSponsor && (
        <SponsorManagementModal
          sponsor={editingSponsor}
          mode="edit"
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
};

export default EventSponsorManager;
