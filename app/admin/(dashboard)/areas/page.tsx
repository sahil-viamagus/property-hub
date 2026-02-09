"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, MapPin, Loader2 } from "lucide-react";

export default function AdminAreasPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [newCity, setNewCity] = useState({
    name: "",
    type: "DISTRICT",
    order: 0,
    showOnHome: false,
    isPopular: false
  });

  const fetchAreas = async () => {
    try {
      const response = await fetch("/api/areas");
      if (response.ok) {
        const data = await response.json();
        // Sort by order initially
        setAreas(data.sort((a: any, b: any) => (a.order || 0) - (b.order || 0)));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  const onAddArea = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCity.name) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/areas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCity),
      });
      if (response.ok) {
        setNewCity({ name: "", type: "DISTRICT", order: 0, showOnHome: false, isPopular: false });
        fetchAreas();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const onToggleHome = async (area: any) => {
    try {
      const response = await fetch(`/api/areas/${area.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOnHome: !area.showOnHome }),
      });
      if (response.ok) fetchAreas();
    } catch (error) {
      console.error(error);
    }
  };

  const onTogglePopular = async (area: any) => {
    try {
      const response = await fetch(`/api/areas/${area.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPopular: !area.isPopular }),
      });
      if (response.ok) fetchAreas();
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateOrder = async (area: any, newOrder: string) => {
    try {
      const response = await fetch(`/api/areas/${area.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: newOrder }),
      });
      if (response.ok) fetchAreas();
    } catch (error) {
      console.error(error);
    }
  };

  const onDeleteArea = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      const response = await fetch(`/api/areas/${id}`, {
        method: "DELETE",
      });
      if (response.ok) fetchAreas();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Locations (Districts/Cities/Villages)</h2>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Manage where you list properties and control their display order.</p>
      </div>

      <div className="max-w-4xl bg-white p-6 rounded-xl border shadow-sm">
        <form onSubmit={onAddArea} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Name</label>
             <input
                value={newCity.name}
                onChange={(e) => setNewCity({ ...newCity, name: e.target.value })}
                placeholder="e.g. Hansi"
                className="w-full rounded-lg border p-2 text-black font-medium"
                required
              />
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</label>
             <select 
               value={newCity.type} 
               onChange={(e) => setNewCity({ ...newCity, type: e.target.value })}
               className="w-full rounded-lg border p-2 text-black font-medium"
             >
                <option value="DISTRICT">District</option>
                <option value="CITY">City</option>
                <option value="VILLAGE">Village</option>
             </select>
          </div>
          <div className="space-y-2">
             <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Priority Order</label>
             <input
                type="number"
                value={newCity.order}
                onChange={(e) => setNewCity({ ...newCity, order: parseInt(e.target.value) })}
                className="w-full rounded-lg border p-2 text-black font-medium"
              />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="flex h-10 items-center justify-center rounded-lg bg-blue-600 px-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Location
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="hidden md:flex bg-gray-100 p-4 rounded-xl items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
           <div className="flex-1">Location Details</div>
           <div className="w-32 text-center">Type</div>
           <div className="w-32 text-center">Order</div>
           <div className="w-32 text-center">Homepage?</div>
           <div className="w-32 text-center">Popular?</div>
           <div className="w-16"></div>
        </div>
        {areas.map((area) => (
          <div key={area.id} className="flex flex-col md:flex-row md:items-center p-4 bg-white rounded-xl border group hover:border-blue-500 transition-colors shadow-sm gap-4">
            <div className="flex-1 flex items-center">
              <MapPin className="h-5 w-5 text-gray-400 mr-3 group-hover:text-blue-500 shrink-0" />
              <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{area.name}</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 md:gap-0">
              <div className="md:w-32 flex flex-col md:items-center">
                 <label className="md:hidden text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Type</label>
                 <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-600 uppercase tracking-widest">{area.type}</span>
              </div>

              <div className="md:w-32 px-0 md:px-4 flex flex-col md:items-center">
                 <label className="md:hidden text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Order</label>
                 <input 
                   type="number" 
                   defaultValue={area.order}
                   onBlur={(e) => onUpdateOrder(area, e.target.value)}
                   className="w-16 md:w-full text-left md:text-center text-xs font-bold border-b border-gray-100 focus:border-blue-500 outline-none"
                 />
              </div>

              <div className="md:w-32 flex flex-col items-center">
                 <label className="md:hidden text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Home</label>
                 <button 
                   onClick={() => onToggleHome(area)}
                   className={`h-6 w-12 rounded-full transition-colors relative ${area.showOnHome ? 'bg-blue-600' : 'bg-gray-200'}`}
                 >
                    <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${area.showOnHome ? 'left-7' : 'left-1'}`} />
                 </button>
              </div>

              <div className="md:w-32 flex flex-col items-center">
                 <label className="md:hidden text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">Popular</label>
                 <button 
                   onClick={() => onTogglePopular(area)}
                   className={`h-6 w-12 rounded-full transition-colors relative ${area.isPopular ? 'bg-emerald-600' : 'bg-gray-200'}`}
                 >
                    <div className={`absolute top-1 h-4 w-4 bg-white rounded-full transition-all ${area.isPopular ? 'left-7' : 'left-1'}`} />
                 </button>
              </div>

              <div className="md:w-16 flex justify-end">
                <button
                  onClick={() => onDeleteArea(area.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
