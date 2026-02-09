"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const MapComponent = dynamic(
  () => import("./MapComponents"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading Map...
      </div>
    )
  }
);

interface LocationPickerProps {
  latitude?: number | null;
  longitude?: number | null;
  locality?: string;
  city?: string;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ latitude, longitude, locality, city, onLocationChange }: LocationPickerProps) {
  const [mounted, setMounted] = useState(false);
  const [lastGeocodedAddress, setLastGeocodedAddress] = useState("");
  
  // Default to Gurugram center if no coordinates
  const center: [number, number] = [
    latitude || 28.4595,
    longitude || 77.0266
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Geocode address when it changes
  useEffect(() => {
    const address = `${locality || ""}, ${city || ""}`.trim().replace(/^,|,$/g, '');
    
    // Setup initial state if coordinates exist to prevent overwriting saved data on load
    if (latitude && longitude && !lastGeocodedAddress) {
      setLastGeocodedAddress(address);
      return;
    }

    // Don't search if address hasn't changed or is empty
    if (!address || address === lastGeocodedAddress) return;

    const timer = setTimeout(async () => {
      try {
        console.log("Geocoding address:", address);
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`, {
          headers: {
            'User-Agent': 'PropertyApp/1.0'
          }
        });
        const data = await response.json();
        if (data && data[0]) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          console.log("Geocode success:", lat, lon);
          onLocationChange(lat, lon);
          setLastGeocodedAddress(address);
        }
      } catch (error) {
        console.error("Geocoding failed", error);
      }
    }, 1000); // 1s debounce

    return () => clearTimeout(timer);
  }, [locality, city, onLocationChange, lastGeocodedAddress, latitude, longitude]);

  if (!mounted) {
    return (
      <div className="h-80 w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin mr-2" />
        Loading Map...
      </div>
    );
  }

  return (
    <div className="h-80 w-full rounded-lg overflow-hidden border z-0 relative">
      <MapComponent center={center} onLocationChange={onLocationChange} />
    </div>
  );
}
