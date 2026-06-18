"use client";

import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { Save, Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type SettingsState = {
  whatsapp_number: string;
  contact_email: string;
  instagram_url: string;
  facebook_url: string;
  footer_text: string;
  brand_description: string;
  seo_title: string;
  seo_description: string;
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SettingsState>({
    whatsapp_number: "",
    contact_email: "",
    instagram_url: "",
    facebook_url: "",
    footer_text: "",
    brand_description: "",
    seo_title: "",
    seo_description: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);

  // Clear notifications automatically after 4 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  async function loadSettings() {
    try {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase.from("settings").select("*").eq("id", "default").single();
      if (error && error.code !== "PGRST116") {
        throw error;
      }
      if (data) {
        setSettings({
          whatsapp_number: data.whatsapp_number || "",
          contact_email: data.contact_email || "",
          instagram_url: data.instagram_url || "",
          facebook_url: data.facebook_url || "",
          footer_text: data.footer_text || "",
          brand_description: data.brand_description || "",
          seo_title: data.seo_title || "",
          seo_description: data.seo_description || ""
        });
      }
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to load settings" });
    } finally {
      setLoading(false);
    }
  }

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    try {
      setSaving(true);
      setNotification(null);

      const supabase = createClient();
      const { error } = await supabase.from("settings").upsert({
        id: "default",
        ...settings,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
      setNotification({ type: "success", message: "Settings saved successfully!" });
    } catch (err: any) {
      setNotification({ type: "error", message: err.message || "Failed to save settings" });
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  return (
    <AdminShell>
      <div className="flex flex-col gap-6 max-w-4xl">
        {/* Header */}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#5faedb]">Configuration</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-[#21183d]">Store Settings</h1>
          <p className="text-sm text-[#6b6680]">Manage contact coordinates, SEO preferences, and brand presentation.</p>
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

        {loading ? (
          <div className="glass flex flex-col items-center justify-center rounded-2xl border border-white/40 p-20 bg-white/50">
            <Loader2 className="animate-spin text-[#6e63b8]" size={32} />
            <p className="mt-4 text-sm font-semibold text-[#4b328b]">Retrieving settings...</p>
          </div>
        ) : (
          <form onSubmit={saveSettings} className="flex flex-col gap-6">
            {/* Contact Information */}
            <div className="glass rounded-2xl border border-white/40 p-6 bg-white/50">
              <h2 className="text-lg font-bold text-[#21183d] border-b border-[#4b328b]/5 pb-3 mb-5">Contact Details</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  WhatsApp Number
                  <input
                    type="text"
                    required
                    value={settings.whatsapp_number}
                    onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                    placeholder="919999999999"
                    className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Contact Email
                  <input
                    type="email"
                    required
                    value={settings.contact_email}
                    onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                    placeholder="info@kuppaaya.com"
                    className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>
              </div>
            </div>

            {/* Social Channels */}
            <div className="glass rounded-2xl border border-white/40 p-6 bg-white/50">
              <h2 className="text-lg font-bold text-[#21183d] border-b border-[#4b328b]/5 pb-3 mb-5">Social Channels</h2>
              <div className="grid gap-5 md:grid-cols-2">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Instagram URL
                  <input
                    type="url"
                    value={settings.instagram_url}
                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                    placeholder="https://instagram.com/kuppaaya"
                    className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Facebook URL
                  <input
                    type="url"
                    value={settings.facebook_url}
                    onChange={(e) => setSettings({ ...settings, facebook_url: e.target.value })}
                    placeholder="https://facebook.com/kuppaaya"
                    className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>
              </div>
            </div>

            {/* Storefront Layout & Description */}
            <div className="glass rounded-2xl border border-white/40 p-6 bg-white/50">
              <h2 className="text-lg font-bold text-[#21183d] border-b border-[#4b328b]/5 pb-3 mb-5">Brand Presentation</h2>
              <div className="grid gap-5">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Brand Description
                  <textarea
                    rows={3}
                    value={settings.brand_description}
                    onChange={(e) => setSettings({ ...settings, brand_description: e.target.value })}
                    placeholder="Brief description of your brand..."
                    className="focus-ring rounded-xl border border-[#4b328b]/10 bg-white p-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  Footer Text
                  <input
                    type="text"
                    value={settings.footer_text}
                    onChange={(e) => setSettings({ ...settings, footer_text: e.target.value })}
                    placeholder="© 2026 Kuppaaya. All rights reserved."
                    className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>
              </div>
            </div>

            {/* SEO Metadata */}
            <div className="glass rounded-2xl border border-white/40 p-6 bg-white/50">
              <h2 className="text-lg font-bold text-[#21183d] border-b border-[#4b328b]/5 pb-3 mb-5">Search Engine Optimization (SEO)</h2>
              <div className="grid gap-5">
                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  SEO Meta Title
                  <input
                    type="text"
                    value={settings.seo_title}
                    onChange={(e) => setSettings({ ...settings, seo_title: e.target.value })}
                    placeholder="Kuppaaya | Premium Modest Fashion"
                    className="focus-ring h-11 rounded-xl border border-[#4b328b]/10 bg-white px-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>

                <label className="flex flex-col gap-2 text-xs font-bold uppercase tracking-[0.08em] text-[#4b328b]">
                  SEO Meta Description
                  <textarea
                    rows={3}
                    value={settings.seo_description}
                    onChange={(e) => setSettings({ ...settings, seo_description: e.target.value })}
                    placeholder="Meta description for search engine listings..."
                    className="focus-ring rounded-xl border border-[#4b328b]/10 bg-white p-4 text-sm font-normal normal-case tracking-normal text-[#21183d]"
                  />
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-3 mt-2">
              <Button type="submit" disabled={saving} className="min-h-12 px-8">
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={17} /> Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={17} /> Save Settings
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminShell>
  );
}
