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
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useResearch";
import type { ResearchCategory, CreateResearchCategoryData } from "@/types";
import styles from "./category-management.module.css";

interface CategoryFormData {
  name: string;
  description?: string;
  color: string;
  status: "active" | "inactive";
}

const colorOptions = [
  { value: "#3B82F6", label: "Blue" },
  { value: "#10B981", label: "Green" },
  { value: "#F59E0B", label: "Amber" },
  { value: "#EF4444", label: "Red" },
  { value: "#8B5CF6", label: "Purple" },
  { value: "#06B6D4", label: "Cyan" },
  { value: "#84CC16", label: "Lime" },
  { value: "#F97316", label: "Orange" },
  { value: "#EC4899", label: "Pink" },
  { value: "#6B7280", label: "Gray" },
];

export function CategoryManagement() {
  const { showSuccess, showError } = useNotifications();
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<ResearchCategory | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    description: "",
    color: "#3B82F6",
    status: "active",
  });

  const { data: categories = [], isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const filteredCategories = categories.filter(
    (category: ResearchCategory) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
      status: "active",
    });
    setEditingCategory(null);
    setShowForm(false);
  };

  const handleEdit = (category: ResearchCategory) => {
    setFormData({
      name: category.name,
      description: category.description || "",
      color: category.color,
      status: category.status,
    });
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData: CreateResearchCategoryData = {
        name: formData.name,
        description: formData.description || undefined,
        color: formData.color,
        status: formData.status,
      };

      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory.id, data: submitData });
        showSuccess("Success", "Category updated successfully");
      } else {
        await createCategory.mutateAsync(submitData);
        showSuccess("Success", "Category created successfully");
      }
      resetForm();
    } catch (_error) {
      showError(
        "Error",
        editingCategory ? "Failed to update category" : "Failed to create category"
      );
    }
  };

  const handleDelete = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (confirm("Are you sure you want to delete this category?")) {
      try {
        await deleteCategory.mutateAsync(id);
        showSuccess("Success", "Category deleted successfully");
      } catch (_error) {
        showError("Error", "Failed to delete category");
      }
    }
  };

  const updateFormField = (field: keyof CategoryFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {editingCategory ? "Edit Category" : "Create Category"}
          </h2>
          <Button variant="outline" onClick={resetForm}>
            ← Back to Categories
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{editingCategory ? "Edit Category" : "Create New Category"}</CardTitle>
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

              <div>
                <Label htmlFor="color">Color</Label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateFormField("color", option.value)}
                      className={[
                        styles.categoryColorButton,
                        formData.color === option.value ? styles.selected : styles.unselected,
                      ].join(" ")}
                      data-color={option.value}
                      title={option.label}
                    />
                  ))}
                </div>
                <Input
                  id="color"
                  type="color"
                  value={formData.color}
                  onChange={e => updateFormField("color", e.target.value)}
                  className="mt-2 h-10 w-20"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createCategory.isPending || updateCategory.isPending}
                >
                  {editingCategory ? "Update Category" : "Create Category"}
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
        <h2 className="text-2xl font-bold">Category Management</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <div className="py-8 text-center">Loading categories...</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((category: ResearchCategory) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className={styles.categoryColorDot} data-color={category.color} />
                      <h3 className="font-semibold">{category.name}</h3>
                    </div>
                    {category.description && (
                      <p className="mt-1 text-sm text-gray-600">{category.description}</p>
                    )}
                    <div className="mt-2">
                      <Badge variant={category.status === "active" ? "default" : "secondary"}>
                        {category.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(category.id)}>
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
