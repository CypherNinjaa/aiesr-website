"use client";

import { Plus, Edit, Trash2, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { useNotifications } from "@/contexts/NotificationContext";
import { useSponsors, useDeleteSponsor } from "@/hooks/useSponsors";
import { Sponsor } from "@/types";
import { SponsorForm } from "./SponsorForm";

export function SponsorManagement() {
  const { showSuccess, showError } = useNotifications();
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [deleteConfirmation, setDeleteConfirmation] = useState<Sponsor | null>(null);

  const {
    data: sponsors = [],
    isLoading,
    refetch,
  } = useSponsors({
    ...(statusFilter !== "all" && { status: statusFilter as "active" | "inactive" }),
    ...(tierFilter !== "all" && { tier: tierFilter }),
  });

  const deleteSponsor = useDeleteSponsor();

  const handleCreateSponsor = () => {
    setSelectedSponsor(null);
    setFormMode("create");
    setShowForm(true);
  };

  const handleEditSponsor = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    setFormMode("edit");
    setShowForm(true);
  };

  const handleDeleteSponsor = (sponsor: Sponsor) => {
    setDeleteConfirmation(sponsor);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmation) return;

    try {
      await deleteSponsor.mutateAsync(deleteConfirmation.id);
      showSuccess(
        "Sponsor Deleted",
        `"${deleteConfirmation.name}" has been deleted successfully.`,
        3000
      );
      setDeleteConfirmation(null);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete sponsor";
      showError("Delete Failed", errorMessage, 5000);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmation(null);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedSponsor(null);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedSponsor(null);
    refetch();
  };

  const getTierBadge = (tier: string) => {
    const colors = {
      platinum: "bg-gray-800 text-white",
      gold: "bg-yellow-500 text-white",
      silver: "bg-gray-400 text-white",
      bronze: "bg-amber-600 text-white",
      partner: "bg-blue-500 text-white",
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${colors[tier as keyof typeof colors] || colors.partner}`}
      >
        {tier.charAt(0).toUpperCase() + tier.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-gray-100 text-gray-800",
    };

    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${colors[status as keyof typeof colors] || colors.inactive}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (showForm) {
    return (
      <SponsorForm
        sponsor={selectedSponsor}
        mode={formMode}
        onSuccess={handleFormSuccess}
        onCancel={handleFormClose}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Sponsors</h2>
          <p className="text-gray-600">
            Manage event sponsors and partnerships ({sponsors.length} total)
          </p>
        </div>
        <Button onClick={handleCreateSponsor} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Sponsor
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div>
          <label htmlFor="status-filter" className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div>
          <label htmlFor="tier-filter" className="mb-1 block text-sm font-medium text-gray-700">
            Tier
          </label>
          <select
            id="tier-filter"
            value={tierFilter}
            onChange={e => setTierFilter(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            <option value="all">All Tiers</option>
            <option value="platinum">Platinum</option>
            <option value="gold">Gold</option>
            <option value="silver">Silver</option>
            <option value="bronze">Bronze</option>
            <option value="partner">Partner</option>
          </select>
        </div>
      </div>

      {/* Sponsors Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sponsors.map(sponsor => (
          <Card key={sponsor.id} className="transition-shadow hover:shadow-lg">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  {sponsor.logo_url && (
                    <Image
                      src={sponsor.logo_url}
                      alt={sponsor.name}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{sponsor.name}</h3>
                    <div className="mt-1 flex items-center gap-2">
                      {getTierBadge(sponsor.tier)}
                      {getStatusBadge(sponsor.status)}
                    </div>
                  </div>
                </div>
              </div>

              {sponsor.description && (
                <p className="mb-4 line-clamp-2 text-sm text-gray-600">{sponsor.description}</p>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                {sponsor.contact_email && (
                  <div>
                    <strong>Email:</strong> {sponsor.contact_email}
                  </div>
                )}
                {sponsor.contact_phone && (
                  <div>
                    <strong>Phone:</strong> {sponsor.contact_phone}
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
                <div className="flex items-center space-x-2">
                  {sponsor.website_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(sponsor.website_url, "_blank")}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="h-3 w-3" />
                      Website
                    </Button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditSponsor(sponsor)}
                    className="flex items-center gap-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteSponsor(sponsor)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    disabled={deleteSponsor.isPending}
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sponsors.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="mb-4 text-lg text-gray-500">🤝</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">No sponsors found</h3>
            <p className="mb-4 text-gray-500">
              {statusFilter !== "all" || tierFilter !== "all"
                ? "Try adjusting your filters or create a new sponsor."
                : "Get started by adding your first sponsor."}
            </p>
            <Button onClick={handleCreateSponsor} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add New Sponsor
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmation && (
        <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
          <Card className="mx-4 w-full max-w-md">
            <CardContent className="p-6">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Delete Sponsor</h3>
              <p className="mb-6 text-gray-600">
                Are you sure you want to delete "{deleteConfirmation.name}"? This action cannot be
                undone.
              </p>
              <div className="flex items-center justify-end space-x-3">
                <Button variant="outline" onClick={cancelDelete} disabled={deleteSponsor.isPending}>
                  Cancel
                </Button>
                <Button
                  onClick={confirmDelete}
                  disabled={deleteSponsor.isPending}
                  className="bg-red-600 text-white hover:bg-red-700"
                >
                  {deleteSponsor.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
