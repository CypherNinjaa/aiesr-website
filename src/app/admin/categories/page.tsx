"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useCategories";
import { Category } from "@/types";

export default function CategoriesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // Use React Query hooks for data fetching and mutations
  const { data: categories = [], isLoading: loading, error } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const isSubmitting =
    createCategory.isPending || updateCategory.isPending || deleteCategory.isPending;

  // Handle create category
  const handleCreateCategory = async (categoryData: Record<string, unknown>) => {
    try {
      // Generate slug from name
      const slug = (categoryData.name as string).toLowerCase().replace(/\s+/g, "-");
      const finalData = { ...categoryData, slug } as Omit<
        Category,
        "id" | "created_at" | "updated_at"
      >;

      const result = await createCategory.mutateAsync(finalData);
      if (result) {
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating category:", error);
      // eslint-disable-next-line no-alert
      alert("Error creating category. Please try again.");
    }
  };

  // Handle update category
  const handleUpdateCategory = async (id: string, categoryData: Record<string, unknown>) => {
    try {
      // Generate slug from name if name is being updated
      if (categoryData.name) {
        categoryData.slug = (categoryData.name as string).toLowerCase().replace(/\s+/g, "-");
      }

      const result = await updateCategory.mutateAsync({
        id,
        updates: categoryData as Partial<Category>,
      });
      if (result) {
        setEditingCategory(null);
      }
    } catch (error) {
      console.error("Error updating category:", error);
      // eslint-disable-next-line no-alert
      alert("Error updating category. Please try again.");
    }
  };

  // Handle delete category
  const handleDeleteCategory = async (category: Category) => {
    if (
      // eslint-disable-next-line no-alert
      !confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)
    ) {
      return;
    }

    try {
      await deleteCategory.mutateAsync(category.id);
    } catch (error) {
      console.error("Error deleting category:", error);
      // eslint-disable-next-line no-alert
      alert("Error deleting category. Please try again.");
    }
  };

  if (error) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Error loading categories: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories Management</h1>
            <p className="mt-2 text-gray-600">
              Manage event categories dynamically. Categories are used to organize events.
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
          >
            Create Category
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {categories.map(category => (
            <Card
              key={category.id}
              className="border-0 shadow-lg transition-shadow hover:shadow-xl"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{category.icon_emoji}</span>
                    <div>
                      <CardTitle className="text-xl">{category.name}</CardTitle>
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${category.color_class}`}
                      >
                        {category.slug}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-block h-2 w-2 rounded-full ${
                        category.is_active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                    <span className="text-sm text-gray-500">
                      {category.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-sm text-gray-600">
                  {category.description || "No description provided"}
                </p>
                <div className="mb-4 text-sm text-gray-500">
                  <p>Sort Order: {category.sort_order}</p>
                  <p>Created: {category.created_at.toLocaleDateString()}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingCategory(category)}
                    className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(category)}
                    className="flex-1 rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-none"
                    disabled={isSubmitting}
                  >
                    Delete
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {categories.length === 0 && !loading && (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">📂</div>
            <h3 className="mb-2 text-xl font-medium text-gray-900">No categories found</h3>
            <p className="mb-6 text-gray-600">
              Get started by creating your first category or execute the database migration to see
              default categories.
            </p>
            <div className="mb-6">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Create Your First Category
              </button>
            </div>
            <div className="mx-auto max-w-2xl rounded-lg bg-blue-50 p-4 text-left">
              <h4 className="mb-2 font-semibold text-blue-900">📋 Database Migration</h4>
              <p className="mb-3 text-sm text-blue-700">
                To load default categories, execute the following SQL script in your Supabase SQL
                Editor:
              </p>
              <code className="block rounded bg-blue-100 p-2 text-xs text-blue-800">
                dynamic-categories-schema.sql
              </code>
            </div>
          </div>
        )}

        {/* Info Section */}
        <Card className="mt-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle>Category Management System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">✅ Available Features</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Create new categories with custom styling</li>
                  <li>• Edit existing categories</li>
                  <li>• Delete categories (with confirmation)</li>
                  <li>• Dynamic category database schema</li>
                  <li>• CategoryService with full CRUD operations</li>
                  <li>• Updated EventForm with category selector</li>
                  <li>• Enhanced database types and migrations</li>
                </ul>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-900">🎨 Category Customization</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Custom names and descriptions</li>
                  <li>• Icon emojis for visual identification</li>
                  <li>• 8 color themes to choose from</li>
                  <li>• Sort order for display priority</li>
                  <li>• Active/inactive status control</li>
                  <li>• Automatic slug generation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Category Modal */}
        {isCreateModalOpen && (
          <CategoryModal
            title="Create New Category"
            category={null}
            onSave={handleCreateCategory}
            onCancel={() => setIsCreateModalOpen(false)}
            isSubmitting={isSubmitting}
          />
        )}

        {/* Edit Category Modal */}
        {editingCategory && (
          <CategoryModal
            title="Edit Category"
            category={editingCategory}
            onSave={data => handleUpdateCategory(editingCategory.id, data)}
            onCancel={() => setEditingCategory(null)}
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  );
}

// Category Modal Component
interface CategoryModalProps {
  title: string;
  category: Category | null;
  onSave: (data: Record<string, unknown>) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

function CategoryModal({ title, category, onSave, onCancel, isSubmitting }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
    icon_emoji: category?.icon_emoji || "📁",
    color_class: category?.color_class || "bg-gray-50 text-gray-700",
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active !== undefined ? category.is_active : true,
  });

  const colorOptions = [
    { value: "bg-blue-50 text-blue-700", label: "Blue", preview: "bg-blue-100" },
    { value: "bg-green-50 text-green-700", label: "Green", preview: "bg-green-100" },
    { value: "bg-yellow-50 text-yellow-700", label: "Yellow", preview: "bg-yellow-100" },
    { value: "bg-red-50 text-red-700", label: "Red", preview: "bg-red-100" },
    { value: "bg-purple-50 text-purple-700", label: "Purple", preview: "bg-purple-100" },
    { value: "bg-indigo-50 text-indigo-700", label: "Indigo", preview: "bg-indigo-100" },
    { value: "bg-pink-50 text-pink-700", label: "Pink", preview: "bg-pink-100" },
    { value: "bg-gray-50 text-gray-700", label: "Gray", preview: "bg-gray-100" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      // eslint-disable-next-line no-alert
      alert("Category name is required");
      return;
    }
    onSave(formData);
  };

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              rows={3}
            />
          </div>

          {/* Icon Emoji */}
          <div>
            <label htmlFor="icon_emoji" className="block text-sm font-medium text-gray-700">
              Icon Emoji
            </label>
            <input
              type="text"
              id="icon_emoji"
              value={formData.icon_emoji}
              onChange={e => setFormData({ ...formData, icon_emoji: e.target.value })}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              placeholder="📁"
            />
          </div>

          {/* Color Class */}
          <div>
            <label htmlFor="color_class" className="block text-sm font-medium text-gray-700">
              Color Theme
            </label>
            <div className="mt-1 grid grid-cols-4 gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, color_class: color.value })}
                  className={`flex items-center justify-center rounded-md border-2 p-2 text-xs font-medium transition-colors ${
                    formData.color_class === color.value
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-300 hover:border-gray-400"
                  } ${color.preview}`}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700">
              Sort Order
            </label>
            <input
              type="number"
              id="sort_order"
              value={formData.sort_order}
              onChange={e =>
                setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              min="0"
            />
          </div>

          {/* Is Active */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={e => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="ml-2 text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          {/* Preview */}
          <div className="rounded-md bg-gray-50 p-3">
            <p className="mb-2 text-sm font-medium text-gray-700">Preview:</p>
            <span
              className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${formData.color_class}`}
            >
              {formData.icon_emoji} {formData.name || "Category Name"}
            </span>
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
