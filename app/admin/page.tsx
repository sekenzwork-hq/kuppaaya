import { AdminShell } from "@/components/admin/admin-shell";
import { getDashboardStats } from "@/lib/services/admin";
import { Package, Shapes, Tags, Sparkles, Image as ImageIcon, AlertTriangle, Clock, PlusCircle } from "lucide-react";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";

export const revalidate = 0; // Disable caching for the admin dashboard overview

export default async function AdminPage() {
  const data = await getDashboardStats();
  const { stats, recentlyAdded, lowStock, recentlyUpdated } = data;

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-500/10" },
    { label: "Total Categories", value: stats.totalCategories, icon: Shapes, color: "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-500/10" },
    { label: "Total Subcategories", value: stats.totalSubcategories, icon: Tags, color: "from-amber-500/10 to-orange-500/10 text-amber-600 border-amber-500/10" },
    { label: "Featured Products", value: stats.featuredProducts, icon: Sparkles, color: "from-purple-500/10 to-pink-500/10 text-purple-600 border-purple-500/10" },
    { label: "Active Banners", value: stats.activeBanners, icon: ImageIcon, color: "from-sky-500/10 to-cyan-500/10 text-sky-600 border-sky-500/10" }
  ];

  return (
    <AdminShell>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Admin Area</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#21183d]">Dashboard Overview</h1>
            <p className="text-sm text-[#6b6680]">Real-time store metrics and recent inventory updates.</p>
          </div>
          <div>
            <ButtonLink href="/admin/products?new=true" variant="primary" className="min-h-10 px-5 text-xs">
              <PlusCircle size={15} /> Add Product
            </ButtonLink>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className={`glass flex flex-col justify-between rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg bg-gradient-to-br ${card.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#6b6680]">{card.label}</span>
                  <div className="rounded-lg p-2 bg-white/80 shadow-sm">
                    <Icon size={18} />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-3xl font-bold text-[#21183d]">{card.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Lists Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recently Added */}
          <div className="glass flex flex-col rounded-xl border border-white/40 p-5 bg-white/50">
            <div className="flex items-center justify-between border-b border-[#4b328b]/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#6e63b8]" />
                <h2 className="text-base font-bold text-[#21183d]">Recently Added</h2>
              </div>
              <Link href="/admin/products" className="text-xs font-semibold text-[#6e63b8] hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {recentlyAdded.length === 0 ? (
                <p className="text-xs text-[#6b6680] py-8 text-center">No products found.</p>
              ) : (
                recentlyAdded.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/60">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-[#4b328b]/10 bg-slate-100">
                      {product.product_images?.[0]?.image_url ? (
                        <img
                          src={product.product_images[0].image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#4b328b]/5 text-[#4b328b]/30">
                          <Package size={14} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-bold text-[#21183d]">{product.name}</h4>
                      <p className="truncate text-[10px] text-[#6b6680]">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#4b328b]">₹{product.price}</p>
                      <p className="text-[9px] text-[#6b6680]">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="glass flex flex-col rounded-xl border border-white/40 p-5 bg-white/50">
            <div className="flex items-center justify-between border-b border-[#4b328b]/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" />
                <h2 className="text-base font-bold text-[#21183d]">Low Stock Alerts</h2>
              </div>
              <Link href="/admin/products?stock=low" className="text-xs font-semibold text-[#6e63b8] hover:underline">
                Manage
              </Link>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {lowStock.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center flex-1">
                  <span className="text-emerald-600 text-xs font-semibold">✓ Inventory Healthy</span>
                  <p className="text-[10px] text-[#6b6680] mt-1">All products have sufficient stock.</p>
                </div>
              ) : (
                lowStock.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/60">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-[#4b328b]/10 bg-slate-100">
                      {product.product_images?.[0]?.image_url ? (
                        <img
                          src={product.product_images[0].image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#4b328b]/5 text-[#4b328b]/30">
                          <Package size={14} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-bold text-[#21183d]">{product.name}</h4>
                      <p className="truncate text-[10px] text-[#6b6680]">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-medium text-red-700 border border-red-200">
                        {product.stock} left
                      </span>
                      <p className="text-[9px] text-[#6b6680] mt-0.5">Price: ₹{product.price}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recently Updated */}
          <div className="glass flex flex-col rounded-xl border border-white/40 p-5 bg-white/50">
            <div className="flex items-center justify-between border-b border-[#4b328b]/5 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-indigo-500" />
                <h2 className="text-base font-bold text-[#21183d]">Recently Updated</h2>
              </div>
              <Link href="/admin/products" className="text-xs font-semibold text-[#6e63b8] hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col gap-3 flex-1">
              {recentlyUpdated.length === 0 ? (
                <p className="text-xs text-[#6b6680] py-8 text-center">No updates found.</p>
              ) : (
                recentlyUpdated.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-lg p-2 transition hover:bg-white/60">
                    <div className="h-10 w-10 shrink-0 overflow-hidden rounded-md border border-[#4b328b]/10 bg-slate-100">
                      {product.product_images?.[0]?.image_url ? (
                        <img
                          src={product.product_images[0].image_url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#4b328b]/5 text-[#4b328b]/30">
                          <Package size={14} />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="truncate text-xs font-bold text-[#21183d]">{product.name}</h4>
                      <p className="truncate text-[10px] text-[#6b6680]">
                        {product.status === "active" ? (
                          <span className="text-emerald-600 font-semibold">Active</span>
                        ) : product.status === "draft" ? (
                          <span className="text-slate-500 font-semibold">Draft</span>
                        ) : (
                          <span className="text-red-500 font-semibold">Archived</span>
                        )}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-bold text-[#4b328b]">₹{product.price}</p>
                      <p className="text-[9px] text-[#6b6680]">Stock: {product.stock}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
