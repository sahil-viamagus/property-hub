"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Tag, Loader2 } from "lucide-react";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newLabel) return;
    setSubmitting(true);
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.toUpperCase(), label: newLabel }),
      });
      if (response.ok) {
        setNewName("");
        setNewLabel("");
        fetchCategories();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  const onDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure? Existing properties with this type might show raw ID if you delete their display label.")) return;
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setCategories(categories.filter((c) => c.id !== id));
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
      <div>
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Property Types</h2>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Define property categories like Flat, Villa, Shop, etc.</p>
      </div>

      <div className="max-w-xl bg-white p-6 rounded-xl border shadow-sm">
        <form onSubmit={onAddCategory} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Internal ID (e.g. SHOP)"
              className="rounded-lg border p-2 text-black font-medium uppercase"
              required
            />
            <input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Display Label (e.g. Retail Shop)"
              className="rounded-lg border p-2 text-black font-medium"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
            Add Category
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div key={cat.id} className="flex items-center justify-between p-4 bg-white rounded-xl border group hover:border-blue-500 transition-colors shadow-sm">
            <div className="flex items-center">
              <Tag className="h-5 w-5 text-gray-400 mr-3 group-hover:text-blue-500" />
              <div>
                <p className="text-sm font-black text-gray-900 uppercase tracking-tighter">{cat.label}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-0.5">{cat.name}</p>
              </div>
            </div>
            <button
              onClick={() => onDeleteCategory(cat.id)}
              className="p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 rounded-lg"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
