"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
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
  X
} from "lucide-react";

type SubcategoryState = {
  id?: string;
  category_id: string;
  name: string;
  slug: string;
  is_active: boolean;
  category?: { name: string };
};

type ParentCategory = {
  id: string;
  name: string;
};

export default function AdminSubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<SubcategoryState[]>([]);
  const [categories, setCategories] = useState<ParentCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<SubcategoryState | null>(null);
  const [formData, setFormData] = useState<SubcategoryState>({
    category_id: "",
    name: "",
    slug: "",
    is_active: true
  });

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const itemsPerPage = 8;

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadData() {
    try {
      setLoading(true);
      const supabase = createClient();
      const [catResult, subResult] = await Promise.all([
        supabase.from("categories").select("id, name").order("name"),
        supabase.from("subcategories").select("*, category:categories(name)").order("name")
      ]);

      if (catResult.error) throw catResult.error;
      if (subResult.error) throw subResult.error;

      setCategories(catResult.data || []);
      setSubcategories(subResult.data || []);
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to load subcategories" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Handle slug auto-generation from name
  useEffect(() => {
    if (!editingSubcategory && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, editingSubcategory]);

  const handleOpenCreate = () => {
    setEditingSubcategory(null);
    setFormData({
      category_id: categories[0]?.id || "",
      name: "",
      slug: "",
      is_active: true
    });
    setFormOpen(true);
  };

  const handleOpenEdit = (sub: SubcategoryState) => {
    setEditingSubcategory(sub);
    setFormData({ ...sub });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert("Please select a parent category first.");
      return;
    }

    try {
      setSaving(true);
      const supabase = createClient();
      if (editingSubcategory) {
        const { error } = await supabase
          .from("subcategories")
          .update({
            category_id: formData.category_id,
            name: formData.name,
            slug: formData.slug,
            is_active: formData.is_active
          })
          .eq("id", editingSubcategory.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("subcategories").insert([
          {
            id: formData.slug || Math.random().toString(36).substring(2, 9),
            category_id: formData.category_id,
            name: formData.name,
            slug: formData.slug,
            is_active: formData.is_active
          }
        ]);
        if (error) throw error;
      }

      setNotification({
        type: "success",
        message: editingSubcategory ? "Subcategory updated successfully" : "Subcategory created successfully"
      });
      setFormOpen(false);
      await loadData();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to save subcategory" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.from("subcategories").delete().eq("id", id);
      if (error) throw error;
      setNotification({ type: "success", message: "Subcategory deleted successfully" });
      setDeleteConfirmId(null);
      await loadData();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to delete subcategory" });
    } finally {
      setLoading(false);
    }
  };

  // Filter Subcategories
  const filteredSubcategories = subcategories.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.slug.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "all" || sub.category_id === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  // Pagination details
  const totalPages = Math.ceil(filteredSubcategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSubcategories = filteredSubcategories.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Inventory Control</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#21183d]">Subcategory Management</h1>
            <p className="text-sm text-[#6b6680]">Group products into narrower product subdivisions.</p>
          </div>
          <div>
            <Button onClick={handleOpenCreate} className="min-h-11 px-5">
              <Plus size={16} /> Create Subcategory
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
              placeholder="Search subcategory name or slug..."
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
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm text-[#21183d] min-w-48"
            >
              <option value="all">All Parent Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table/List View */}
        {loading ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl border border-white/40 p-20 bg-white/50">
            <Loader2 className="animate-spin text-[#6e63b8]" size={32} />
            <p className="mt-4 text-sm font-semibold text-[#4b328b]">Loading subcategories...</p>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-white/40 bg-white/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-[#4b328b]/5 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-[#4b328b]/80">
                    <th className="px-6 py-4">Subcategory Name</th>
                    <th className="px-6 py-4">Slug</th>
                    <th className="px-6 py-4">Parent Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4b328b]/5">
                  {paginatedSubcategories.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-xs text-[#6b6680]">
                        No subcategories found.
                      </td>
                    </tr>
                  ) : (
                    paginatedSubcategories.map((sub) => (
                      <tr key={sub.id} className="transition hover:bg-white/60">
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[#21183d]">
                          {sub.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-mono text-xs text-[#6e63b8]">
                          {sub.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-800">
                          {sub.category?.name || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {sub.is_active ? (
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
                              onClick={() => handleOpenEdit(sub)}
                              className="rounded-lg p-1.5 border border-[#4b328b]/10 bg-white text-slate-700 hover:border-[#6e63b8] hover:text-[#6e63b8] transition"
                              title="Edit"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(sub.id || null)}
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
                  {editingSubcategory ? "Edit Subcategory" : "Create Subcategory"}
                </h3>
                <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Parent Category
                  <select
                    required
                    value={formData.category_id}
                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                    className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d]"
                  >
                    <option value="" disabled>Select parent category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </label>

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

                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    id="is_active"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="h-5 w-5 accent-[#6e63b8] rounded"
                  />
                  <label htmlFor="is_active" className="text-xs font-semibold text-[#4b328b] cursor-pointer">
                    Active (visible in product forms and filters)
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-[#4b328b]/5 pt-4">
                  <Button variant="ghost" type="button" onClick={() => setFormOpen(false)} className="min-h-10 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="min-h-10 px-6 text-xs">
                    {saving ? <Loader2 className="animate-spin" size={15} /> : "Save Subcategory"}
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
                Are you sure you want to delete this subcategory? This action cannot be undone and may affect associated products.
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
                  Delete Subcategory
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
