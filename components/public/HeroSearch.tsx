"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, MapPin, Building2, Map, Home as HomeIcon } from "lucide-react";
import { HARYANA_DISTRICTS } from "@/lib/constants";

interface HeroSearchProps {
  title?: string;
  subtitle?: string;
  popularDistricts?: string;
}

export default function HeroSearch({ title, subtitle, popularDistricts }: HeroSearchProps) {
  const [city, setCity] = useState("Hisar");
  const [districts, setDistricts] = useState<string[]>(HARYANA_DISTRICTS);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await fetch("/api/areas");
        const data = await response.json();
        if (Array.isArray(data)) {
          const districtNames = data.map((d: any) => d.name);
          setDistricts(districtNames);
        }
      } catch (error) {
        console.error("Failed to fetch districts from DB", error);
      }
    };
    fetchDistricts();
  }, []);

  const handleSearch = (val: string) => {
    setCity(val);
    if (val.length > 0) {
      const filtered = districts.filter(d => d.toLowerCase().includes(val.toLowerCase()));
      setSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
      <div className="mb-4 inline-flex items-center rounded-full bg-white/10 px-4 py-2 backdrop-blur-md border border-white/20">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Luxury Real Estate In Haryana</span>
      </div>
      <h1 className="mb-6 text-5xl font-black text-white sm:text-7xl md:text-9xl drop-shadow-2xl uppercase tracking-tighter leading-[0.85] px-2">
        {title ? (
          <>
            {title.split(" ").slice(0, -2).join(" ")} <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              {title.split(" ").slice(-2).join(" ")}
            </span>
          </>
        ) : (
          <>
            Find Your <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">Dream Space</span>
          </>
        )}
      </h1>
      <p className="mb-10 max-w-2xl px-4 text-sm font-medium text-gray-200 md:text-xl uppercase tracking-widest leading-relaxed opacity-80">
        {subtitle || "Curated Premium Properties Across Haryana's Most Elite Localities"}
      </p>
      
      <div className="flex w-full max-w-4xl flex-col gap-3 rounded-2xl bg-white/10 p-3 backdrop-blur-3xl md:flex-row shadow-2xl border border-white/10 mx-auto">
        <div className="relative flex-1 group">
          <MapPin className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-blue-400 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text" 
            value={city}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search District in Haryana (e.g. Gurugram, Hisar...)" 
            className="h-16 w-full rounded-2xl bg-white pl-12 pr-4 text-lg font-black text-black outline-none focus:ring-4 focus:ring-blue-500/20 transition-all uppercase tracking-tighter"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl bg-white p-2 shadow-2xl z-50 max-h-64 overflow-y-auto border border-gray-100">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setCity(s);
                    setShowSuggestions(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 text-sm font-black uppercase tracking-tighter text-gray-700 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
        <Link 
          href={`/properties/${city.toLowerCase()}`}
          className="flex h-16 items-center justify-center rounded-2xl bg-blue-600 px-12 text-lg font-black text-white transition-all hover:bg-blue-700 hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/30 uppercase tracking-[0.2em]"
        >
          EXPLORE
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-4 text-[10px] font-black text-white/60 uppercase tracking-widest">
        <span>Popular:</span>
        {(popularDistricts || "Hisar, Gurugram, Panchkula, Rohtak").split(",").map(d => (
          <Link key={d.trim()} href={`/properties/${d.trim().toLowerCase()}`} className="hover:text-blue-400 transition-colors border-b border-white/10 pb-0.5">
            {d.trim()}
          </Link>
        ))}
      </div>
    </div>
  );
}
