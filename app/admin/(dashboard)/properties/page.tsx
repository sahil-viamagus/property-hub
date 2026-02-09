"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Star, Building2, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminPropertiesPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const response = await fetch("/api/properties");
      if (response.ok) {
        const data = await response.json();
        setProperties(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  const onDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setProperties(properties.filter((p) => p.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onToggleFeatured = async (id: string, current: boolean) => {
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !current }),
      });
      if (response.ok) {
        setProperties(properties.map((p) => p.id === id ? { ...p, featured: !current } : p));
      }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Properties</h2>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Manage your property listings.</p>
        </div>
        <Link
          href="/admin/properties/add"
          className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-black text-white uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Property
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Property</th>
              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Location</th>
              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Price</th>
              <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Status</th>
              <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-wider text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {properties.map((property) => (
              <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 relative rounded overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                      {property.images[0] ? (
                        <img src={property.images[0]} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <Building2 className="h-full w-full p-2 text-gray-400" />
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-black text-gray-900 uppercase tracking-tighter flex items-center">
                        {property.title}
                        <button onClick={() => onToggleFeatured(property.id, property.featured)}>
                          <Star className={cn("ml-2 h-3 w-3 transition-colors", property.featured ? "text-yellow-500 fill-yellow-500" : "text-gray-300")} />
                        </button>
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{property.propertyType} • {property.bhk ? `${property.bhk} BHK` : 'N/A'}</div>
                    </div>
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">
                  {property.locality}, {property.city}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-black text-gray-900">
                  {formatPrice(property.price)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                    property.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {property.status}
                  </span>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium space-x-2">
                  <Link href={`/admin/properties/edit/${property.id}`} className="text-blue-600 hover:text-blue-900 inline-block transition-transform hover:scale-110">
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button 
                    onClick={() => onDelete(property.id)}
                    className="text-red-600 hover:text-red-900 inline-block transition-transform hover:scale-110"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {properties.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-xs font-bold text-gray-400 uppercase tracking-widest italic">
                  No properties found. Click "Add Property" to create one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Simple internal cn utility as it's a client component and we want to keep it self-contained or import from utils
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
