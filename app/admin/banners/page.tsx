"use client";

import React, { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon
} from "lucide-react";

type BannerState = {
  id?: string;
  title: string;
  subtitle: string;
  image_url: string;
  link_url: string;
  is_active: boolean;
  sort_order: number;
};

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<BannerState[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Form states
  const [formOpen, setFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerState | null>(null);
  const [formData, setFormData] = useState<BannerState>({
    title: "",
    subtitle: "",
    image_url: "",
    link_url: "",
    is_active: true,
    sort_order: 0
  });

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadBanners() {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("banners")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      setBanners(data || []);
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to load banners" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBanners();
  }, []);

  const handleOpenCreate = () => {
    setEditingBanner(null);
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      link_url: "",
      is_active: true,
      sort_order: banners.length > 0 ? Math.max(...banners.map((b) => b.sort_order || 0)) + 1 : 0
    });
    setFormOpen(true);
  };

  const handleOpenEdit = (banner: BannerState) => {
    setEditingBanner(banner);
    setFormData({ ...banner });
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image_url) {
      alert("Please upload a banner image first.");
      return;
    }

    try {
      setSaving(true);
      const supabase = createClient();
      if (editingBanner) {
        const { error } = await supabase
          .from("banners")
          .update({
            title: formData.title,
            subtitle: formData.subtitle,
            image_url: formData.image_url,
            link_url: formData.link_url,
            is_active: formData.is_active,
            sort_order: formData.sort_order
          })
          .eq("id", editingBanner.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("banners").insert([
          {
            title: formData.title,
            subtitle: formData.subtitle,
            image_url: formData.image_url,
            link_url: formData.link_url,
            is_active: formData.is_active,
            sort_order: formData.sort_order
          }
        ]);
        if (error) throw error;
      }

      setNotification({
        type: "success",
        message: editingBanner ? "Banner updated successfully" : "Banner created successfully"
      });
      setFormOpen(false);
      await loadBanners();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to save banner" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const supabase = createClient();
      const { error } = await supabase.from("banners").delete().eq("id", id);
      if (error) throw error;
      setNotification({ type: "success", message: "Banner deleted successfully" });
      setDeleteConfirmId(null);
      await loadBanners();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to delete banner" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (banner: BannerState) => {
    try {
      const updatedBanner = { ...banner, is_active: !banner.is_active };
      
      // Optimistic update
      setBanners((prev) =>
        prev.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
      );

      const supabase = createClient();
      await supabase
        .from("banners")
        .update({ is_active: updatedBanner.is_active })
        .eq("id", banner.id);
      setNotification({ type: "success", message: "Banner status updated" });
    } catch (err: any) {
      setNotification({ type: "error", message: "Failed to update banner status" });
      loadBanners(); // Revert
    }
  };

  const handleReorder = async (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;

    try {
      const reorderedList = [...banners];
      // Swap elements
      const temp = reorderedList[index];
      reorderedList[index] = reorderedList[targetIndex];
      reorderedList[targetIndex] = temp;

      // Update sort_order indexes
      const updatedList = reorderedList.map((item, idx) => ({
        ...item,
        sort_order: idx
      }));

      // Optimistic state
      setBanners(updatedList);

      // Save to server
      const supabase = createClient();
      for (const item of updatedList) {
        await supabase
          .from("banners")
          .update({ sort_order: item.sort_order })
          .eq("id", item.id);
      }
      setNotification({ type: "success", message: "Banner order saved" });
    } catch (err) {
      setNotification({ type: "error", message: "Failed to reorder banners" });
      loadBanners();
    }
  };

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Marketing & Promotions</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#21183d]">Banner Management</h1>
            <p className="text-sm text-[#6b6680]">Configure slider graphics and promotional messaging on the home page.</p>
          </div>
          <div>
            <Button onClick={handleOpenCreate} className="min-h-11 px-5">
              <Plus size={16} /> Add Banner
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

        {/* Table/List View */}
        {loading && banners.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl border border-white/40 p-20 bg-white/50">
            <Loader2 className="animate-spin text-[#6e63b8]" size={32} />
            <p className="mt-4 text-sm font-semibold text-[#4b328b]">Loading banners...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {banners.length === 0 ? (
              <div className="glass flex flex-col items-center justify-center rounded-2xl border border-white/40 p-20 bg-white/50 text-center">
                <span className="text-sm text-[#6b6680]">No promotional banners configured yet.</span>
              </div>
            ) : (
              banners.map((banner, index) => (
                <div
                  key={banner.id}
                  className="glass flex flex-col md:flex-row gap-5 rounded-2xl border border-white/40 p-5 bg-white/50 items-center transition hover:shadow-md"
                >
                  {/* Banner Image Preview */}
                  <div className="h-24 w-44 shrink-0 overflow-hidden rounded-xl border border-[#4b328b]/10 bg-slate-100 relative">
                    {banner.image_url ? (
                      <img src={banner.image_url} alt={banner.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#4b328b]/5 text-[#4b328b]/30">
                        <ImageIcon size={20} />
                      </div>
                    )}
                  </div>

                  {/* Banner Text Detail */}
                  <div className="flex-1 min-w-0 text-center md:text-left">
                    <h3 className="text-base font-bold text-[#21183d] truncate">{banner.title || "Untitled Banner"}</h3>
                    <p className="text-xs text-[#6b6680] mt-1 line-clamp-2">{banner.subtitle || "No subtitle"}</p>
                    {banner.link_url && (
                      <span className="inline-block mt-2 font-mono text-[10px] text-[#6e63b8] bg-[#6e63b8]/5 px-2 py-0.5 rounded">
                        Link: {banner.link_url}
                      </span>
                    )}
                  </div>

                  {/* Order & Reordering Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      disabled={index === 0}
                      onClick={() => handleReorder(index, "up")}
                      className="rounded-lg p-2 border border-[#4b328b]/10 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      disabled={index === banners.length - 1}
                      onClick={() => handleReorder(index, "down")}
                      className="rounded-lg p-2 border border-[#4b328b]/10 bg-white hover:bg-slate-50 disabled:opacity-30 disabled:hover:bg-white transition"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>

                  {/* Status Toggle */}
                  <div className="flex flex-col items-center gap-1 shrink-0">
                    <span className="text-[10px] uppercase font-bold text-[#6b6680]">Status</span>
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border transition duration-200 ${
                        banner.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {banner.is_active ? "Active" : "Inactive"}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenEdit(banner)}
                      className="rounded-lg p-2 border border-[#4b328b]/10 bg-white text-slate-700 hover:border-[#6e63b8] hover:text-[#6e63b8] transition"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(banner.id || null)}
                      className="rounded-lg p-2 border border-red-100 bg-white text-red-600 hover:bg-red-50 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal Form Dialog */}
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="glass w-full max-w-lg rounded-2xl border border-white/50 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b border-[#4b328b]/5 pb-3 mb-5">
                <h3 className="text-lg font-bold text-[#21183d]">
                  {editingBanner ? "Edit Banner" : "Create Banner"}
                </h3>
                <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSave} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Banner Title
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Banner Subtitle
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Button URL / Link Target
                  <input
                    type="text"
                    value={formData.link_url}
                    onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                    placeholder="/shop or https://..."
                    className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <div>
                  <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b] mb-1">
                    Banner Graphic
                  </span>
                  <ImageUploader
                    bucket="banner-images"
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
                    Active (visible in homepage slider)
                  </label>
                </div>

                <div className="flex justify-end gap-3 mt-4 border-t border-[#4b328b]/5 pt-4">
                  <Button variant="ghost" type="button" onClick={() => setFormOpen(false)} className="min-h-10 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="min-h-10 px-6 text-xs">
                    {saving ? <Loader2 className="animate-spin" size={15} /> : "Save Banner"}
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
                Are you sure you want to delete this promotional banner? This action cannot be undone.
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
                  Delete Banner
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
