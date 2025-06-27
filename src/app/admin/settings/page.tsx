"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { useNotifications } from "@/contexts/NotificationContext";
import { useSettingsForm } from "@/hooks/useSettings";
import { SettingsData } from "@/services/settings";

export default function SettingsPage() {
  const { settings, isLoading, save, isSaving, error } = useSettingsForm();
  const { showSuccess, showError, showInfo } = useNotifications();
  const [formData, setFormData] = useState<SettingsData | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Initialize form data when settings are loaded
  useEffect(() => {
    if (settings && !formData) {
      setFormData(settings);
    }
  }, [settings, formData]);

  // Track changes
  useEffect(() => {
    if (settings && formData) {
      const hasChanges = JSON.stringify(settings) !== JSON.stringify(formData);
      setHasChanges(hasChanges);
    }
  }, [settings, formData]);

  const handleSettingChange = (
    key: keyof SettingsData,
    value: string | boolean | number | string[]
  ) => {
    if (!formData) return;

    setFormData(prev => (prev ? { ...prev, [key]: value } : null));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    if (!formData) return;

    setFormData(prev =>
      prev
        ? {
            ...prev,
            socialMedia: {
              ...prev.socialMedia,
              [platform]: value,
            },
          }
        : null
    );
  };

  const handleHeroTextChange = (index: number, value: string) => {
    if (!formData) return;

    const newHeroTexts = [...formData.heroTexts];
    newHeroTexts[index] = value;
    setFormData(prev => (prev ? { ...prev, heroTexts: newHeroTexts } : null));
  };

  const addHeroText = () => {
    if (!formData) return;

    setFormData(prev =>
      prev
        ? {
            ...prev,
            heroTexts: [...prev.heroTexts, ""],
          }
        : null
    );
  };

  const removeHeroText = (index: number) => {
    if (!formData || formData.heroTexts.length <= 1) return;

    const newHeroTexts = formData.heroTexts.filter((_, i) => i !== index);
    setFormData(prev => (prev ? { ...prev, heroTexts: newHeroTexts } : null));
  };

  const handleContactPhoneChange = (index: number, value: string) => {
    if (!formData) return;

    const newPhones = [...formData.contactPhones];
    newPhones[index] = value;
    setFormData(prev => (prev ? { ...prev, contactPhones: newPhones } : null));
  };

  const addContactPhone = () => {
    if (!formData) return;

    setFormData(prev =>
      prev
        ? {
            ...prev,
            contactPhones: [...prev.contactPhones, ""],
          }
        : null
    );
  };

  const removeContactPhone = (index: number) => {
    if (!formData || formData.contactPhones.length <= 1) return;

    const newPhones = formData.contactPhones.filter((_, i) => i !== index);
    setFormData(prev => (prev ? { ...prev, contactPhones: newPhones } : null));
  };
  const handleContactAddressChange = (
    field: "line1" | "line2" | "city" | "state" | "zipCode",
    value: string
  ) => {
    if (!formData) return;

    setFormData(prev =>
      prev
        ? {
            ...prev,
            contactAddress: {
              ...prev.contactAddress,
              [field]: value,
            },
          }
        : null
    );
  };

  const handleSave = async () => {
    if (formData) {
      try {
        await save(formData);
        showSuccess("Settings Saved", "Your settings have been saved successfully!");
      } catch (_error) {
        showError("Save Failed", "Failed to save settings. Please try again.");
      }
    }
  };

  const handleReset = () => {
    if (settings) {
      setFormData(settings);
      showInfo("Settings Reset", "Settings have been reset to saved values.", 3000);
    }
  };

  // Handle refresh - just reloads the page since settings are static
  const handleRefresh = () => {
    window.location.reload();
    showInfo("Refreshing Settings", "Reloading settings page...", 2000);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-red-600">⚠️</div>
          <p className="text-gray-600">Error loading settings: {error.message}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600">No settings data available</p>
      </div>
    );
  }
  return (
    <div className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-full min-w-0 xl:max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-2 text-gray-600">Configure system preferences and website settings</p>
            {hasChanges && (
              <p className="mt-1 text-sm text-amber-600">⚠️ You have unsaved changes</p>
            )}
          </div>{" "}
          <div className="flex flex-wrap gap-2">
            <RefreshButton
              onRefresh={handleRefresh}
              isLoading={isLoading}
              variant="outline"
              size="sm"
              label="Refresh"
            />
            {hasChanges && (
              <Button variant="outline" onClick={handleReset}>
                Reset
              </Button>
            )}
            <Link href="/admin">
              <Button variant="outline">← Back to Dashboard</Button>
            </Link>
          </div>
        </div>

        <div className="space-y-8">
          {/* General Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>{" "}
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div>
                  <label
                    htmlFor="site-name"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Site Name
                  </label>
                  <input
                    id="site-name"
                    type="text"
                    value={formData.siteName}
                    onChange={e => handleSettingChange("siteName", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="site-url"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Site URL
                  </label>
                  <input
                    id="site-url"
                    type="url"
                    value={formData.siteUrl}
                    onChange={e => handleSettingChange("siteUrl", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Contact Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    value={formData.contactEmail}
                    onChange={e => handleSettingChange("contactEmail", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label
                    htmlFor="admissions-email"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Admissions Email
                  </label>
                  <input
                    id="admissions-email"
                    type="email"
                    value={formData.admissionsEmail}
                    onChange={e => handleSettingChange("admissionsEmail", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Phone
                </label>
                <div className="space-y-2">
                  {formData.contactPhones.map((phone, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={phone}
                        onChange={e => handleContactPhoneChange(index, e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={`Contact phone ${index + 1}`}
                        aria-label={`Contact phone ${index + 1}`}
                      />
                      {formData.contactPhones.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeContactPhone(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addContactPhone} className="mt-2">
                  + Add Contact Phone
                </Button>{" "}
              </div>
            </CardContent>
          </Card>
          {/* Contact Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Contact Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={formData.contactEmail}
                  onChange={e => handleSettingChange("contactEmail", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>{" "}
              <div>
                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-gray-700">
                    Contact Phone Numbers
                  </legend>
                  <div className="space-y-2">
                    {formData.contactPhones.map((phone, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="tel"
                          value={phone}
                          onChange={e => handleContactPhoneChange(index, e.target.value)}
                          className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          placeholder="Enter phone number"
                          aria-label={`Contact phone ${index + 1}`}
                        />
                        {formData.contactPhones.length > 1 && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeContactPhone(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={addContactPhone} className="mt-2">
                    + Add Phone Number
                  </Button>
                </fieldset>
              </div>
              <div>
                <fieldset>
                  <legend className="mb-2 block text-sm font-medium text-gray-700">
                    Contact Address
                  </legend>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={formData.contactAddress.line1}
                      onChange={e => handleContactAddressChange("line1", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Address Line 1"
                      aria-label="Address Line 1"
                    />
                    <input
                      type="text"
                      value={formData.contactAddress.line2}
                      onChange={e => handleContactAddressChange("line2", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="Address Line 2"
                      aria-label="Address Line 2"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={formData.contactAddress.city}
                        onChange={e => handleContactAddressChange("city", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="City"
                        aria-label="City"
                      />
                      <input
                        type="text"
                        value={formData.contactAddress.state}
                        onChange={e => handleContactAddressChange("state", e.target.value)}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder="State"
                        aria-label="State"
                      />
                    </div>
                    <input
                      type="text"
                      value={formData.contactAddress.zipCode}
                      onChange={e => handleContactAddressChange("zipCode", e.target.value)}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      placeholder="ZIP Code"
                      aria-label="ZIP Code"
                    />
                  </div>
                </fieldset>
              </div>
              <div>
                <label
                  htmlFor="support-hours"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Support Hours
                </label>
                <input
                  id="support-hours"
                  type="text"
                  value={formData.supportHours}
                  onChange={e => handleSettingChange("supportHours", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., 9 AM - 6 PM, Monday to Saturday"
                />
              </div>
            </CardContent>
          </Card>
          {/* Hero Section Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {" "}
              <div>
                <div className="mb-2 text-sm font-medium text-gray-700">
                  Hero Texts (Rotating Messages)
                </div>
                <div className="space-y-2" role="group" aria-labelledby="hero-texts-label">
                  <div id="hero-texts-label" className="sr-only">
                    Hero Texts Input Group
                  </div>
                  {formData.heroTexts.map((text, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={text}
                        onChange={e => handleHeroTextChange(index, e.target.value)}
                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        placeholder={`Hero text ${index + 1}`}
                        aria-label={`Hero text ${index + 1}`}
                      />
                      {formData.heroTexts.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeHeroText(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addHeroText} className="mt-2">
                  + Add Hero Text
                </Button>
              </div>
            </CardContent>
          </Card>
          {/* Social Media Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
            </CardHeader>{" "}
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div>
                  <label
                    htmlFor="facebook"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Facebook URL
                  </label>
                  <input
                    id="facebook"
                    type="url"
                    value={formData.socialMedia.facebook}
                    onChange={e => handleSocialMediaChange("facebook", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div>
                  <label htmlFor="twitter" className="mb-2 block text-sm font-medium text-gray-700">
                    Twitter URL
                  </label>
                  <input
                    id="twitter"
                    type="url"
                    value={formData.socialMedia.twitter}
                    onChange={e => handleSocialMediaChange("twitter", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
                <div>
                  <label
                    htmlFor="instagram"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Instagram URL
                  </label>
                  <input
                    id="instagram"
                    type="url"
                    value={formData.socialMedia.instagram}
                    onChange={e => handleSocialMediaChange("instagram", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://instagram.com/yourhandle"
                  />
                </div>
                <div>
                  <label
                    htmlFor="linkedin"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    LinkedIn URL
                  </label>{" "}
                  <input
                    id="linkedin"
                    type="url"
                    value={formData.socialMedia.linkedin}
                    onChange={e => handleSocialMediaChange("linkedin", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="https://linkedin.com/company/yourcompany"
                  />
                </div>
              </div>
            </CardContent>
          </Card>{" "}
          {/* Event Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Event Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="default-registration-url"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Default Registration URL
                </label>
                <input
                  id="default-registration-url"
                  type="url"
                  value={formData.defaultRegistrationUrl}
                  onChange={e => handleSettingChange("defaultRegistrationUrl", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="https://example.com/register"
                />
                <p className="mt-1 text-xs text-gray-500">
                  This URL is used as a reference. Each event now requires its own registration
                  link.
                </p>
              </div>
              <div>
                <label
                  htmlFor="max-events"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Events per Page
                </label>
                <input
                  id="max-events"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.maxEventsPerPage}
                  onChange={e =>
                    handleSettingChange("maxEventsPerPage", parseInt(e.target.value) || 10)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Auto-publish Events</h4>
                  <p className="text-sm text-gray-600">Automatically publish events when created</p>
                </div>
                <label
                  htmlFor="auto-publish"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="auto-publish"
                    type="checkbox"
                    checked={formData.autoPublishEvents}
                    onChange={e => handleSettingChange("autoPublishEvents", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Auto-publish Events</span>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Allow Guest Registration</h4>
                  <p className="text-sm text-gray-600">Allow users to register without account</p>
                </div>
                <label
                  htmlFor="guest-registration"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="guest-registration"
                    type="checkbox"
                    checked={formData.allowGuestRegistration}
                    onChange={e => handleSettingChange("allowGuestRegistration", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Allow Guest Registration</span>
                </label>
              </div>
            </CardContent>
          </Card>
          {/* Notification Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Email Notifications</h4>
                  <p className="text-sm text-gray-600">
                    Send email notifications for new registrations
                  </p>
                </div>
                <label
                  htmlFor="email-notifications"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={formData.emailNotifications}
                    onChange={e => handleSettingChange("emailNotifications", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Email Notifications</span>
                </label>
              </div>
            </CardContent>
          </Card>
          {/* System Settings */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>System</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600">
                    Temporarily disable the website for maintenance
                  </p>
                </div>
                <label
                  htmlFor="maintenance-mode"
                  className="relative inline-flex cursor-pointer items-center"
                >
                  <input
                    id="maintenance-mode"
                    type="checkbox"
                    checked={formData.maintenanceMode}
                    onChange={e => handleSettingChange("maintenanceMode", e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-red-600 peer-focus:ring-4 peer-focus:ring-red-300 peer-focus:outline-none after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  <span className="sr-only">Maintenance Mode</span>
                </label>
              </div>
            </CardContent>
          </Card>
          {/* Environment Information */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Environment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Database</h4>
                  <p className="text-sm text-gray-600">Supabase PostgreSQL</p>
                  <p className="text-xs text-green-600">✓ Connected</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Storage</h4>
                  <p className="text-sm text-gray-600">Supabase Storage</p>
                  <p className="text-xs text-green-600">✓ Available</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Deployment</h4>
                  <p className="text-sm text-gray-600">Vercel</p>
                  <p className="text-xs text-green-600">✓ Live</p>
                </div>
                <div>
                  <h4 className="mb-2 font-medium text-gray-900">Version</h4>
                  <p className="text-sm text-gray-600">Next.js 15.3.3</p>
                  <p className="text-xs text-blue-600">ⓘ Latest</p>
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Save Button */}
          <div className="flex justify-end gap-2">
            <Button onClick={handleSave} disabled={!hasChanges || isSaving} className="px-8">
              {isSaving ? (
                <>
                  <span className="mr-2 animate-spin">⏳</span>
                  Saving...
                </>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
          {/* Success Message */}
          {!hasChanges && settings && (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="rounded-lg bg-green-50 p-4">
                  <h4 className="mb-2 flex items-center gap-2 font-semibold text-green-900">
                    <span>✅</span>
                    Settings Saved Successfully
                  </h4>
                  <p className="text-sm text-green-700">
                    All settings have been saved and are now active across the website.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
