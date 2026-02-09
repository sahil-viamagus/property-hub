import { Metadata } from "next";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import PropertyCard from "@/components/public/PropertyCard";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { ChevronRight, Filter, SlidersHorizontal, Map as MapIcon } from "lucide-react";
import PriceFilter from "@/components/public/PriceFilter";

interface PropertiesPageProps {
  params: Promise<{
    city: string;
    filters?: string[];
  }>;
  searchParams: Promise<{
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export async function generateMetadata({ params }: PropertiesPageProps): Promise<Metadata> {
  const { city, filters } = await params;
  const propertyType = filters?.[0] || "";
  
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const title = propertyType 
    ? `Premium ${propertyType}s for Sale in ${cityName} | Real Estate Hub`
    : `Residential & Commercial Properties for Sale in ${cityName}, Haryana`;

  return {
    title: title,
    description: `Discover the best real estate listings in ${cityName}. Browse flats, plots, and villas with verified details. Top properties in ${cityName}, Haryana.`,
    keywords: [`properties in ${city}`, `buy flats in ${city}`, `real estate ${city}`, `plots for sale in ${city}`, 'haryana real estate'],
  };
}

export default async function PropertiesPage({ params, searchParams }: PropertiesPageProps) {
  const { city, filters } = await params;
  const query = await searchParams;
  const isStateWide = city.toLowerCase() === "haryana";
  const propertyType = filters?.[0]?.toUpperCase();
  const budgetCategory = filters?.[1];

  const minPrice = query.minPrice ? parseInt(query.minPrice) : undefined;
  const maxPrice = query.maxPrice ? parseInt(query.maxPrice) : undefined;

  const properties = await prisma.property.findMany({
    where: {
      ...(isStateWide ? {} : { city: { equals: city, mode: "insensitive" } }),
      status: "ACTIVE",
      ...(propertyType ? { propertyType: { equals: propertyType, mode: "insensitive" } } : {}),
      ...(budgetCategory ? { priceCategory: budgetCategory } : {}),
      ...(minPrice || maxPrice ? {
        price: {
            ...(minPrice ? { gte: minPrice } : {}),
            ...(maxPrice ? { lte: maxPrice } : {})
        }
      } : {}),
    },
    orderBy: { createdAt: "desc" },
  });

  const categories = await prisma.propertyCategory.findMany({ orderBy: { label: "asc" } });

  return (
    <div className="min-h-screen bg-[#fcfcfc] pb-24">
      {/* Dynamic Header with SEO Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-12 shadow-sm">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-6">
            <Link href="/" className="hover:text-blue-600 transition-colors">Haryana</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/properties/${city}`} className="text-gray-900">{city}</Link>
            {filters?.map((f) => (
              <div key={f} className="flex items-center space-x-3">
                <ChevronRight className="h-3 w-3" />
                <span className="text-blue-600">{f.replace(/-/g, " ")}</span>
              </div>
            ))}
          </nav>
          <h1 className="text-5xl font-black text-gray-950 sm:text-7xl tracking-tighter uppercase leading-none">
            {propertyType ? propertyType : "ALL"} PROPERTIES <br />
            <span className="text-blue-600">IN {city.toUpperCase()}</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Quick Filter Sidebar */}
          <aside className="w-full lg:w-72 space-y-10">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center">
                <Filter className="h-3 w-3 mr-2 text-blue-500" /> Filter by Type
              </h3>
              <div className="flex flex-wrap lg:flex-col gap-2">
                <Link 
                  href={`/properties/${city}`}
                  className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${!propertyType ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border border-gray-100 text-gray-500 hover:border-blue-200'}`}
                >
                  All Categories
                </Link>
                {categories.map((cat: any) => (
                  <Link 
                    key={cat.id}
                    href={`/properties/${city}/${cat.name.toLowerCase()}`}
                    className={`px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${propertyType === cat.name.toUpperCase() ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'bg-white border border-gray-100 text-gray-500 hover:border-blue-200'}`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>
            </div>

            <PriceFilter />

            <div className="p-8 rounded-[2rem] bg-gray-950 text-white relative overflow-hidden">
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2">Expert Help</p>
                  <h4 className="font-black text-xl mb-6 tracking-tighter">Need a custom viewing?</h4>
                  <a href="/#connect" className="inline-block text-[10px] font-black uppercase tracking-widest border-b-2 border-blue-600 pb-1">Contact Agent</a>
               </div>
               <SlidersHorizontal className="absolute -right-6 -bottom-6 h-24 w-24 text-white/5 rotate-12" />
            </div>
          </aside>

          {/* Results Grid */}
          <div className="flex-1">
            <div className="mb-10 flex items-center justify-between border-b border-gray-100 pb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">
                Found {properties.length} Elite Listings
              </span>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 border border-gray-100">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Live</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
              {properties.map((property: any) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            {properties.length === 0 && (
              <div className="text-center py-40 bg-white rounded-[3rem] shadow-sm border border-dashed border-gray-200">
                <MapIcon className="mx-auto h-16 w-16 text-gray-200 mb-8" />
                <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter uppercase">No Match Found</h3>
                <p className="text-gray-500 font-medium mb-10">We are constantly updating our portfolio. Please check back soon or clear filters.</p>
                <Link 
                  href={`/properties/${city}`}
                  className="inline-block rounded-full bg-gray-950 px-10 py-5 text-[10px] font-black text-white uppercase tracking-widest shadow-2xl"
                >
                  Clear All Filters
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON-LD Structured Data for Real Estate Listings */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "itemListElement": properties.map((p, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "url": `https://propertyhubharyana.com/property/${p.slug}`,
              "name": p.title,
              "description": p.description,
            }))
          })
        }}
      />
    </div>
  );
}
