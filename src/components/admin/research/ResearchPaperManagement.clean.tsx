"use client";

import { Plus, Search, Filter, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  useResearchPapers,
  useDeleteResearchPaper,
  useResearchStatistics,
} from "@/hooks/useResearch";
import { ResearchFilters, ResearchPaper } from "@/types";
import { ResearchFiltersPanel } from "./ResearchFiltersPanel";
import { ResearchForm } from "./ResearchForm";

export function ResearchPaperManagement() {
  const { showSuccess, showError, showInfo } = useNotifications();
  const [filters, setFilters] = useState<ResearchFilters>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [editingPaper, setEditingPaper] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    data: papers,
    isLoading,
    error,
    refetch,
  } = useResearchPapers({
    ...filters,
    search: searchTerm || undefined,
  });

  const { data: statistics } = useResearchStatistics();
  const deletePaper = useDeleteResearchPaper();

  const handleDeletePaper = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to delete this research paper?")) {
      try {
        await deletePaper.mutateAsync(id);
        showSuccess("Success", "Research paper deleted successfully");
      } catch (_error) {
        showError("Error", "Failed to delete research paper");
      }
    }
  };

  const handleRefresh = () => {
    refetch();
    showInfo("Refreshing Data", "Loading latest research papers...", 2000);
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Create Research Paper</h2>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            ← Back to Research Papers
          </Button>
        </div>
        <ResearchForm onSuccess={() => setShowCreateForm(false)} />
      </div>
    );
  }

  if (editingPaper) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit Research Paper</h2>
          <Button variant="outline" onClick={() => setEditingPaper(null)}>
            ← Back to Research Papers
          </Button>
        </div>
        <ResearchForm paperId={editingPaper} onSuccess={() => setEditingPaper(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Research Paper Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Paper
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card className="p-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Papers</h3>
            </div>
            <div className="text-2xl font-bold">{statistics.total_papers}</div>
          </Card>
          <Card className="p-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Published Papers</h3>
            </div>
            <div className="text-2xl font-bold">{statistics.published_papers}</div>
          </Card>
          <Card className="p-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Citations</h3>
            </div>
            <div className="text-2xl font-bold">{statistics.total_citations}</div>
          </Card>
          <Card className="p-4">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium">Total Authors</h3>
            </div>
            <div className="text-2xl font-bold">{statistics.total_authors}</div>
          </Card>
        </div>
      )}

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
            <input
              type="text"
              placeholder="Search research papers..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pr-4 pl-10 focus:border-transparent focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
          </Button>
          <Button variant="outline" onClick={handleRefresh}>
            Refresh
          </Button>
        </div>

        {showFilters && (
          <div className="mt-4 border-t pt-4">
            <ResearchFiltersPanel filters={filters} onFiltersChange={setFilters} />
          </div>
        )}
      </Card>

      {/* Research Papers List */}
      <Card className="p-6">
        <h3 className="mb-4 text-xl font-semibold">Research Papers</h3>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-lg border p-4">
                <div className="mb-2 h-4 w-3/4 rounded bg-gray-200" />
                <div className="mb-2 h-3 w-1/2 rounded bg-gray-200" />
                <div className="h-3 w-1/4 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-600">
            Error loading research papers: {error.message}
          </div>
        ) : !papers || papers.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No research papers found. Create your first research paper to get started.
          </div>
        ) : (
          <div className="space-y-4">
            {papers.map((paper: ResearchPaper) => (
              <div
                key={paper.id}
                className="rounded-lg border p-4 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-2 text-lg font-semibold">{paper.title}</h4>
                    {paper.abstract && (
                      <p className="mb-2 line-clamp-2 text-sm text-gray-600">{paper.abstract}</p>
                    )}
                    <div className="mb-2 flex flex-wrap gap-2">
                      <Badge variant={paper.status === "published" ? "default" : "secondary"}>
                        {paper.status}
                      </Badge>
                      {paper.journal && <Badge variant="secondary">{paper.journal.name}</Badge>}
                      {paper.publication_date && (
                        <Badge variant="secondary">
                          {new Date(paper.publication_date).getFullYear()}
                        </Badge>
                      )}
                    </div>
                    {paper.authors && paper.authors.length > 0 && (
                      <p className="text-sm text-gray-500">
                        Authors: {paper.authors.map(a => a.author.name).join(", ")}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditingPaper(paper.id)}
                      title="Edit paper"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeletePaper(paper.id)}
                      title="Delete paper"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
