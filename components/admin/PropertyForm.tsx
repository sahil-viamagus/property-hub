"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema } from "@/lib/validations";
import * as z from "zod";
import { Loader2, Plus, X, MapPin } from "lucide-react";
import { useEffect } from "react";
import CloudinaryUpload from "./CloudinaryUpload";
import LocationPicker from "./LocationPicker";

type PropertyFormValues = z.infer<typeof propertySchema>;

interface PropertyFormProps {
  initialData?: any;
}

export default function PropertyForm({ initialData }: PropertyFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageInput, setImageInput] = useState("");
  const [areas, setAreas] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema as any),
    defaultValues: initialData || {
      title: "",
      description: "",
      city: "Gurugram",
      locality: "",
      propertyType: initialData?.propertyType || "FLAT",
      bhk: initialData?.bhk ?? "",
      price: initialData?.price || 0,
      areaSqFt: initialData?.areaSqFt || 0,
      images: initialData?.images || [],
      featured: initialData?.featured || false,
      status: initialData?.status || "ACTIVE",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [areasRes, catsRes] = await Promise.all([
          fetch("/api/areas"),
          fetch("/api/categories")
        ]);
        if (areasRes.ok) setAreas(await areasRes.json());
        if (catsRes.ok) setCategories(await catsRes.json());
      } catch (error) {
        console.error("Failed to fetch form data", error);
      } finally {
        setFetchingData(false);
      }
    };
    fetchData();
  }, []);

  // Sync propertyType once categories are loaded to prevent default mismatch
  useEffect(() => {
    if (initialData?.propertyType && categories.length > 0) {
      // Find matching category to be safe, though direct value works
      const exists = categories.some(c => c.name === initialData.propertyType);
      if (exists) {
        setValue("propertyType", initialData.propertyType);
      }
    }
  }, [categories, initialData, setValue]);

  const images = watch("images") || [];
  const [lat, lng, loc, cit] = watch(["latitude", "longitude", "locality", "city"]);

  const onSubmit = async (data: PropertyFormValues) => {
    setLoading(true);
    try {
      const url = initialData 
        ? `/api/properties/${initialData.id}` 
        : "/api/properties";
      
      const method = initialData ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        router.push("/admin/properties");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addImage = () => {
    if (imageInput) {
      setValue("images", [...images, imageInput]);
      setImageInput("");
    }
  };

  const removeImage = (index: number) => {
    setValue("images", images.filter((_: string, i: number) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Title</label>
          <input
            {...register("title")}
            className="w-full rounded-md border p-2 text-black"
            placeholder="e.g. 3 BHK Luxury Flat"
          />
          {errors.title && <p className="text-xs text-red-500">{errors.title.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Property Type</label>
          <select {...register("propertyType")} className="w-full rounded-md border p-2 text-black font-medium">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.label}</option>
            ))}
            {categories.length === 0 && <option value="">Loading categories...</option>}
          </select>
          {errors.propertyType && <p className="text-xs text-red-500">{errors.propertyType.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Price (INR)</label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className="w-full rounded-md border p-2 text-black"
          />
          {errors.price && <p className="text-xs text-red-500">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Area (Sq. Ft.)</label>
          <input
            type="number"
            {...register("areaSqFt", { valueAsNumber: true })}
            className="w-full rounded-md border p-2 text-black"
          />
          {errors.areaSqFt && <p className="text-xs text-red-500">{errors.areaSqFt.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">District (Haryana)</label>
          <select {...register("city")} className="w-full rounded-md border p-2 text-black font-medium">
            {areas.map((area) => (
              <option key={area.id} value={area.name}>{area.name}</option>
            ))}
            {areas.length === 0 && <option value="">Loading districts...</option>}
          </select>
          {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Locality</label>
          <input {...register("locality")} className="w-full rounded-md border p-2 text-black" placeholder="Model Town" />
          {errors.locality && <p className="text-xs text-red-500">{errors.locality.message}</p>}
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2 pt-4 border-t">
           <label className="text-sm font-medium flex items-center gap-2">
             <MapPin className="h-4 w-4 text-blue-600"/> Pin Location on Map
           </label>
           
           <LocationPicker 
             latitude={lat} 
             longitude={lng} 
             locality={loc}
             city={cit}
             onLocationChange={(newLat, newLng) => {
               setValue("latitude", newLat, { shouldValidate: true });
               setValue("longitude", newLng, { shouldValidate: true });
             }}
           />

           <div className="grid grid-cols-2 gap-4 mt-2">
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Latitude</label>
                <div className="p-2 bg-gray-50 border rounded text-xs font-mono">{lat ? lat.toFixed(6) : "Not Set"}</div>
                {/* Hidden input to ensure value is registered */}
                <input type="hidden" {...register("latitude")} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wider">Longitude</label>
                <div className="p-2 bg-gray-50 border rounded text-xs font-mono">{lng ? lng.toFixed(6) : "Not Set"}</div>
                 {/* Hidden input to ensure value is registered */}
                <input type="hidden" {...register("longitude")} />
              </div>
           </div>
           
           <p className="text-xs text-gray-400 italic">Drag the marker to pinpoint exact property location.</p>
        </div>

        {/* Conditional BHK Selection */}
        {!watch("propertyType")?.toLowerCase().includes("plot") && !watch("propertyType")?.toLowerCase().includes("agricultural") && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-sm font-medium">BHK</label>
            <input
              type="number"
              {...register("bhk", { valueAsNumber: true })}
              className="w-full rounded-md border p-2 text-black"
              placeholder="3"
            />
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mt-1 italic">Leave empty if not applicable</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select {...register("status")} className="w-full rounded-md border p-2 text-black font-bold">
            <option value="ACTIVE">Active</option>
            <option value="SOLD">Sold</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 pt-8">
          <input type="checkbox" {...register("featured")} id="featured" className="h-4 w-4 rounded border-gray-300" />
          <label htmlFor="featured" className="text-sm font-medium">Mark as Featured</label>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Description</label>
        <textarea
          {...register("description")}
          rows={4}
          className="w-full rounded-md border p-2 text-black"
          placeholder="Detailed description of the property..."
        />
        {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium">Images (URLs)</label>
        <div className="flex space-x-2">
          <input
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            className="flex-1 rounded-md border p-2 text-black"
            placeholder="https://images.unsplash.com/..."
          />
          <button
            type="button"
            onClick={addImage}
            className="bg-gray-100 p-2 rounded-md hover:bg-gray-200"
            title="Add URL manually"
          >
            <Plus className="h-5 w-5" />
          </button>
          
          <div className="border-l pl-2 ml-2">
             <CloudinaryUpload 
                 onUpload={(url) => setValue("images", [...images, url])} 
                 disabled={loading}
             />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((url: string, index: number) => (
            <div key={index} className="relative group rounded-lg overflow-hidden border h-24">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        {errors.images && <p className="text-xs text-red-500">{errors.images.message}</p>}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? "Save Changes" : "Add Property"}
        </button>
      </div>
    </form>
  );
}
