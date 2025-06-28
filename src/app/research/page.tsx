"use client";

import { Search, Filter, ExternalLink, Calendar, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  useResearchPapers,
  useResearchStatistics,
  useCategories,
  useJournals,
} from "@/hooks/useResearch";
import { ResearchFilters } from "@/types";

export default function ResearchPage() {
  const [filters, setFilters] = useState<ResearchFilters>({ is_published: true });
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const {
    data: papers,
    isLoading,
    error,
  } = useResearchPapers({
    ...filters,
    search: searchTerm || undefined,
    is_published: true, // Only show published papers on public page
  });

  const { data: statistics } = useResearchStatistics();
  const { data: categories = [] } = useCategories();
  const { data: journals = [] } = useJournals();

  const updateFilter = <K extends keyof ResearchFilters>(key: K, value: ResearchFilters[K]) => {
    setFilters({
      ...filters,
      [key]: value === "" ? undefined : value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative border-b border-gray-200 bg-gradient-to-br from-slate-50 via-white to-gray-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl">
              Research Publications
            </h1>
            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-gray-600">
              Discover our cutting-edge research contributions, innovative findings, and academic
              excellence across various disciplines
            </p>

            {statistics && (
              <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
                <div className="group">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-blue-600">
                      {statistics.total_papers}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Total Papers</div>
                    <div className="mt-1 text-xs text-gray-500">Published Research</div>
                  </div>
                </div>
                <div className="group">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-green-300 hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-green-600">
                      {statistics.total_authors}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Active Authors</div>
                    <div className="mt-1 text-xs text-gray-500">Research Contributors</div>
                  </div>
                </div>
                <div className="group">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-purple-300 hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-purple-600">
                      {statistics.total_journals}
                    </div>
                    <div className="text-sm font-medium text-gray-700">Partner Journals</div>
                    <div className="mt-1 text-xs text-gray-500">Publication Venues</div>
                  </div>
                </div>
                <div className="group">
                  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-orange-300 hover:shadow-md">
                    <div className="mb-2 text-3xl font-bold text-orange-600">
                      {statistics.papers_by_year?.find(
                        item => item.year === new Date().getFullYear()
                      )?.count || 0}
                    </div>
                    <div className="text-sm font-medium text-gray-700">This Year</div>
                    <div className="mt-1 text-xs text-gray-500">Recent Publications</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
              <input
                type="text"
                placeholder="Search research papers, authors, topics, or keywords..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full rounded-xl border border-gray-300 py-4 pr-4 pl-12 text-lg placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Filters Row */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-3">
                <label htmlFor="category-select" className="sr-only">
                  Category
                </label>
                <select
                  id="category-select"
                  aria-label="Category"
                  value={filters.category_id || ""}
                  onChange={e => updateFilter("category_id", e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Categories</option>
                  {categories.map((category: import("@/types").ResearchCategory) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <label htmlFor="journal-select" className="sr-only">
                  Journal
                </label>
                <select
                  id="journal-select"
                  aria-label="Journal"
                  value={filters.journal_id || ""}
                  onChange={e => updateFilter("journal_id", e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">All Journals</option>
                  {journals.map((journal: import("@/types").Journal) => (
                    <option key={journal.id} value={journal.id}>
                      {journal.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  placeholder="Year"
                  value={filters.year || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    updateFilter("year", parseInt(e.target.value) || undefined)
                  }
                  className="w-24 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium transition-all duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="mr-3 text-sm text-gray-600">View:</span>
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="px-4"
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="px-4"
                >
                  List
                </Button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label
                    htmlFor="year-from"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Year Range
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="year-from"
                      type="number"
                      placeholder="From"
                      value={filters.year_from || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateFilter("year_from", parseInt(e.target.value) || undefined)
                      }
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                    <input
                      id="year-to"
                      type="number"
                      placeholder="To"
                      value={filters.year_to || ""}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        updateFilter("year_to", parseInt(e.target.value) || undefined)
                      }
                      className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="sort-by" className="mb-2 block text-sm font-medium text-gray-700">
                    Sort By
                  </label>
                  <select
                    id="sort-by"
                    aria-label="Sort By"
                    value={filters.sort_by || "publication_date"}
                    onChange={e => updateFilter("sort_by", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="publication_date">Publication Year</option>
                    <option value="title">Title</option>
                    <option value="citation_count">Citation Count</option>
                    <option value="created_at">Date Added</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sort-order"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Order
                  </label>
                  <select
                    id="sort-order"
                    aria-label="Order"
                    value={filters.sort_order || "desc"}
                    onChange={e => updateFilter("sort_order", e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Research Papers */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-6">
                <div className="animate-pulse">
                  <div className="mb-2 h-4 w-3/4 rounded bg-gray-200"></div>
                  <div className="mb-4 h-4 w-1/2 rounded bg-gray-200"></div>
                  <div className="mb-4 h-20 rounded bg-gray-200"></div>
                  <div className="h-4 w-1/4 rounded bg-gray-200"></div>
                </div>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-lg text-red-600">Failed to load research papers</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : !papers?.length ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">📚</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">No research papers found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {papers.map(paper => (
              <Card
                key={paper.id}
                className="group border-0 bg-white shadow-md transition-all duration-300 hover:shadow-xl"
              >
                <div className="flex h-full flex-col p-6">
                  {/* Header with Status Badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="line-clamp-2 text-lg font-bold text-gray-900 transition-colors group-hover:text-blue-600">
                        {paper.title}
                      </h3>
                    </div>
                    <span className="ml-3 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Published
                    </span>
                  </div>

                  {/* Publication Info */}
                  <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {paper.publication_date
                        ? new Date(paper.publication_date).getFullYear()
                        : "N/A"}
                    </div>
                    {paper.journal && (
                      <div className="flex items-center">
                        <span className="mr-2 h-2 w-2 rounded-full bg-blue-400"></span>
                        <span className="font-medium text-blue-600">{paper.journal.name}</span>
                      </div>
                    )}
                  </div>

                  {/* Abstract */}
                  {paper.abstract && (
                    <p className="mb-4 line-clamp-3 flex-grow text-sm text-gray-600">
                      {paper.abstract}
                    </p>
                  )}

                  {/* Authors */}
                  <div className="mb-4 flex items-start gap-2">
                    <User className="mt-0.5 h-4 w-4 flex-shrink-0 text-gray-400" />
                    <div className="text-sm text-gray-600">
                      {(paper.authors?.slice(0, 2) ?? [])
                        .map(author => author.author?.name)
                        .filter(Boolean)
                        .join(", ")}
                      {paper.authors &&
                        paper.authors.length > 2 &&
                        ` +${paper.authors.length - 2} more`}
                    </div>
                  </div>

                  {/* Categories */}
                  {paper.categories && paper.categories.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {paper.categories.slice(0, 2).map(category => (
                        <span
                          key={category.id}
                          className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700"
                        >
                          {category.name}
                        </span>
                      ))}
                      {paper.categories.length > 2 && (
                        <span className="inline-flex items-center rounded-full bg-gray-50 px-2.5 py-0.5 text-xs font-medium text-gray-700">
                          +{paper.categories.length - 2} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="text-sm text-gray-500">
                      {paper.citation_count ? (
                        <span className="font-medium">{paper.citation_count} citations</span>
                      ) : (
                        <span>No citations yet</span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {paper.doi && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                          onClick={() => window.open(`https://doi.org/${paper.doi}`, "_blank")}
                        >
                          DOI
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                      {paper.external_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-green-200 text-green-600 hover:bg-green-50"
                          onClick={() => window.open(paper.external_url, "_blank")}
                        >
                          View Paper
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            {papers.map(paper => (
              <Card
                key={paper.id}
                className="border-0 bg-white shadow-md transition-all duration-300 hover:shadow-lg"
              >
                <div className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                    <div className="flex-1">
                      <div className="mb-3 flex items-start justify-between">
                        <h3 className="pr-4 text-xl font-bold text-gray-900 transition-colors hover:text-blue-600">
                          {paper.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Published
                          </span>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-4 w-4" />
                            {paper.publication_date
                              ? new Date(paper.publication_date).getFullYear()
                              : "N/A"}
                          </div>
                        </div>
                      </div>

                      {paper.abstract && (
                        <p className="mb-4 line-clamp-2 text-gray-600">{paper.abstract}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {paper.authors && (
                            <>
                              {paper.authors
                                .slice(0, 3)
                                .map(author => author.author?.name)
                                .join(", ")}
                              {paper.authors.length > 3 && ` +${paper.authors.length - 3} more`}
                            </>
                          )}
                        </div>

                        {paper.journal && (
                          <div>
                            <strong>Journal:</strong> {paper.journal.name}
                          </div>
                        )}

                        {paper.categories && paper.categories.length > 0 && (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {paper.categories.map(c => c.name).join(", ")}
                          </span>
                        )}

                        <div>
                          {paper.citation_count
                            ? `${paper.citation_count} citations`
                            : "No citations yet"}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {paper.doi && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://doi.org/${paper.doi}`, "_blank")}
                        >
                          DOI
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                      {paper.external_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(paper.external_url, "_blank")}
                        >
                          View Paper
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Load More */}
        {papers && papers.length >= 20 && (
          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => updateFilter("limit", (filters.limit || 20) + 20)}
            >
              Load More Papers
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
