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
import {
  useJournals,
  useCreateJournal,
  useUpdateJournal,
  useDeleteJournal,
} from "@/hooks/useResearch";
import type { Journal, CreateJournalData } from "@/types";

interface JournalFormData {
  name: string;
  publisher?: string;
  impact_factor?: number;
  issn?: string;
  website_url?: string;
  description?: string;
  status: "active" | "inactive";
}

export function JournalManagement() {
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingJournal, setEditingJournal] = useState<Journal | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<JournalFormData>({
    name: "",
    publisher: "",
    impact_factor: undefined,
    issn: "",
    website_url: "",
    description: "",
    status: "active",
  });

  const { data: journals = [], isLoading } = useJournals();
  const createJournal = useCreateJournal();
  const updateJournal = useUpdateJournal();
  const deleteJournal = useDeleteJournal();

  const filteredJournals = journals.filter(
    (journal: Journal) =>
      journal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.publisher?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      journal.issn?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      publisher: "",
      impact_factor: undefined,
      issn: "",
      website_url: "",
      description: "",
      status: "active",
    });
    setEditingJournal(null);
    setShowForm(false);
  };

  const handleEdit = (journal: Journal) => {
    setFormData({
      name: journal.name,
      publisher: journal.publisher || "",
      impact_factor: journal.impact_factor || undefined,
      issn: journal.issn || "",
      website_url: journal.website_url || "",
      description: journal.description || "",
      status: journal.status,
    });
    setEditingJournal(journal);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData: CreateJournalData = {
        name: formData.name,
        publisher: formData.publisher || undefined,
        impact_factor: formData.impact_factor || undefined,
        issn: formData.issn || undefined,
        website_url: formData.website_url || undefined,
        description: formData.description || undefined,
        status: formData.status,
      };

      if (editingJournal) {
        await updateJournal.mutateAsync({ id: editingJournal.id, data: submitData });
        showSuccess("Success", "Journal updated successfully");
      } else {
        await createJournal.mutateAsync(submitData);
        showSuccess("Success", "Journal created successfully");
      }
      resetForm();
    } catch (_error) {
      showError("Error", editingJournal ? "Failed to update journal" : "Failed to create journal");
    }
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to delete this journal?")) {
      try {
        await deleteJournal.mutateAsync(id);
        showSuccess("Success", "Journal deleted successfully");
      } catch (_error) {
        showError("Error", "Failed to delete journal");
      }
    }
  };

  const updateFormField = (field: keyof JournalFormData, value: string | number | undefined) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingJournal ? "Edit Journal" : "Create Journal"}
          </h2>
          <Button variant="outline" onClick={resetForm}>
            ← Back to Journals
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editingJournal ? "Edit Journal" : "Create New Journal"}</CardTitle>
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
                  <Label htmlFor="publisher">Publisher</Label>
                  <Input
                    id="publisher"
                    value={formData.publisher}
                    onChange={e => updateFormField("publisher", e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="impact_factor">Impact Factor</Label>
                  <Input
                    id="impact_factor"
                    type="number"
                    step="0.001"
                    value={formData.impact_factor || ""}
                    onChange={e =>
                      updateFormField("impact_factor", parseFloat(e.target.value) || undefined)
                    }
                  />
                </div>

                <div>
                  <Label htmlFor="issn">ISSN</Label>
                  <Input
                    id="issn"
                    placeholder="1234-5678"
                    value={formData.issn}
                    onChange={e => updateFormField("issn", e.target.value)}
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
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    title="Status"
                    value={formData.status}
                    onChange={e =>
                      updateFormField("status", e.target.value as "active" | "inactive")
                    }
                    className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => updateFormField("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createJournal.isPending || updateJournal.isPending}>
                  {editingJournal ? "Update Journal" : "Create Journal"}
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
        <h2 className="text-2xl font-bold">Journal Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Journal
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search journals..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">Loading journals...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJournals.map((journal: Journal) => (
            <Card key={journal.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold">{journal.name}</h3>
                    {journal.publisher && (
                      <p className="text-sm text-gray-600">{journal.publisher}</p>
                    )}
                    {journal.impact_factor && (
                      <p className="text-sm text-gray-500">
                        Impact Factor: {journal.impact_factor}
                      </p>
                    )}
                    {journal.issn && <p className="text-xs text-gray-400">ISSN: {journal.issn}</p>}
                    <div className="mt-2">
                      <Badge variant={journal.status === "active" ? "default" : "secondary"}>
                        {journal.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(journal)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(journal.id)}>
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
