// ============================================
// PROGRAMS MANAGEMENT - Main Admin Interface for Programs
// Complete CRUD interface for managing programs
// ============================================

"use client";

import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { RefreshButton } from "@/components/ui/RefreshButton";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAllProgramsAdmin } from "@/hooks/usePrograms";
import { Program } from "@/types";
import { ProgramForm } from "./ProgramForm";
import { ProgramsList } from "./ProgramsList";

type ViewMode = "list" | "create" | "edit";

export function ProgramsManagement() {
  const { showInfo } = useNotifications();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);

  const { data: programs, isLoading, error, refetch, isFetching } = useAllProgramsAdmin();

  const handleRefresh = () => {
    refetch();
    showInfo("Refreshing Data", "Loading latest programs...", 2000);
  };

  const handleCreateNew = () => {
    setEditingProgram(null);
    setViewMode("create");
  };

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setViewMode("edit");
  };

  const handleBackToList = () => {
    setEditingProgram(null);
    setViewMode("list");
  };

  const handleFormSuccess = () => {
    setEditingProgram(null);
    setViewMode("list");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="text-burgundy h-8 w-8 animate-spin" />
        <span className="ml-3 text-gray-600">Loading programs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-12 text-center">
        <p className="mb-4 text-red-600">Error loading programs</p>
        <RefreshButton
          onRefresh={handleRefresh}
          isLoading={isLoading}
          isFetching={isFetching}
          variant="primary"
          label="Try Again"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {viewMode !== "list" && (
            <Button variant="outline" onClick={handleBackToList}>
              ← Back to List
            </Button>
          )}
          <div className="text-sm text-gray-500">
            {programs ? `${programs.length} total programs` : ""}
            {isFetching && <span className="ml-2 text-blue-600">Refreshing...</span>}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {viewMode === "list" && (
            <>
              <RefreshButton
                onRefresh={handleRefresh}
                isLoading={isLoading}
                isFetching={isFetching}
                variant="outline"
                size="md"
                label="Refresh"
              />
              <Button onClick={handleCreateNew} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Program
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="rounded-lg border bg-white">
        {viewMode === "list" && <ProgramsList programs={programs || []} onEdit={handleEdit} />}

        {(viewMode === "create" || viewMode === "edit") && (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {viewMode === "create" ? "Create New Program" : "Edit Program"}
              </h2>
              <p className="mt-1 text-gray-600">
                {viewMode === "create"
                  ? "Add a new academic program to your offerings."
                  : "Modify the program details and settings."}
              </p>
            </div>

            <ProgramForm
              program={editingProgram}
              onSuccess={handleFormSuccess}
              onCancel={handleBackToList}
            />
          </div>
        )}
      </div>

      {/* Quick Stats */}
      {viewMode === "list" && programs && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border bg-white p-4">
            <div className="text-burgundy text-2xl font-bold">{programs.length}</div>
            <div className="text-sm text-gray-600">Total Programs</div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-bold text-green-600">
              {programs.filter(p => p.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Active Programs</div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-bold text-blue-600">
              {programs.filter(p => p.is_featured).length}
            </div>
            <div className="text-sm text-gray-600">Featured Programs</div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <div className="text-2xl font-bold text-gray-600">
              {programs.filter(p => !p.is_active).length}
            </div>
            <div className="text-sm text-gray-600">Inactive Programs</div>
          </div>
        </div>
      )}
    </div>
  );
}
