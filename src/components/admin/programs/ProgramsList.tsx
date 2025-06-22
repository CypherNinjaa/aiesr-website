// ============================================
// PROGRAMS LIST - Admin Programs List View
// Displays all programs with management actions
// ============================================

"use client";

import {
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  ExternalLink,
  Calendar,
  DollarSign,
} from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/Button";
import {
  useDeleteProgram,
  useToggleProgramStatus,
  useToggleProgramFeatured,
} from "@/hooks/usePrograms";
import { Program } from "@/types";

interface ProgramsListProps {
  programs: Program[];
  onEdit: (program: Program) => void;
}

export function ProgramsList({ programs, onEdit }: ProgramsListProps) {
  const deleteProgram = useDeleteProgram();
  const toggleStatus = useToggleProgramStatus();
  const toggleFeatured = useToggleProgramFeatured();
  const handleDelete = async (program: Program) => {
    // TODO: Replace with a custom modal for confirmation
    // For now, delete directly (no confirm)
    deleteProgram.mutate(program.id);
  };

  const handleToggleStatus = (program: Program) => {
    toggleStatus.mutate({
      id: program.id,
      isActive: !program.is_active,
    });
  };

  const handleToggleFeatured = (program: Program) => {
    toggleFeatured.mutate({
      id: program.id,
      isFeatured: !program.is_featured,
    });
  };

  const getLevelBadgeColor = (level: Program["level"]) => {
    switch (level) {
      case "undergraduate":
        return "bg-green-100 text-green-800";
      case "postgraduate":
        return "bg-blue-100 text-blue-800";
      case "doctoral":
        return "bg-purple-100 text-purple-800";
      case "certificate":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (programs.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="mb-4 text-gray-400">
          <Calendar className="mx-auto h-12 w-12" />
        </div>
        <p className="mb-4 text-gray-600">No programs found</p>
        <p className="text-sm text-gray-500">Create your first program to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="border-b bg-gray-50 px-6 py-4">
        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
          <div className="col-span-4">Program</div>
          <div className="col-span-2">Level</div>
          <div className="col-span-2">Duration</div>
          <div className="col-span-2">Status</div>
          <div className="col-span-2">Actions</div>
        </div>
      </div>

      {/* Programs List */}
      <div className="divide-y divide-gray-200">
        {programs.map(program => (
          <div key={program.id} className="px-6 py-4 transition-colors hover:bg-gray-50">
            <div className="grid grid-cols-12 items-center gap-4">
              {/* Program Info */}
              <div className="col-span-4">
                <div className="flex items-start space-x-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-medium text-gray-900">{program.title}</h3>
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {program.short_description}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      {program.fees && (
                        <span className="inline-flex items-center text-xs text-gray-500">
                          <DollarSign className="mr-1 h-3 w-3" />
                          {program.fees}
                        </span>
                      )}
                      {program.apply_link && (
                        <span className="inline-flex items-center text-xs text-blue-600">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Custom Apply Link
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Level */}
              <div className="col-span-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${getLevelBadgeColor(program.level)}`}
                >
                  {program.level}
                </span>
              </div>

              {/* Duration */}
              <div className="col-span-2">
                <span className="text-sm text-gray-900">{program.duration}</span>
              </div>

              {/* Status */}
              <div className="col-span-2">
                <div className="flex flex-col space-y-1">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                      program.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {program.is_active ? "Active" : "Inactive"}
                  </span>
                  {program.is_featured && (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-medium text-yellow-800">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-2">
                <div className="flex items-center space-x-2">
                  {/* Edit */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onEdit(program)}
                    className="flex items-center"
                  >
                    <Edit2 className="h-3 w-3" />
                  </Button>

                  {/* Toggle Status */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleStatus(program)}
                    disabled={toggleStatus.isPending}
                    className="flex items-center"
                  >
                    {program.is_active ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                  </Button>

                  {/* Toggle Featured */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleToggleFeatured(program)}
                    disabled={toggleFeatured.isPending}
                    className="flex items-center"
                  >
                    {program.is_featured ? (
                      <StarOff className="h-3 w-3" />
                    ) : (
                      <Star className="h-3 w-3" />
                    )}
                  </Button>

                  {/* Delete */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(program)}
                    disabled={deleteProgram.isPending}
                    className="flex items-center text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
