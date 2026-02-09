"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IndianRupee } from "lucide-react";

export default function PriceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (minPrice) params.set("minPrice", minPrice);
    else params.delete("minPrice");

    if (maxPrice) params.set("maxPrice", maxPrice);
    else params.delete("maxPrice");

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm space-y-4">
      <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center">
        <IndianRupee className="h-3 w-3 mr-2" /> Price Range (INR)
      </h3>
      <div className="space-y-4">
        <div>
           <label className="text-[10px] font-bold text-gray-500 uppercase">Min Price</label>
           <input 
             type="number"
             value={minPrice}
             onChange={(e) => setMinPrice(e.target.value)}
             className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors"
             placeholder="Min"
           />
        </div>
        <div>
           <label className="text-[10px] font-bold text-gray-500 uppercase">Max Price</label>
           <input 
             type="number"
             value={maxPrice}
             onChange={(e) => setMaxPrice(e.target.value)}
             className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold focus:outline-none focus:border-blue-500 transition-colors"
             placeholder="Max"
           />
        </div>
        <button 
          onClick={handleApply}
          className="w-full py-3 bg-gray-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-black transition-colors"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
