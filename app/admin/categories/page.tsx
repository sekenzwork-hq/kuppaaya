"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileDown
} from "lucide-react";

type CategoryState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  is_active: boolean;
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryState | null>(null);
  const [formData, setFormData] = useState<CategoryState>({
    name: "",
    slug: "",
    description: "",
    image_url: "",
    is_active: true
  });

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const hasSupabase = typeof window !== "undefined" && !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const itemsPerPage = 8;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadCategories() {
    try {
      setLoading(true);
      if (!hasSupabase) {
        const res = await fetch("/api/admin/db?table=categories");
        const json = await res.json();
        setCategories(json.data || []);
      } else {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("categories")
          .select("*")
          .order("created_at", { ascending: false });
        if (error) throw error;
        setCategories(data || []);
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to load categories" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // Handle slug auto-generation from name
  useEffect(() => {
    if (!editingCategory && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, editingCategory]);

  const handleOpenCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      image_url: "",
      is_active: true
    });
    setFormOpen(true);
  };

  const handleOpenEdit = (category: CategoryState) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (!hasSupabase) {
        const method = editingCategory ? "PUT" : "POST";
        const bodyPayload = editingCategory
          ? { ...formData, id: editingCategory.id }
          : { ...formData, id: Math.random().toString(36).substring(2, 9) };

        const res = await fetch(`/api/admin/db?table=categories`, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyPayload)
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
      } else {
        const supabase = createClient();
        if (editingCategory) {
          const { error } = await supabase
            .from("categories")
            .update({
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              image_url: formData.image_url,
              is_active: formData.is_active
            })
            .eq("id", editingCategory.id);
          if (error) throw error;
        } else {
          const { error } = await supabase.from("categories").insert([
            {
              id: formData.slug || Math.random().toString(36).substring(2, 9),
              name: formData.name,
              slug: formData.slug,
              description: formData.description,
              image_url: formData.image_url,
              is_active: formData.is_active
            }
          ]);
          if (error) throw error;
        }
      }

      setNotification({
        type: "success",
        message: editingCategory ? "Category updated successfully" : "Category created successfully"
      });
      setFormOpen(false);
      await loadCategories();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to save category" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      if (!hasSupabase) {
        const res = await fetch(`/api/admin/db?table=categories&id=${id}`, {
          method: "DELETE"
        });
        const json = await res.json();
        if (json.error) throw new Error(json.error);
      } else {
        const supabase = createClient();
        const { error } = await supabase.from("categories").delete().eq("id", id);
        if (error) throw error;
      }
      setNotification({ type: "success", message: "Category deleted successfully" });
      setDeleteConfirmId(null);
      await loadCategories();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to delete category" });
    } finally {
      setLoading(false);
    }
  };

  // Filter Categories
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && category.is_active) ||
      (statusFilter === "inactive" && !category.is_active);

    return matchesSearch && matchesStatus;
  });

  // Pagination details
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Inventory Control</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#21183d]">Category Management</h1>
            <p className="text-sm text-[#6b6680]">Organize products into distinct collections.</p>
          </div>
          <div>
            <Button onClick={handleOpenCreate} className="min-h-11 px-5">
              <Plus size={16} /> Create Category
            </Button>
          </div>
        </div>

        {/* Notifications */}
        {notification && (
          <div
            className={`flex items-center gap-3 rounded-xl border p-4 text-sm animate-in fade-in slide-in-from-top-2 ${
              notification.type === "success"
                ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                : "bg-red-50 border-red-200 text-red-800"
            }`}
          >
            {notification.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Search & Filters */}
        <div className="glass rounded-xl border border-white/40 p-4 bg-white/50 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
            <input
              type="text"
              placeholder="Search category name or slug..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="focus-ring h-11 w-full rounded-xl border border-[#4b328b]/10 bg-white pl-10 pr-4 text-sm text-[#21183d]"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm text-[#21183d] min-w-36"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Table/List View */}
        {loading ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl border border-white/40 p-20 bg-white/50">
            <Loader2 className="animate-spin text-[#6e63b8]" size={32} />
            <p className="mt-4 text-sm font-semibold text-[#4b328b]">Loading categories...</p>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-white/40 bg-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-[#4b328b]/5 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-[#4b328b]/80">
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Category Name</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Description</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4b328b]/5">
                  {paginatedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-xs text-[#6b6680]">
                        No categories found.
                      </td>
                    </tr>
                  ) : (
                    paginatedCategories.map((category) => (
                      <tr key={category.id} className="transition hover:bg-white/60">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-10 w-10 overflow-hidden rounded-lg border border-[#4b328b]/10 bg-slate-100">
                            {category.image_url ? (
                              <img
                                src={category.image_url}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#4b328b]/5 text-slate-400">
                                <FileDown size={14} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[#21183d]">
                          {category.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-[#6e63b8]">
                          {category.slug}
                        </td>
                        <td className="px-6 py-4 max-w-xs truncate text-[#6b6680]">
                          {category.description || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {category.is_active ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                              Inactive
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleOpenEdit(category)}
                              className="rounded-lg p-1.5 border border-[#4b328b]/10 bg-white text-slate-700 hover:border-[#6e63b8] hover:text-[#6e63b8] transition"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(category.id || null)}
                              className="rounded-lg p-1.5 border border-red-100 bg-white text-red-600 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination footer */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#4b328b]/5 px-6 py-4 bg-slate-50/50">
                <span className="text-xs text-[#6b6680]">
                  Showing Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="min-h-9 px-3 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="secondary"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="min-h-9 px-3 text-xs"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Form Dialog */}
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-lg rounded-2xl border border-white/50 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-[#4b328b]/5 pb-3 mb-5">
                <h3 className="text-lg font-bold text-[#21183d]">
                  {editingCategory ? "Edit Category" : "Create Category"}
                </h3>
                <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Name
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Slug
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Description
                  <textarea
                    rows={2}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="focus-ring rounded-xl border border-[#4b328b]/10 p-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b] mb-1">
                    Category Image
                  </span>
                  <ImageUploader
                    bucket="category-images"
                    images={formData.image_url ? [formData.image_url] : []}
                    onChange={(urls) => setFormData({ ...formData, image_url: urls[0] || "" })}
                    multiple={false}
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-5 w-5 accent-[#6e63b8] rounded"
                  />
                  <label htmlFor="is_active" className="text-xs font-semibold text-[#4b328b] cursor-pointer">
                    Active (visible in navigation and filters)
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-[#4b328b]/5 pt-4">
                  <Button variant="ghost" type="button" onClick={() => setFormOpen(false)} className="min-h-10 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="min-h-10 px-6 text-xs">
                    {saving ? <Loader2 className="animate-spin" size={15} /> : "Save Category"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-sm rounded-2xl border border-white/50 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <h3 className="text-base font-bold text-[#21183d]">Confirm Deletion</h3>
              <p className="mt-2 text-xs text-[#6b6680]">
                Are you sure you want to delete this category? This action cannot be undone and may affect associated products.
              </p>
              <div className="flex justify-end gap-2 mt-5">
                <Button
                  variant="ghost"
                  onClick={() => setDeleteConfirmId(null)}
                  className="min-h-9 px-4 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="min-h-9 px-4 bg-red-600 text-white hover:bg-red-700 text-xs"
                >
                  Delete Category
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
