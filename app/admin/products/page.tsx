"use client";

import React, { useEffect, useState, useTransition } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { ImageUploader } from "@/components/admin/image-uploader";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Sparkles,
  Package,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
  FileDown,
  ChevronDown,
  SlidersHorizontal,
  ChevronRight,
  TrendingDown,
  Layers,
  ArrowUpDown,
  PlusCircle,
  MinusCircle
} from "lucide-react";

type Category = { id: string; name: string };
type Subcategory = { id: string; name: string; category_id: string };

type ProductImage = {
  id?: string;
  product_id?: string;
  image_url: string;
  sort_order: number;
};

type ProductVariant = {
  id?: string;
  product_id?: string;
  size: string;
  color: string;
  stock_quantity: number;
};

type ProductState = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compare_at_price?: number | null;
  stock_quantity: number;
  is_active: boolean;
  featured: boolean;
  category_id: string;
  subcategory_id?: string | null;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
  category?: Category;
  subcategory?: Subcategory;
  created_at?: string;
};

export default function AdminProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Table state
  const [products, setProducts] = useState<ProductState[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [subcategoryFilter, setSubcategoryFilter] = useState("all");
  const [isActiveFilter, setIsActiveFilter] = useState("all"); // Changed from statusFilter
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // Form modal states
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductState | null>(null);
  const [formData, setFormData] = useState<ProductState>({
    name: "",
    slug: "",
    description: "",
    price: 0,
    compare_at_price: null,
    stock_quantity: 0,
    is_active: true,
    featured: false,
    category_id: "",
    subcategory_id: "",
    product_images: [],
    product_variants: []
  });

  // Variant form draft state
  const [variantDraft, setVariantDraft] = useState({ size: "", color: "", stock_quantity: 0 });

  // Notifications
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteConfirmType, setDeleteConfirmType] = useState<"single" | "bulk">("single");

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, categoryFilter, subcategoryFilter, isActiveFilter, featuredFilter, sortBy]);

  // Handle parameters from other pages (like Dashboard stock warning)
  useEffect(() => {
    const stockQuery = searchParams.get("stock");
    const newQuery = searchParams.get("new");
    if (stockQuery === "low") {
      setSortBy("stock-asc");
    }
    if (newQuery === "true") {
      handleOpenCreate();
    }
  }, [searchParams]);

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

      // Parallel loads
      const [catRes, subRes, prodRes] = await Promise.all([
        supabase.from("categories").select("*").order("name"),
        supabase.from("subcategories").select("*").order("name"),
        supabase.from("products").select("*, product_images(*), product_variants(*), category:categories(*), subcategory:subcategories(*)").order("created_at", { ascending: false })
      ]);

      if (catRes.error) throw catRes.error;
      if (subRes.error) throw subRes.error;
      if (prodRes.error) throw prodRes.error;

      setCategories(catRes.data || []);
      setSubcategories(subRes.data || []);
      setProducts((prodRes.data || []) as ProductState[]);
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to load data" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  // Slug auto-generation from name
  useEffect(() => {
    if (!editingProduct && formData.name) {
      const generatedSlug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.name, editingProduct]);

  // Dependent subcategory dropdown filter
  const availableSubcategories = subcategories.filter(
    (sub) => sub.category_id === formData.category_id
  );

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      description: "",
      price: 0,
      compare_at_price: null,
      stock_quantity: 0,
      is_active: true,
      featured: false,
      category_id: categories[0]?.id || "",
      subcategory_id: "",
      product_images: [],
      product_variants: []
    });
    setFormOpen(true);
  };

  const handleOpenEdit = (product: ProductState) => {
    setEditingProduct(product);
    setFormData({
      ...product,
      subcategory_id: product.subcategory_id || ""
    });
    setFormOpen(true);
  };

  const handleDuplicate = (product: ProductState) => {
    setEditingProduct(null);
    setFormData({
      ...product,
      id: undefined,
      name: `Copy of ${product.name}`,
      slug: `${product.slug}-copy`,
      product_images: product.product_images?.map((img) => ({ ...img, id: undefined, product_id: undefined })) || [],
      product_variants: product.product_variants?.map((v) => ({ ...v, id: undefined, product_id: undefined })) || []
    });
    setFormOpen(true);
  };

  const handleAddVariant = () => {
    if (!variantDraft.size || !variantDraft.color || variantDraft.stock_quantity < 0) {
      alert("Please enter a valid Size, Color, and Stock Quantity.");
      return;
    }
    const newVariant: ProductVariant = {
      id: Math.random().toString(36).substring(2, 9),
      size: variantDraft.size,
      color: variantDraft.color,
      stock_quantity: variantDraft.stock_quantity
    };
    setFormData((prev) => ({
      ...prev,
      product_variants: [...(prev.product_variants || []), newVariant],
      // Recalculate total product stock automatically based on variants
      stock_quantity: (prev.product_variants || []).reduce((acc, curr) => acc + curr.stock_quantity, 0) + newVariant.stock_quantity
    }));
    setVariantDraft({ size: "", color: "", stock_quantity: 0 });
  };

  const handleRemoveVariant = (index: number) => {
    const updated = (formData.product_variants || []).filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      product_variants: updated,
      stock_quantity: updated.reduce((acc, curr) => acc + curr.stock_quantity, 0)
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.category_id) {
      alert("Please select a category.");
      return;
    }

    try {
      setSaving(true);
      const productId = editingProduct?.id || Math.random().toString(36).substring(2, 9);
      const cleanSubcategoryId = formData.subcategory_id || null;

      const productPayload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        price: Number(formData.price),
        stock_quantity: Number(formData.stock_quantity),
        is_active: formData.is_active,
        featured: formData.featured,
        category_id: formData.category_id,
        subcategory_id: cleanSubcategoryId
      };

      const supabase = createClient();

      // 1. Save product
      if (editingProduct) {
        const { error } = await supabase
          .from("products")
          .update(productPayload)
          .eq("id", productId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("products").insert([
          { id: productId, ...productPayload }
        ]);
        if (error) throw error;
      }

      // 2. Sync Images
      await supabase.from("product_images").delete().eq("product_id", productId);
      if (formData.product_images && formData.product_images.length > 0) {
        const imageRows = formData.product_images.map((img, index) => ({
          product_id: productId,
          image_url: img.image_url,
          sort_order: index
        }));
        const { error: imgErr } = await supabase.from("product_images").insert(imageRows);
        if (imgErr) throw imgErr;
      }

      // 3. Sync Variants
      await supabase.from("product_variants").delete().eq("product_id", productId);
      if (formData.product_variants && formData.product_variants.length > 0) {
        const variantRows = formData.product_variants.map((v) => ({
          product_id: productId,
          size: v.size,
          color: v.color,
          stock_quantity: v.stock_quantity
        }));
        const { error: varErr } = await supabase.from("product_variants").insert(variantRows);
        if (varErr) throw varErr;
      }

      setNotification({
        type: "success",
        message: editingProduct ? "Product updated successfully" : "Product created successfully"
      });
      setFormOpen(false);
      await loadData();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to save product" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      const supabase = createClient();

      // Storage cleanups (product-images bucket)
      const { data: pImgs } = await supabase.from("product_images").select("image_url").eq("product_id", id);
      if (pImgs && pImgs.length > 0) {
        const filePaths = pImgs
          .map((img) => {
            const parts = img.image_url.split("/product-images/");
            return parts.length > 1 ? parts[1] : null;
          })
          .filter(Boolean) as string[];
        if (filePaths.length > 0) {
          await supabase.storage.from("product-images").remove(filePaths);
        }
      }

      // DB deletes
      await supabase.from("products").delete().eq("id", id);
      setNotification({ type: "success", message: "Product deleted successfully" });
      setDeleteConfirmId(null);
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      await loadData();
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to delete product" });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFeatured = async (product: ProductState) => {
    try {
      const updatedFeatured = !product.featured;
      
      // Optimistic state update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, featured: updatedFeatured } : p))
      );

      const supabase = createClient();
      await supabase
        .from("products")
        .update({ featured: updatedFeatured })
        .eq("id", product.id);
      setNotification({ type: "success", message: "Featured status updated" });
    } catch (err) {
      setNotification({ type: "error", message: "Failed to update featured status" });
      loadData(); // Revert
    }
  };

  const handleStatusChange = async (product: ProductState, isActive: boolean) => {
    try {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, is_active: isActive } : p))
      );

      const supabase = createClient();
      await supabase
        .from("products")
        .update({ is_active: isActive })
        .eq("id", product.id);
      setNotification({ type: "success", message: `Product ${isActive ? "activated" : "deactivated"}` });
    } catch (err) {
      setNotification({ type: "error", message: "Failed to update status" });
      loadData();
    }
  };

  // Bulk Actions Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredProducts.map((p) => p.id!).filter(Boolean));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((item) => item !== id));
    }
  };

  const handleBulkStatusChange = async (isActive: boolean) => {
    try {
      setLoading(true);
      // Optimistic state
      setProducts((prev) =>
        prev.map((p) => (selectedIds.includes(p.id!) ? { ...p, is_active: isActive } : p))
      );

      const supabase = createClient();
      for (const id of selectedIds) {
        await supabase.from("products").update({ is_active: isActive }).eq("id", id);
      }
      setNotification({ type: "success", message: `Updated status for ${selectedIds.length} items` });
      setSelectedIds([]);
      await loadData();
    } catch (err) {
      setNotification({ type: "error", message: "Bulk action failed" });
      loadData();
    }
  };

  const handleBulkFeaturedToggle = async (featured: boolean) => {
    try {
      setLoading(true);
      setProducts((prev) =>
        prev.map((p) => (selectedIds.includes(p.id!) ? { ...p, featured: featured } : p))
      );

      const supabase = createClient();
      for (const id of selectedIds) {
        await supabase.from("products").update({ featured: featured }).eq("id", id);
      }
      setNotification({ type: "success", message: `Updated featured status for ${selectedIds.length} items` });
      setSelectedIds([]);
      await loadData();
    } catch (err) {
      setNotification({ type: "error", message: "Bulk action failed" });
      loadData();
    }
  };

  const handleBulkDeleteConfirm = () => {
    setDeleteConfirmType("bulk");
    setDeleteConfirmId("bulk-dummy");
  };

  const handleBulkDelete = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      for (const id of selectedIds) {
        await supabase.from("products").delete().eq("id", id);
      }
      setNotification({ type: "success", message: `Deleted ${selectedIds.length} products` });
      setSelectedIds([]);
      setDeleteConfirmId(null);
      await loadData();
    } catch (err) {
      setNotification({ type: "error", message: "Bulk deletion failed" });
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort Logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = categoryFilter === "all" || product.category_id === categoryFilter;
    const matchesSubcategory = subcategoryFilter === "all" || product.subcategory_id === subcategoryFilter;
    
    const matchesStatus = isActiveFilter === "all" ||
      (isActiveFilter === "active" && product.is_active === true) ||
      (isActiveFilter === "inactive" && product.is_active === false);

    const matchesFeatured = featuredFilter === "all" ||
      (featuredFilter === "featured" && product.featured) ||
      (featuredFilter === "standard" && !product.featured);

    return matchesSearch && matchesCategory && matchesSubcategory && matchesStatus && matchesFeatured;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
    }
    if (sortBy === "oldest") {
      return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
    }
    if (sortBy === "price-asc") {
      return a.price - b.price;
    }
    if (sortBy === "price-desc") {
      return b.price - a.price;
    }
    if (sortBy === "stock-asc") {
      return a.stock_quantity - b.stock_quantity;
    }
    if (sortBy === "stock-desc") {
      return b.stock_quantity - a.stock_quantity;
    }
    return 0;
  });

  // Pagination details
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Catalog Management</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#21183d]">Product Catalog</h1>
            <p className="text-sm text-[#6b6680]">Manage details, variants, pricing, and stock of your collection items.</p>
          </div>
          <div>
            <Button onClick={handleOpenCreate} className="min-h-11 px-5">
              <Plus size={16} /> Create Product
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

        {/* Filters grid */}
        <div className="glass rounded-xl border border-white/40 p-5 bg-white/50 flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="focus-ring h-10 w-full rounded-xl border border-[#4b328b]/10 bg-white pl-10 pr-4 text-sm text-[#21183d]"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSubcategoryFilter("all");
              }}
              className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d]"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Subcategory Filter */}
            <select
              value={subcategoryFilter}
              disabled={categoryFilter === "all"}
              onChange={(e) => setSubcategoryFilter(e.target.value)}
              className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d] disabled:opacity-50"
            >
              <option value="all">All Subcategories</option>
              {subcategories
                .filter((sub) => sub.category_id === categoryFilter)
                .map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
            </select>

            {/* Status Filter */}
            <select
              value={isActiveFilter}
              onChange={(e) => setIsActiveFilter(e.target.value)}
              className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d]"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 border-t border-[#4b328b]/5 pt-3">
            {/* Featured filter */}
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d]"
            >
              <option value="all">All Types</option>
              <option value="featured">Featured Only</option>
              <option value="standard">Standard Only</option>
            </select>

            {/* Sorting */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d]"
            >
              <option value="newest">Sort by: Newest</option>
              <option value="oldest">Sort by: Oldest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="stock-asc">Stock: Low to High</option>
              <option value="stock-desc">Stock: High to Low</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions Floating Bar */}
        {selectedIds.length > 0 && (
          <div className="glass rounded-xl border border-[#6e63b8]/20 p-4 bg-[#6e63b8]/5 flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#6e63b8] text-xs font-bold text-white shadow">
                {selectedIds.length}
              </span>
              <span className="text-xs font-semibold text-[#21183d]">items selected</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => handleBulkStatusChange(true)} variant="secondary" className="min-h-9 px-3 text-[11px] h-9">
                Make Active
              </Button>
              <Button onClick={() => handleBulkStatusChange(false)} variant="secondary" className="min-h-9 px-3 text-[11px] h-9">
                Make Draft
              </Button>
              <Button onClick={() => handleBulkFeaturedToggle(true)} variant="secondary" className="min-h-9 px-3 text-[11px] h-9">
                Mark Featured
              </Button>
              <Button onClick={() => handleBulkFeaturedToggle(false)} variant="secondary" className="min-h-9 px-3 text-[11px] h-9">
                Unfeatured
              </Button>
              <Button onClick={handleBulkDeleteConfirm} className="min-h-9 px-3 bg-red-600 text-white hover:bg-red-700 text-[11px] h-9">
                Bulk Delete
              </Button>
            </div>
          </div>
        )}

        {/* Product Table */}
        {loading && products.length === 0 ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl border border-white/40 p-20 bg-white/50">
            <Loader2 className="animate-spin text-[#6e63b8]" size={32} />
            <p className="mt-4 text-sm font-semibold text-[#4b328b]">Loading product catalog...</p>
          </div>
        ) : (
          <div className="glass rounded-2xl border border-white/40 bg-white/50 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead>
                  <tr className="border-b border-[#4b328b]/5 bg-slate-50/50 text-[11px] font-bold uppercase tracking-wider text-[#4b328b]/80">
                    <th className="px-6 py-4 w-10">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="h-4 w-4 accent-[#6e63b8] rounded"
                      />
                    </th>
                    <th className="px-6 py-4">Image</th>
                    <th className="px-6 py-4">Product Details</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Subcategory</th>
                    <th className="px-6 py-4">Price</th>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#4b328b]/5">
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-12 text-center text-xs text-[#6b6680]">
                        No products matched the filters.
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => (
                      <tr key={product.id} className="transition hover:bg-white/60">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(product.id!)}
                            onChange={(e) => handleSelectOne(product.id!, e.target.checked)}
                            className="h-4 w-4 accent-[#6e63b8] rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="h-12 w-12 overflow-hidden rounded-lg border border-[#4b328b]/10 bg-slate-100 relative">
                            {product.product_images?.[0]?.image_url ? (
                              <img
                                src={product.product_images[0].image_url}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#4b328b]/5 text-[#4b328b]/30">
                                <Package size={16} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <span className="font-bold text-[#21183d] block truncate" title={product.name}>
                            {product.name}
                          </span>
                          <span className="text-[10px] font-mono text-[#6e63b8] truncate block" title={product.slug}>
                            {product.slug}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-700">
                          {product.category?.name || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">
                          {product.subcategory?.name || "—"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-[#4b328b]">
                          ₹{product.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.stock_quantity <= 5 ? (
                            <span className="inline-flex items-center rounded bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 border border-red-200">
                              {product.stock_quantity} (Low)
                            </span>
                          ) : (
                            <span className="text-xs font-medium text-slate-700">
                              {product.stock_quantity}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => handleToggleFeatured(product)}
                            className={`rounded-full p-1 transition ${
                              product.featured
                                ? "text-amber-500 hover:text-amber-600 scale-110"
                                : "text-slate-300 hover:text-slate-400"
                            }`}
                          >
                            <Sparkles size={16} fill={product.featured ? "currentColor" : "none"} />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={product.is_active ? "active" : "inactive"}
                            onChange={(e) => handleStatusChange(product, e.target.value === "active")}
                            className={`focus-ring text-[11px] font-bold rounded-lg border px-2 py-1 bg-white cursor-pointer ${
                              product.is_active
                                ? "text-emerald-700 border-emerald-200 bg-emerald-50/50"
                                : "text-slate-600 border-slate-200"
                            }`}
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-medium">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleDuplicate(product)}
                              className="rounded-lg p-1.5 border border-[#4b328b]/10 bg-white text-slate-700 hover:border-[#6e63b8] hover:text-[#6e63b8] transition"
                              title="Duplicate"
                            >
                              <Copy size={13} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(product)}
                              className="rounded-lg p-1.5 border border-[#4b328b]/10 bg-white text-slate-700 hover:border-[#6e63b8] hover:text-[#6e63b8] transition"
                              title="Edit"
                            >
                              <Edit2 size={13} />
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmType("single");
                                setDeleteConfirmId(product.id || null);
                              }}
                              className="rounded-lg p-1.5 border border-red-100 bg-white text-red-600 hover:bg-red-50 transition"
                              title="Delete"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-[#4b328b]/5 px-6 py-4 bg-slate-50/50">
                <span className="text-xs text-[#6b6680]">
                  Showing Page {currentPage} of {totalPages} ({sortedProducts.length} total products)
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

        {/* Modal Create & Edit Form Dialog */}
        {formOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="glass w-full max-w-3xl my-8 rounded-2xl border border-white/50 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#4b328b]/5 pb-3 mb-4 shrink-0">
                <h3 className="text-lg font-bold text-[#21183d]">
                  {editingProduct ? `Edit: ${editingProduct.name}` : "Add New Product"}
                </h3>
                <button onClick={() => setFormOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={18} />
                </button>
              </div>

              {/* Form container scrollable */}
              <form onSubmit={handleSave} className="flex-1 overflow-y-auto pr-1 flex flex-col gap-5 text-left">
                {/* General Info */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                    Product Name
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                    Slug
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Description
                  <textarea
                    rows={3}
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="focus-ring rounded-xl border border-[#4b328b]/10 bg-white p-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                {/* Categories */}
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                    Category
                    <select
                      required
                      value={formData.category_id}
                      onChange={(e) =>
                        setFormData({ ...formData, category_id: e.target.value, subcategory_id: "" })
                      }
                      className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d]"
                    >
                      <option value="" disabled>Select category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                    Subcategory
                    <select
                      value={formData.subcategory_id || ""}
                      onChange={(e) => setFormData({ ...formData, subcategory_id: e.target.value || null })}
                      className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm text-[#21183d]"
                    >
                      <option value="">None (Uncategorized subdivision)</option>
                      {availableSubcategories.map((sub) => (
                        <option key={sub.id} value={sub.id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {/* Pricing & Stock */}
                <div className="grid gap-4 md:grid-cols-3">
                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                    Price (INR)
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                    Compare at Price (INR)
                    <input
                      type="number"
                      min={0}
                      value={formData.compare_at_price || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          compare_at_price: e.target.value ? Number(e.target.value) : null
                        })
                      }
                      placeholder="e.g. Original MSRP price"
                      className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                    Stock Quantity
                    <input
                      type="number"
                      required
                      min={0}
                      value={formData.stock_quantity}
                      onChange={(e) => setFormData({ ...formData, stock_quantity: Number(e.target.value) })}
                      className="focus-ring h-10 rounded-xl border border-[#4b328b]/10 bg-white px-3 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                    />
                  </label>
                </div>

                {/* Status & Featured */}
                <div className="grid gap-4 md:grid-cols-2 bg-slate-50/50 p-4 rounded-xl border border-[#4b328b]/5">
                  <div className="flex flex-col justify-center gap-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b] mb-1">
                      Visibility Status
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="form_is_active"
                        checked={formData.is_active}
                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="h-5 w-5 accent-[#6e63b8] rounded"
                      />
                      <label htmlFor="form_is_active" className="text-xs font-semibold text-[#4b328b] cursor-pointer">
                        Product is active
                      </label>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center gap-1">
                    <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b] mb-1">
                      Featured Product
                    </span>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="form_featured"
                        checked={formData.featured}
                        onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                        className="h-5 w-5 accent-[#6e63b8] rounded"
                      />
                      <label htmlFor="form_featured" className="text-xs font-semibold text-[#4b328b] cursor-pointer">
                        Mark as featured on homepage
                      </label>
                    </div>
                  </div>
                </div>

                {/* Product Images (Max 10) */}
                <div className="border-t border-[#4b328b]/5 pt-4">
                  <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b] mb-2">
                    Product Images (Max 10, Cover is first image)
                  </span>
                  <ImageUploader
                    bucket="product-images"
                    images={formData.product_images?.map((img) => img.image_url) || []}
                    onChange={(urls) =>
                      setFormData({
                        ...formData,
                        product_images: urls.map((url, idx) => ({ image_url: url, sort_order: idx }))
                      })
                    }
                    multiple={true}
                    maxImages={10}
                  />
                </div>

                {/* Product Variants */}
                <div className="border-t border-[#4b328b]/5 pt-4">
                  <span className="block text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b] mb-2">
                    Manage Product Variants (Sizes & Colors)
                  </span>
                  
                  {/* Variant Input Row */}
                  <div className="grid gap-3 sm:grid-cols-4 items-end bg-[#4b328b]/5 p-3 rounded-xl border border-[#4b328b]/10 mb-4">
                    <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                      Size
                      <input
                        type="text"
                        placeholder="e.g. S, M, L, XL"
                        value={variantDraft.size}
                        onChange={(e) => setVariantDraft({ ...variantDraft, size: e.target.value })}
                        className="focus-ring h-9 rounded-lg border border-[#4b328b]/10 bg-white px-3 text-xs font-normal normal-case tracking-normal"
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                      Color
                      <input
                        type="text"
                        placeholder="e.g. Black, Pearl"
                        value={variantDraft.color}
                        onChange={(e) => setVariantDraft({ ...variantDraft, color: e.target.value })}
                        className="focus-ring h-9 rounded-lg border border-[#4b328b]/10 bg-white px-3 text-xs font-normal normal-case tracking-normal"
                      />
                    </label>

                    <label className="flex flex-col gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                      Stock Qty
                      <input
                        type="number"
                        min={0}
                        value={variantDraft.stock_quantity || ""}
                        onChange={(e) =>
                          setVariantDraft({ ...variantDraft, stock_quantity: Number(e.target.value) })
                        }
                        className="focus-ring h-9 rounded-lg border border-[#4b328b]/10 bg-white px-3 text-xs font-normal normal-case tracking-normal"
                      />
                    </label>

                    <button
                      type="button"
                      onClick={handleAddVariant}
                      className="focus-ring h-9 flex items-center justify-center gap-1 rounded-lg brand-gradient text-white text-xs font-semibold hover:shadow-sm"
                    >
                      <PlusCircle size={14} /> Add Variant
                    </button>
                  </div>

                  {/* Variants List */}
                  {formData.product_variants && formData.product_variants.length > 0 ? (
                    <div className="border border-[#4b328b]/10 rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-[#4b328b]/10 text-[10px] font-bold text-[#4b328b]/80 uppercase">
                            <th className="px-4 py-2">Color</th>
                            <th className="px-4 py-2">Size</th>
                            <th className="px-4 py-2">Stock</th>
                            <th className="px-4 py-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#4b328b]/5">
                          {formData.product_variants.map((v, index) => (
                            <tr key={index}>
                              <td className="px-4 py-2 font-medium text-slate-800">{v.color}</td>
                              <td className="px-4 py-2 font-semibold text-[#6e63b8]">{v.size}</td>
                              <td className="px-4 py-2 text-slate-700">{v.stock_quantity} units</td>
                              <td className="px-4 py-2 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(index)}
                                  className="text-red-600 hover:text-red-800 transition"
                                >
                                  <MinusCircle size={15} />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#6b6680] italic">No variants added yet. Manage color, sizes, and specific stocks.</p>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 mt-4 border-t border-[#4b328b]/5 pt-4 shrink-0">
                  <Button variant="ghost" type="button" onClick={() => setFormOpen(false)} className="min-h-10 text-xs">
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saving} className="min-h-10 px-6 text-xs">
                    {saving ? <Loader2 className="animate-spin" size={15} /> : "Save Product"}
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
                {deleteConfirmType === "bulk"
                  ? `Are you sure you want to delete the ${selectedIds.length} selected products?`
                  : "Are you sure you want to delete this product? All variants and uploaded images will be removed."}
              </p>
              <div className="flex justify-end gap-2 mt-5">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDeleteConfirmId(null);
                    setDeleteConfirmType("single");
                  }}
                  className="min-h-9 px-4 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={deleteConfirmType === "bulk" ? handleBulkDelete : () => handleDelete(deleteConfirmId)}
                  className="min-h-9 px-4 bg-red-600 text-white hover:bg-red-700 text-xs"
                >
                  Confirm Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
