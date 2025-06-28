"use client";

import { ArrowLeft, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useNotifications } from "@/contexts/NotificationContext";
import { useCreateSponsor, useUpdateSponsor } from "@/hooks/useSponsors";
import { Sponsor, CreateSponsorData, UpdateSponsorData } from "@/types";

interface SponsorFormProps {
  sponsor?: Sponsor | null;
  mode: "create" | "edit";
  onSuccess: () => void;
  onCancel: () => void;
}

export function SponsorForm({ sponsor, mode, onSuccess, onCancel }: SponsorFormProps) {
  const { showSuccess, showError } = useNotifications();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    logo_url: string;
    website_url: string;
    description: string;
    contact_email: string;
    contact_phone: string;
    tier: "platinum" | "gold" | "silver" | "bronze" | "partner";
    status: "active" | "inactive";
  }>({
    name: "",
    logo_url: "",
    website_url: "",
    description: "",
    contact_email: "",
    contact_phone: "",
    tier: "partner",
    status: "active",
  });

  const createSponsor = useCreateSponsor();
  const updateSponsor = useUpdateSponsor();

  useEffect(() => {
    if (sponsor && mode === "edit") {
      setFormData({
        name: sponsor.name || "",
        logo_url: sponsor.logo_url || "",
        website_url: sponsor.website_url || "",
        description: sponsor.description || "",
        contact_email: sponsor.contact_email || "",
        contact_phone: sponsor.contact_phone || "",
        tier: sponsor.tier,
        status: sponsor.status,
      });
    }
  }, [sponsor, mode]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showError("Validation Error", "Sponsor name is required", 3000);
      return;
    }

    setIsSubmitting(true);

    try {
      if (mode === "create") {
        const createData: CreateSponsorData = {
          name: formData.name.trim(),
          logo_url: formData.logo_url.trim() || undefined,
          website_url: formData.website_url.trim() || undefined,
          description: formData.description.trim() || undefined,
          contact_email: formData.contact_email.trim() || undefined,
          contact_phone: formData.contact_phone.trim() || undefined,
          tier: formData.tier,
          status: formData.status,
        };
        await createSponsor.mutateAsync(createData);
        showSuccess("Sponsor Created", `"${formData.name}" has been created successfully.`, 3000);
      } else {
        const updateData: UpdateSponsorData = {
          name: formData.name.trim(),
          logo_url: formData.logo_url.trim() || undefined,
          website_url: formData.website_url.trim() || undefined,
          description: formData.description.trim() || undefined,
          contact_email: formData.contact_email.trim() || undefined,
          contact_phone: formData.contact_phone.trim() || undefined,
          tier: formData.tier,
          status: formData.status,
        };
        await updateSponsor.mutateAsync({ id: sponsor!.id, updates: updateData });
        showSuccess("Sponsor Updated", `"${formData.name}" has been updated successfully.`, 3000);
      }
      onSuccess();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${mode} sponsor`;
      showError(`${mode === "create" ? "Create" : "Update"} Failed`, errorMessage, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCancel} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Sponsors
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {mode === "create" ? "Add New Sponsor" : `Edit ${sponsor?.name}`}
            </h2>
            <p className="text-gray-600">
              {mode === "create"
                ? "Fill in the sponsor details below"
                : "Update the sponsor information"}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium">Sponsor Information</h3>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Name */}
              <div>
                <Label htmlFor="name">Sponsor Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  placeholder="Enter sponsor name"
                  required
                />
              </div>

              {/* Tier */}
              <div>
                <Label htmlFor="tier">Sponsor Tier</Label>
                <select
                  id="tier"
                  value={formData.tier}
                  onChange={e => handleInputChange("tier", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Select sponsor tier"
                >
                  <option value="platinum">Platinum</option>
                  <option value="gold">Gold</option>
                  <option value="silver">Silver</option>
                  <option value="bronze">Bronze</option>
                  <option value="partner">Partner</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={e => handleInputChange("status", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  aria-label="Select sponsor status"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Contact Email */}
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={e => handleInputChange("contact_email", e.target.value)}
                  placeholder="contact@sponsor.com"
                />
              </div>

              {/* Contact Phone */}
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  type="tel"
                  value={formData.contact_phone}
                  onChange={e => handleInputChange("contact_phone", e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              {/* Website URL */}
              <div>
                <Label htmlFor="website_url">Website URL</Label>
                <Input
                  id="website_url"
                  type="url"
                  value={formData.website_url}
                  onChange={e => handleInputChange("website_url", e.target.value)}
                  placeholder="https://sponsor.com"
                />
              </div>
            </div>

            {/* Logo URL */}
            <div>
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                type="url"
                value={formData.logo_url}
                onChange={e => handleInputChange("logo_url", e.target.value)}
                placeholder="https://example.com/logo.png"
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={e => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the sponsor..."
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end space-x-3 border-t pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name.trim()}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting
                  ? `${mode === "create" ? "Creating" : "Updating"}...`
                  : `${mode === "create" ? "Create" : "Update"} Sponsor`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
