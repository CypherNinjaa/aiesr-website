"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuthors, useJournals, useCategories } from "@/hooks/useResearch";
import { ResearchFilters } from "@/types";

interface ResearchFiltersPanelProps {
  filters: ResearchFilters;
  onFiltersChange: (filters: ResearchFilters) => void;
}

export function ResearchFiltersPanel({ filters, onFiltersChange }: ResearchFiltersPanelProps) {
  const { data: authors = [] } = useAuthors();
  const { data: journals = [] } = useJournals();
  const { data: categories = [] } = useCategories();

  const updateFilter = (
    key: keyof ResearchFilters,
    value: string | number | boolean | undefined
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  const removeFilter = (key: keyof ResearchFilters) => {
    const newFilters = { ...filters };
    delete newFilters[key];
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.keys(filters).filter(
    key => filters[key as keyof ResearchFilters] !== undefined
  ).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button variant="outline" size="sm" onClick={clearAllFilters}>
            Clear All ({activeFiltersCount})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Category Filter */}
        <div className="space-y-2">
          <Label htmlFor="category-select">Category</Label>
          <select
            id="category-select"
            value={filters.category_id || ""}
            onChange={e => updateFilter("category_id", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Filter by category"
          >
            <option value="">All categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Journal Filter */}
        <div className="space-y-2">
          <Label htmlFor="journal-select">Journal</Label>
          <select
            id="journal-select"
            value={filters.journal_id || ""}
            onChange={e => updateFilter("journal_id", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Filter by journal"
          >
            <option value="">All journals</option>
            {journals.map(journal => (
              <option key={journal.id} value={journal.id}>
                {journal.name}
              </option>
            ))}
          </select>
        </div>

        {/* Author Filter */}
        <div className="space-y-2">
          <Label htmlFor="author-select">Author</Label>
          <select
            id="author-select"
            value={filters.author_id || ""}
            onChange={e => updateFilter("author_id", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Filter by author"
          >
            <option value="">All authors</option>
            {authors.map(author => (
              <option key={author.id} value={author.id}>
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* Year Range */}
        <div className="space-y-2">
          <Label htmlFor="year-from">Year</Label>
          <div className="flex gap-2">
            <Input
              id="year-from"
              type="number"
              placeholder="From"
              value={filters.year_from || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter("year_from", parseInt(e.target.value) || undefined)
              }
              min={1900}
              max={new Date().getFullYear()}
            />
            <Input
              id="year-to"
              type="number"
              placeholder="To"
              value={filters.year_to || ""}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                updateFilter("year_to", parseInt(e.target.value) || undefined)
              }
              min={1900}
              max={new Date().getFullYear()}
            />
          </div>
        </div>

        {/* Publication Status */}
        <div className="space-y-2">
          <Label htmlFor="status-select">Status</Label>
          <select
            id="status-select"
            value={filters.is_published?.toString() || ""}
            onChange={e =>
              updateFilter(
                "is_published",
                e.target.value === "" ? undefined : e.target.value === "true"
              )
            }
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Filter by publication status"
          >
            <option value="">All statuses</option>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>

        {/* Sort By */}
        <div className="space-y-2">
          <Label htmlFor="sort-by-select">Sort By</Label>
          <select
            id="sort-by-select"
            value={filters.sort_by || "created_at"}
            onChange={e => updateFilter("sort_by", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Sort by field"
          >
            <option value="created_at">Date Created</option>
            <option value="publication_year">Publication Year</option>
            <option value="title">Title</option>
            <option value="citation_count">Citation Count</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="space-y-2">
          <Label htmlFor="sort-order-select">Order</Label>
          <select
            id="sort-order-select"
            value={filters.sort_order || "desc"}
            onChange={e => updateFilter("sort_order", e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Sort order"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>

        {/* Limit */}
        <div className="space-y-2">
          <Label htmlFor="limit-select">Results per page</Label>
          <select
            id="limit-select"
            value={filters.limit?.toString() || "20"}
            onChange={e => updateFilter("limit", parseInt(e.target.value))}
            className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            aria-label="Results per page"
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">Active Filters</div>
          <div className="flex flex-wrap gap-2">
            {filters.category_id && (
              <Badge variant="secondary" className="px-3 py-1">
                Category: {categories.find(c => c.id === filters.category_id)?.name}
                <button
                  type="button"
                  onClick={() => removeFilter("category_id")}
                  className="text-muted-foreground hover:text-foreground ml-2"
                  aria-label="Remove category filter"
                  title="Remove category filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.journal_id && (
              <Badge variant="secondary" className="px-3 py-1">
                Journal: {journals.find(j => j.id === filters.journal_id)?.name}
                <button
                  type="button"
                  onClick={() => removeFilter("journal_id")}
                  className="text-muted-foreground hover:text-foreground ml-2"
                  title="Remove journal filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.author_id && (
              <Badge variant="secondary" className="px-3 py-1">
                Author: {authors.find(a => a.id === filters.author_id)?.name}
                <button
                  type="button"
                  onClick={() => removeFilter("author_id")}
                  className="text-muted-foreground hover:text-foreground ml-2"
                  title="Remove author filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {(filters.year_from || filters.year_to) && (
              <Badge variant="secondary" className="px-3 py-1">
                Year: {filters.year_from || "Any"} - {filters.year_to || "Any"}
                <button
                  type="button"
                  onClick={() => {
                    removeFilter("year_from");
                    removeFilter("year_to");
                  }}
                  className="text-muted-foreground hover:text-foreground ml-2"
                  title="Remove year filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {filters.is_published !== undefined && (
              <Badge variant="secondary" className="px-3 py-1">
                Status: {filters.is_published ? "Published" : "Draft"}
                <button
                  type="button"
                  onClick={() => removeFilter("is_published")}
                  className="text-muted-foreground hover:text-foreground ml-2"
                  title="Remove status filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
