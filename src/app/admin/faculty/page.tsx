// ============================================
// FACULTY MANAGEMENT PAGE - Admin Faculty List
// Complete CRUD management for faculty
// ============================================

"use client";

import { AlertCircle, Edit3, Eye, Plus, Star, StarOff, Trash2, User, Users } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";
import { FacultyForm } from "@/components/admin/faculty/FacultyForm";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  useAllFacultyAdmin,
  useDeleteFaculty,
  useToggleFacultyStatus,
  useToggleFacultyFeatured,
} from "@/hooks/useFaculty";
import { getPublicPhotoUrl } from "@/services/faculty";
import { Faculty } from "@/types";

export default function FacultyPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [viewingFaculty, setViewingFaculty] = useState<Faculty | null>(null);
  const { data: faculty = [], isLoading, error } = useAllFacultyAdmin();

  const deleteFaculty = useDeleteFaculty();
  const toggleStatus = useToggleFacultyStatus();
  const toggleFeatured = useToggleFacultyFeatured();

  const handleEdit = (member: Faculty) => {
    setEditingFaculty(member);
    setShowForm(true);
  };

  const handleView = (member: Faculty) => {
    setViewingFaculty(member);
  };
  const handleDelete = async (member: Faculty) => {
    // Use a custom confirm dialog instead of window.confirm
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm(
      `Are you sure you want to delete ${member.name}? This action cannot be undone.`
    );
    if (confirmed) {
      await deleteFaculty.mutateAsync(member.id);
    }
  };

  const handleToggleStatus = async (member: Faculty) => {
    await toggleStatus.mutateAsync({ id: member.id, isActive: !member.is_active });
  };

  const handleToggleFeatured = async (member: Faculty) => {
    await toggleFeatured.mutateAsync({ id: member.id, isFeatured: !member.is_featured });
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingFaculty(null);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingFaculty(null);
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingFaculty ? "Edit Faculty Member" : "Add New Faculty Member"}
          </h1>
        </div>
        <FacultyForm
          faculty={editingFaculty}
          onSuccess={handleFormSuccess}
          onCancel={handleFormCancel}
        />
      </div>
    );
  }

  if (viewingFaculty) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Profile</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleEdit(viewingFaculty)}>
              <Edit3 className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button variant="outline" onClick={() => setViewingFaculty(null)}>
              Back to List
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              {/* Profile Photo */}
              <div className="flex flex-col items-center space-y-4">
                <div className="from-burgundy to-gold relative h-48 w-48 overflow-hidden rounded-full bg-gradient-to-br">
                  {viewingFaculty.profile_image_url ? (
                    <Image
                      src={getPublicPhotoUrl(viewingFaculty.profile_image_url)}
                      alt={`${viewingFaculty.name} - Faculty Photo`}
                      fill
                      className="object-cover"
                      sizes="192px"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-6xl font-bold text-white">
                        {viewingFaculty.name
                          .split(" ")
                          .map(n => n[0])
                          .join("")}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">{viewingFaculty.name}</h2>
                  <p className="text-lg text-gray-600">{viewingFaculty.designation}</p>
                  <div className="mt-2 flex items-center justify-center space-x-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        viewingFaculty.is_active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {viewingFaculty.is_active ? "Active" : "Inactive"}
                    </span>
                    {viewingFaculty.is_featured && (
                      <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-6 lg:col-span-2">
                {/* Contact Info */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Contact Information</h3>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{viewingFaculty.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{viewingFaculty.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Office Location</p>
                      <p className="font-medium">
                        {viewingFaculty.office_location || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Office Hours</p>
                      <p className="font-medium">{viewingFaculty.office_hours || "Not provided"}</p>
                    </div>
                  </div>
                </div>

                {/* Bio */}
                {viewingFaculty.bio && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Biography</h3>
                    <p className="leading-relaxed text-gray-700">{viewingFaculty.bio}</p>
                  </div>
                )}

                {/* Experience & Education */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Experience</h3>
                    <p className="text-gold text-2xl font-bold">
                      {viewingFaculty.experience}+ years
                    </p>
                  </div>

                  {viewingFaculty.education.length > 0 && (
                    <div>
                      <h3 className="mb-3 text-lg font-semibold text-gray-900">Education</h3>
                      <ul className="space-y-1">
                        {viewingFaculty.education.map((edu, idx) => (
                          <li key={idx} className="text-gray-700">
                            • {edu}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Specialization */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Specialization Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {viewingFaculty.specialization.map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-burgundy/10 text-burgundy rounded-full px-3 py-1 text-sm"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Research Areas */}
                {viewingFaculty.research_areas.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">Research Areas</h3>
                    <div className="flex flex-wrap gap-2">
                      {viewingFaculty.research_areas.map((area, idx) => (
                        <span
                          key={idx}
                          className="bg-gold/10 rounded-full px-3 py-1 text-sm text-gray-700"
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Publications */}
                {viewingFaculty.publications.length > 0 && (
                  <div>
                    <h3 className="mb-3 text-lg font-semibold text-gray-900">
                      Publications ({viewingFaculty.publications.length})
                    </h3>
                    <div className="space-y-3">
                      {viewingFaculty.publications.slice(0, 5).map((pub, idx) => (
                        <div key={idx} className="border-burgundy border-l-4 pl-4">
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
                              View Publication →
                            </a>
                          )}
                        </div>
                      ))}
                      {viewingFaculty.publications.length > 5 && (
                        <p className="text-sm text-gray-500">
                          And {viewingFaculty.publications.length - 5} more publications...
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* External Links */}
                <div>
                  <h3 className="mb-3 text-lg font-semibold text-gray-900">Professional Links</h3>
                  <div className="flex flex-wrap gap-3">
                    {viewingFaculty.linkedin_url && (
                      <a
                        href={viewingFaculty.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        LinkedIn →
                      </a>
                    )}
                    {viewingFaculty.google_scholar_url && (
                      <a
                        href={viewingFaculty.google_scholar_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Google Scholar →
                      </a>
                    )}
                    {viewingFaculty.research_gate_url && (
                      <a
                        href={viewingFaculty.research_gate_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        ResearchGate →
                      </a>
                    )}
                    {viewingFaculty.personal_website && (
                      <a
                        href={viewingFaculty.personal_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Personal Website →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Faculty Management</h1>
          <p className="text-gray-600">Manage faculty members and their profiles</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Faculty Member
        </Button>
      </div>{" "}
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Faculty</CardTitle>
            <Users className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{faculty.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Faculty</CardTitle>
            <User className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {faculty.filter(f => f.is_active).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Faculty</CardTitle>
            <Star className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {faculty.filter(f => f.is_featured).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Publications</CardTitle>
            <AlertCircle className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {faculty.length > 0
                ? Math.round(
                    faculty.reduce((sum, f) => sum + f.publications.length, 0) / faculty.length
                  )
                : 0}
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <AlertCircle className="mr-2 h-5 w-5 text-red-600" />
              <p className="text-red-700">Failed to load faculty members. Please try again.</p>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center py-8">
              <div className="border-burgundy inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <span className="ml-2 text-gray-600">Loading faculty members...</span>
            </div>
          </CardContent>
        </Card>
      )}
      {/* Faculty List */}
      {!isLoading && !error && faculty.length === 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="py-8 text-center">
              <Users className="mx-auto mb-4 h-12 w-12 text-gray-400" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No faculty members found</h3>
              <p className="mb-4 text-gray-600">Get started by adding your first faculty member.</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Faculty Member
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {!isLoading && !error && faculty.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {faculty.map(member => (
            <Card key={member.id} className="transition-shadow hover:shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-4">
                  {/* Photo and Basic Info */}
                  <div className="flex items-center space-x-3">
                    <div className="from-burgundy to-gold relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-full bg-gradient-to-br sm:h-16 sm:w-16">
                      {member.profile_image_url ? (
                        <Image
                          src={getPublicPhotoUrl(member.profile_image_url)}
                          alt={`${member.name} - Faculty Photo`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 48px, 64px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <span className="text-sm font-bold text-white sm:text-lg">
                            {member.name
                              .split(" ")
                              .map(n => n[0])
                              .join("")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-medium text-gray-900">{member.name}</h3>
                      <p className="truncate text-sm text-gray-600">{member.designation}</p>
                      <p className="text-xs text-gray-500">{member.experience}+ years experience</p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap justify-center gap-1 rounded-md bg-gray-50 p-2">
                    <button
                      onClick={() => handleToggleFeatured(member)}
                      className={`flex items-center justify-center rounded px-2 py-1 transition-colors hover:bg-white ${
                        member.is_featured ? "text-yellow-600" : "text-gray-400"
                      }`}
                      title={`${member.is_featured ? "Remove from" : "Add to"} featured`}
                    >
                      {member.is_featured ? (
                        <Star className="h-4 w-4" />
                      ) : (
                        <StarOff className="h-4 w-4" />
                      )}
                    </button>

                    <button
                      onClick={() => handleView(member)}
                      className="flex items-center justify-center rounded px-2 py-1 text-gray-600 transition-colors hover:bg-white"
                      title="View profile"
                    >
                      <Eye className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleEdit(member)}
                      className="flex items-center justify-center rounded px-2 py-1 text-gray-600 transition-colors hover:bg-white"
                      title="Edit faculty"
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(member)}
                      className="flex items-center justify-center rounded px-2 py-1 text-red-600 transition-colors hover:bg-white"
                      title="Delete faculty"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Specializations */}
                  <div className="flex flex-wrap gap-1">
                    {member.specialization.slice(0, 2).map((spec, idx) => (
                      <span
                        key={idx}
                        className="bg-burgundy/10 text-burgundy rounded-full px-2 py-1 text-xs"
                      >
                        {spec}
                      </span>
                    ))}
                    {member.specialization.length > 2 && (
                      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
                        +{member.specialization.length - 2}
                      </span>
                    )}
                  </div>

                  {/* Status and Publications */}
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col space-y-1">
                      <span
                        className={`w-fit rounded-full px-2 py-1 text-xs font-medium ${
                          member.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {member.is_active ? "Active" : "Inactive"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {member.publications.length} publications
                      </span>
                    </div>

                    <button
                      onClick={() => handleToggleStatus(member)}
                      className={`rounded px-2 py-1 text-xs transition-colors ${
                        member.is_active
                          ? "text-red-600 hover:bg-red-50"
                          : "text-green-600 hover:bg-green-50"
                      }`}
                    >
                      {member.is_active ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
