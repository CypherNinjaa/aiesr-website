"use client";

import { Loader2, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useNotifications } from "@/contexts/NotificationContext";
import {
  useCreateResearchPaper,
  useUpdateResearchPaper,
  useResearchPaper,
  useAuthors,
  useJournals,
  useCategories,
} from "@/hooks/useResearch";
import type { CreateResearchPaperData, ResearchCategory, PaperAuthor } from "@/types";

interface ResearchFormProps {
  paperId?: string;
  onSuccess?: () => void;
}

export function ResearchForm({ paperId, onSuccess }: ResearchFormProps) {
  const { showSuccess, showError } = useNotifications();
  const [formData, setFormData] = useState<Partial<CreateResearchPaperData>>({
    title: "",
    abstract: "",
    doi: "",
    publication_date: "",
    status: "draft",
    external_url: "",
    citation_count: 0,
    journal_id: "",
    category_ids: [],
  });

  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: paper, isLoading: loadingPaper } = useResearchPaper(paperId || "");
  const { data: authors = [] } = useAuthors();
  const { data: journals = [] } = useJournals();
  const { data: categories = [] } = useCategories();

  const createPaper = useCreateResearchPaper();
  const updatePaper = useUpdateResearchPaper();

  // Load paper data for editing
  useEffect(() => {
    if (paper) {
      setFormData({
        title: paper.title,
        abstract: paper.abstract || "",
        doi: paper.doi || "",
        publication_date: paper.publication_date || "",
        status: paper.status,
        external_url: paper.external_url || "",
        citation_count: paper.citation_count || 0,
        journal_id: paper.journal_id || "",
        category_ids: paper.categories?.map((c: ResearchCategory) => c.id) || [],
      });
      setSelectedAuthors(paper.authors?.map((a: PaperAuthor) => a.author.id) || []);
      setSelectedCategories(paper.categories?.map((c: ResearchCategory) => c.id) || []);
    }
  }, [paper]);

  // Update form data when selections change
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      category_ids: selectedCategories,
    }));
  }, [selectedAuthors, selectedCategories]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    }

    if (selectedAuthors.length === 0) {
      newErrors.authors = "At least one author is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const submitData: CreateResearchPaperData = {
        title: formData.title!,
        abstract: formData.abstract,
        doi: formData.doi,
        publication_date: formData.publication_date,
        status: formData.status as "draft" | "in-review" | "published" | "rejected",
        external_url: formData.external_url,
        citation_count: formData.citation_count || 0,
        journal_id: formData.journal_id,
        category_ids: selectedCategories,
        authors: selectedAuthors.map((id, i) => ({ author_id: id, author_order: i + 1 })),
      };

      if (paperId) {
        await updatePaper.mutateAsync({ id: paperId, data: submitData });
        showSuccess("Success", "Research paper updated successfully");
      } else {
        await createPaper.mutateAsync(submitData);
        showSuccess("Success", "Research paper created successfully");
      }
      onSuccess?.();
    } catch (_error) {
      showError(
        "Error",
        paperId ? "Failed to update research paper" : "Failed to create research paper"
      );
    }
  };

  // updateFormField type fix
  const updateFormField = (
    field: keyof CreateResearchPaperData,
    value: string | number | string[] | undefined
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const toggleAuthor = (authorId: string) => {
    setSelectedAuthors(prev =>
      prev.includes(authorId) ? prev.filter(id => id !== authorId) : [...prev, authorId]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    );
  };

  const removeAuthor = (authorId: string) => {
    setSelectedAuthors(prev => prev.filter(id => id !== authorId));
  };

  const removeCategory = (categoryId: string) => {
    setSelectedCategories(prev => prev.filter(id => id !== categoryId));
  };

  if (loadingPaper) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const isSubmitting = createPaper.isPending || updatePaper.isPending;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>{paperId ? "Edit Research Paper" : "Create Research Paper"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={e => updateFormField("title", e.target.value)}
              className={errors.title ? "border-red-500" : ""}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? "title-error" : undefined}
              aria-required="true"
              autoComplete="off"
            />
            {errors.title && (
              <p
                id="title-error"
                className="mt-1 text-sm text-red-600"
                role="alert"
                aria-live="polite"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="abstract">Abstract</Label>
            <Textarea
              id="abstract"
              value={formData.abstract || ""}
              onChange={e => updateFormField("abstract", e.target.value)}
              rows={4}
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="doi">DOI</Label>
              <Input
                id="doi"
                placeholder="10.1000/182"
                value={formData.doi || ""}
                onChange={e => updateFormField("doi", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="publication_date">Publication Date</Label>
              <Input
                id="publication_date"
                type="date"
                value={formData.publication_date || ""}
                onChange={e => updateFormField("publication_date", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="external_url">External URL</Label>
              <Input
                id="external_url"
                type="url"
                placeholder="https://..."
                value={formData.external_url || ""}
                onChange={e => updateFormField("external_url", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="citation_count">Citation Count</Label>
              <Input
                id="citation_count"
                type="number"
                min={0}
                value={formData.citation_count || 0}
                onChange={e => {
                  const val = parseInt(e.target.value, 10);
                  updateFormField("citation_count", Number.isNaN(val) ? 0 : val);
                }}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                title="Status"
                value={formData.status || "draft"}
                onChange={e => updateFormField("status", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="in-review">In Review</option>
                <option value="published">Published</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <Label htmlFor="journal_id">Journal</Label>
              <select
                id="journal_id"
                title="Journal"
                value={formData.journal_id || ""}
                onChange={e => updateFormField("journal_id", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="">Select journal</option>
                {journals.map(journal => (
                  <option key={journal.id} value={journal.id}>
                    {journal.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Authors */}
      <Card>
        <CardHeader>
          <CardTitle>Authors</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="authors-section">Select Authors *</Label>
            <div
              id="authors-section"
              className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2"
            >
              {authors.map(author => (
                <div key={author.id} className="flex items-center space-x-2">
                  {/* Remove aria-checked from checkboxes */}
                  <input
                    type="checkbox"
                    id={`author-${author.id}`}
                    checked={selectedAuthors.includes(author.id)}
                    onChange={() => toggleAuthor(author.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    id={`author-label-${author.id}`}
                    htmlFor={`author-${author.id}`}
                    className="text-sm"
                  >
                    {author.name}
                    {author.email && <span className="ml-1 text-gray-500">({author.email})</span>}
                  </label>
                </div>
              ))}
            </div>
            {errors.authors && (
              <p className="mt-1 text-sm text-red-600" role="alert" aria-live="polite">
                {errors.authors}
              </p>
            )}
          </div>

          {/* Selected Authors */}
          {selectedAuthors.length > 0 && (
            <div>
              <Label htmlFor="selected-authors-list">Selected Authors</Label>
              <div id="selected-authors-list" className="flex flex-wrap gap-2">
                {selectedAuthors.map(authorId => {
                  const author = authors.find(a => a.id === authorId);
                  if (!author) return null;
                  return (
                    <Badge key={authorId} variant="secondary" className="px-3 py-1">
                      {author.name}
                      <button
                        type="button"
                        onClick={() => removeAuthor(authorId)}
                        className="text-muted-foreground hover:text-foreground ml-2"
                        title={`Remove ${author.name}`}
                        aria-label={`Remove ${author.name}`}
                        tabIndex={0}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="categories-section">Select Categories</Label>
            <div
              id="categories-section"
              className="max-h-40 space-y-2 overflow-y-auto rounded-md border p-2"
            >
              {categories.map((category: import("@/types").ResearchCategory) => (
                <div key={category.id} className="flex items-center space-x-2">
                  {/* Remove aria-checked from checkboxes */}
                  <input
                    type="checkbox"
                    id={`category-${category.id}`}
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    id={`category-label-${category.id}`}
                    htmlFor={`category-${category.id}`}
                    className="text-sm"
                  >
                    {category.name}
                    {category.description && (
                      <span className="ml-1 text-gray-500">- {category.description}</span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Categories */}
          {selectedCategories.length > 0 && (
            <div>
              <Label htmlFor="selected-categories-list">Selected Categories</Label>
              <div id="selected-categories-list" className="flex flex-wrap gap-2">
                {selectedCategories.map(categoryId => {
                  const category = categories.find(
                    (c: import("@/types").ResearchCategory) => c.id === categoryId
                  );
                  if (!category) return null;
                  return (
                    <Badge key={categoryId} variant="secondary" className="px-3 py-1">
                      {category.name}
                      <button
                        type="button"
                        onClick={() => removeCategory(categoryId)}
                        className="text-muted-foreground hover:text-foreground ml-2"
                        title={`Remove ${category.name}`}
                        aria-label={`Remove ${category.name}`}
                        tabIndex={0}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {paperId ? "Updating..." : "Creating..."}
            </>
          ) : paperId ? (
            "Update Paper"
          ) : (
            "Create Paper"
          )}
        </Button>
      </div>
    </form>
  );
}
