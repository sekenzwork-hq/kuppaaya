"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Image as ImageIcon, LayoutDashboard, LogOut, Package, Shapes, Tags, Settings as SettingsIcon, Menu, X, type LucideIcon } from "lucide-react";
import { useState } from "react";

const links: [string, string, LucideIcon][] = [
  ["/admin", "Dashboard", LayoutDashboard],
  ["/admin/products", "Products", Package],
  ["/admin/categories", "Categories", Shapes],
  ["/admin/subcategories", "Subcategories", Tags],
  ["/admin/banners", "Banners", ImageIcon],
  ["/admin/settings", "Settings", SettingsIcon]
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  async function handleSignOut() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const navItems = links.map(([href, label, Icon]) => {
    const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));
    return (
      <Link
        key={String(href)}
        href={String(href)}
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
          isActive
            ? "brand-gradient text-white shadow-md shadow-[#6e63b8]/20"
            : "text-[#4b328b]/80 hover:bg-white hover:text-[#4b328b] border border-transparent hover:border-[#4b328b]/5"
        }`}
      >
        <Icon size={18} />
        {String(label)}
      </Link>
    );
  });

  return (
    <main className="bg-[#f8fafc] min-h-[calc(100vh-140px)] subtle-grid py-8">
      <div className="container-shell grid gap-6 lg:grid-cols-[240px_1fr]">
        
        {/* Desktop Sidebar */}
        <aside className="glass hidden h-fit flex-col gap-1 rounded-2xl p-4 lg:flex border border-white/40">
          <div className="mb-4 px-2 pb-3 border-b border-[#4b328b]/5">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5faedb]">Control Panel</span>
            <p className="text-xs text-[#6b6680] mt-0.5">Manage your digital boutique</p>
          </div>
          <div className="flex flex-col gap-1">
            {navItems}
          </div>
          <button
            onClick={handleSignOut}
            className="mt-6 flex w-full items-center gap-3 rounded-xl border border-transparent px-4 py-3 text-left text-sm font-semibold text-red-600 transition-all duration-200 hover:bg-red-50 hover:text-red-700 hover:border-red-100"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </aside>

        {/* Mobile Header / Menu Button */}
        <div className="flex flex-col gap-4 lg:hidden">
          <div className="glass flex items-center justify-between rounded-xl p-4 border border-white/40">
            <span className="text-sm font-bold text-[#21183d]">Admin Navigation</span>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#4b328b]/10 bg-white text-[#4b328b]"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Mobile Dropdown */}
          {mobileMenuOpen && (
            <div className="glass flex flex-col gap-1 rounded-xl p-3 border border-white/40 animate-in slide-in-from-top-4 duration-200">
              {navItems}
              <button
                onClick={handleSignOut}
                className="mt-3 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
