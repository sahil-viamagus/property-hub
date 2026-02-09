"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

interface SettingsFormProps {
  initialData: any;
}

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    siteName: initialData?.siteName || "",
    heroTitle: initialData?.heroTitle || "",
    heroSubtitle: initialData?.heroSubtitle || "",
    heroVideoUrl: initialData?.heroVideoUrl || "",
    contactPhone: initialData?.contactPhone || "",
    whatsapp: initialData?.whatsapp || "",
    email: initialData?.email || "",
    headOffice: initialData?.headOffice || "",
    maintenanceMode: initialData?.maintenanceMode || false,
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6 bg-white p-8 rounded-xl border shadow-sm">
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-black uppercase tracking-tighter border-l-4 border-blue-600 pl-3 mb-4">Branding & Hero</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Site Name</label>
              <input
                value={formData.siteName}
                onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                className="w-full rounded-md border p-2 text-black font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Title</label>
              <input
                value={formData.heroTitle}
                onChange={(e) => setFormData({ ...formData, heroTitle: e.target.value })}
                className="w-full rounded-md border p-2 text-black font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Subtitle</label>
              <textarea
                value={formData.heroSubtitle}
                onChange={(e) => setFormData({ ...formData, heroSubtitle: e.target.value })}
                className="w-full rounded-md border p-2 text-black font-medium"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Hero Video URL</label>
              <input
                value={formData.heroVideoUrl}
                onChange={(e) => setFormData({ ...formData, heroVideoUrl: e.target.value })}
                className="w-full rounded-md border p-2 text-black font-medium"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-black uppercase tracking-tighter border-l-4 border-emerald-600 pl-3 mb-4">Contact Info</h3>
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Phone Number</label>
              <input
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full rounded-md border p-2 text-black font-medium"
                placeholder="+91 99999 00000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">WhatsApp Number</label>
              <input
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full rounded-md border p-2 text-black font-medium"
                placeholder="+91 99999 00000"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-md border p-2 text-black font-medium"
                placeholder="info@property.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Head Office Address</label>
              <textarea 
                value={formData.headOffice} 
                onChange={(e) => setFormData({ ...formData, headOffice: e.target.value })}
                className="w-full rounded-lg border p-2 text-black font-medium"
                rows={2}
                placeholder="Main Sector, Gurugram, Haryana"
              />
              <p className="text-[10px] text-gray-400 italic font-medium">Main company headquarters address.</p>
            </div>
            <div className="space-y-2 pt-4 border-t border-dashed">
              <label className="text-sm font-bold flex items-center justify-between cursor-pointer">
                <span>Maintenance Mode (Turn off website)</span>
                <button 
                  type="button"
                  onClick={() => setFormData({ ...formData, maintenanceMode: !formData.maintenanceMode })}
                  className={`h-6 w-12 rounded-full transition-colors relative ${formData.maintenanceMode ? 'bg-red-600' : 'bg-gray-200'}`}
                >
                   <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${formData.maintenanceMode ? 'left-7' : 'left-1'}`} />
                </button>
              </label>
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500/60">When active, users will see a maintenance screen instead of the homepage.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-4">
        {success && (
          <span className="text-sm font-bold text-green-600 uppercase tracking-widest animate-pulse">
            Settings Saved!
          </span>
        )}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Settings
        </button>
      </div>
    </form>
  );
}
