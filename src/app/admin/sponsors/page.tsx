"use client";

import Image from "next/image";
import { useState } from "react";
import SponsorManagementModal from "@/components/admin/sponsors/SponsorManagementModal";
import { useSponsors, useDeleteSponsor } from "@/hooks/useSponsors";
import { Sponsor } from "@/types";

export default function SponsorsManagementPage() {
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  const { data: sponsors = [], isLoading } = useSponsors();
  const deleteSponsor = useDeleteSponsor();

  const handleCreateSponsor = () => {
    setSelectedSponsor(null);
    setModalMode("create");
    setShowModal(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setModalMode("edit");
    setShowModal(true);
  };

  const handleDeleteSponsor = async (sponsor: Sponsor) => {
    // eslint-disable-next-line no-alert
    const shouldDelete = window.confirm(
      `Are you sure you want to delete "${sponsor.name}"? This action cannot be undone.`
    );

    if (shouldDelete) {
      try {
        await deleteSponsor.mutateAsync(sponsor.id);
      } catch (error) {
        console.error("Failed to delete sponsor:", error);
        // eslint-disable-next-line no-alert
        window.alert("Failed to delete sponsor. Please try again.");
      }
    }
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      platinum: "bg-gray-800 text-white",
      gold: "bg-yellow-500 text-white",
      silver: "bg-gray-400 text-white",
      bronze: "bg-amber-600 text-white",
      partner: "bg-blue-600 text-white",
    };
    return colors[tier as keyof typeof colors] || colors.bronze;
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-gray-500">Loading sponsors...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sponsor Management</h1>
          <p className="text-gray-600">Manage all sponsors and their information</p>
        </div>
        <button
          onClick={handleCreateSponsor}
          className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          + Add New Sponsor
        </button>
      </div>

      {sponsors.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900">No sponsors yet</h3>
          <p className="mt-2 text-gray-500">Get started by creating your first sponsor.</p>
          <button
            onClick={handleCreateSponsor}
            className="mt-4 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700"
          >
            Create First Sponsor
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {sponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
            >
              {/* Logo */}
              {sponsor.logo_url && (
                <div className="mb-4 flex justify-center">
                  <div className="relative h-16 w-32 overflow-hidden rounded-md bg-gray-100">
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      fill
                      className="object-contain"
                      sizes="128px"
                    />
                  </div>
                </div>
              )}

              {/* Sponsor Info */}
              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                  <div className="mt-1 flex items-center gap-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getTierBadge(sponsor.tier)}`}
                    >
                      {sponsor.tier.charAt(0).toUpperCase() + sponsor.tier.slice(1)}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        sponsor.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {sponsor.status}
                    </span>
                  </div>
                </div>

                {sponsor.description && (
                  <p className="line-clamp-2 text-sm text-gray-600">{sponsor.description}</p>
                )}

                {sponsor.website_url && (
                  <a
                    href={sponsor.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Visit Website →
                  </a>
                )}

                {sponsor.contact_email && (
                  <p className="text-sm text-gray-500">{sponsor.contact_email}</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex justify-end gap-2">
                <button
                  onClick={() => handleEditSponsor(sponsor)}
                  className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteSponsor(sponsor)}
                  className="rounded-md bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  disabled={deleteSponsor.isPending}
                >
                  {deleteSponsor.isPending ? "..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Create/Edit */}
      {showModal && (
        <SponsorManagementModal
          sponsor={selectedSponsor}
          mode={modalMode}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
