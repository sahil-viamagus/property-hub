import Link from "next/link";
import { MapPin, Home, Maximize, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    slug: string;
    price: number;
    city: string;
    locality: string;
    propertyType: string;
    bhk?: number | null;
    areaSqFt: number;
    images: string[];
    featured: boolean;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-md transition-all hover:-translate-y-1 hover:shadow-xl border border-gray-100 flex flex-col h-full uppercase-titles">
      <Link href={`/property/${property.slug}`} className="relative h-64 overflow-hidden block">
        <img 
          src={property.images[0] || "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80"} 
          alt={property.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {property.featured && (
          <div className="absolute top-4 left-4 rounded-full bg-blue-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
            FEATURED
          </div>
        )}
        <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 backdrop-blur-md px-3 py-1.5 text-sm font-bold text-white">
          {formatPrice(property.price)}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-2 flex items-center text-xs font-bold uppercase tracking-wider text-blue-600">
          {property.propertyType} {property.bhk ? `• ${property.bhk} BHK` : ""}
        </div>
        <Link href={`/property/${property.slug}`}>
          <h3 className="mb-2 text-xl font-bold text-gray-900 line-clamp-1 hover:text-blue-600 transition-colors">
            {property.title}
          </h3>
        </Link>
        <div className="mb-4 flex items-center text-sm text-gray-500">
          <MapPin className="mr-1 h-4 w-4 text-blue-500" />
          {property.locality}, {property.city}
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-sm font-medium text-gray-700">
          <div className="flex items-center">
            <Maximize className="mr-1.5 h-4 w-4 text-gray-400" />
            {property.areaSqFt} Sq. Ft.
          </div>
          <Link 
            href={`/property/${property.slug}`}
            className="rounded-full bg-gray-900 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-600"
          >
            VIEW DETAILS
          </Link>
        </div>
      </div>
    </div>
  );
}
