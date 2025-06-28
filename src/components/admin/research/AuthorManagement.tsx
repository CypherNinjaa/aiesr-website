"use client";

import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { useNotifications } from "@/contexts/NotificationContext";
import { useAuthors, useCreateAuthor, useUpdateAuthor, useDeleteAuthor } from "@/hooks/useResearch";
import type { Author, CreateAuthorData } from "@/types";

interface AuthorFormData {
  name: string;
  email?: string;
  affiliation?: string;
  orcid_id?: string;
  bio?: string;
  website_url?: string;
  photo_url?: string;
  status: "active" | "inactive";
}

export function AuthorManagement() {
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<AuthorFormData>({
    name: "",
    email: "",
    affiliation: "",
    orcid_id: "",
    bio: "",
    website_url: "",
    photo_url: "",
    status: "active",
  });

  const { data: authors = [], isLoading } = useAuthors();
  const createAuthor = useCreateAuthor();
  const updateAuthor = useUpdateAuthor();
  const deleteAuthor = useDeleteAuthor();

  const filteredAuthors = authors.filter(
    (author: Author) =>
      author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      author.affiliation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      affiliation: "",
      orcid_id: "",
      bio: "",
      website_url: "",
      photo_url: "",
      status: "active",
    });
    setEditingAuthor(null);
    setShowForm(false);
  };

  const handleEdit = (author: Author) => {
    setFormData({
      name: author.name,
      email: author.email || "",
      affiliation: author.affiliation || "",
      orcid_id: author.orcid_id || "",
      bio: author.bio || "",
      website_url: author.website_url || "",
      photo_url: author.photo_url || "",
      status: author.status,
    });
    setEditingAuthor(author);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData: CreateAuthorData = {
        name: formData.name,
        email: formData.email || undefined,
        affiliation: formData.affiliation || undefined,
        orcid_id: formData.orcid_id || undefined,
        bio: formData.bio || undefined,
        website_url: formData.website_url || undefined,
        photo_url: formData.photo_url || undefined,
        status: formData.status,
      };

      if (editingAuthor) {
        await updateAuthor.mutateAsync({ id: editingAuthor.id, data: submitData });
        showSuccess("Success", "Author updated successfully");
      } else {
        await createAuthor.mutateAsync(submitData);
        showSuccess("Success", "Author created successfully");
      }
      resetForm();
    } catch (_error) {
      showError("Error", editingAuthor ? "Failed to update author" : "Failed to create author");
    }
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to delete this author?")) {
      try {
        await deleteAuthor.mutateAsync(id);
        showSuccess("Success", "Author deleted successfully");
      } catch (_error) {
        showError("Error", "Failed to delete author");
      }
    }
  };

  const updateFormField = (field: keyof AuthorFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{editingAuthor ? "Edit Author" : "Create Author"}</h2>
          <Button variant="outline" onClick={resetForm}>
            ← Back to Authors
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editingAuthor ? "Edit Author" : "Create New Author"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={e => updateFormField("name", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => updateFormField("email", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="affiliation">Affiliation</Label>
                  <Input
                    id="affiliation"
                    value={formData.affiliation}
                    onChange={e => updateFormField("affiliation", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="orcid_id">ORCID ID</Label>
                  <Input
                    id="orcid_id"
                    placeholder="0000-0000-0000-0000"
                    value={formData.orcid_id}
                    onChange={e => updateFormField("orcid_id", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="website_url">Website URL</Label>
                  <Input
                    id="website_url"
                    type="url"
                    value={formData.website_url}
                    onChange={e => updateFormField("website_url", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="photo_url">Photo URL</Label>
                  <Input
                    id="photo_url"
                    type="url"
                    value={formData.photo_url}
                    onChange={e => updateFormField("photo_url", e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={e => updateFormField("bio", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  title="Status"
                  value={formData.status}
                  onChange={e => updateFormField("status", e.target.value as "active" | "inactive")}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createAuthor.isPending || updateAuthor.isPending}>
                  {editingAuthor ? "Update Author" : "Create Author"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Author Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Author
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search authors..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">Loading authors...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAuthors.map((author: Author) => (
            <Card key={author.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{author.name}</h3>
                    {author.email && <p className="text-sm text-gray-600">{author.email}</p>}
                    {author.affiliation && (
                      <p className="text-sm text-gray-500">{author.affiliation}</p>
                    )}
                    {author.orcid_id && (
                      <p className="text-xs text-gray-400">ORCID: {author.orcid_id}</p>
                    )}
                    <div className="mt-2">
                      <Badge variant={author.status === "active" ? "default" : "secondary"}>
                        {author.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(author)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(author.id)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
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
