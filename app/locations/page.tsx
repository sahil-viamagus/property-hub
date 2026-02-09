import prisma from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ChevronRight, Building2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function SitemapPage() {
  const [areas, categories] = await Promise.all([
    prisma.area.findMany({
      orderBy: { name: "asc" }
    }),
    prisma.propertyCategory.findMany({
      orderBy: { label: "asc" }
    })
  ]);

  const siteName = (await prisma.settings.findUnique({ where: { id: "global" } }))?.siteName || "Propery Hub Haryana";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-4">
           <Link href="/" className="inline-flex items-center text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 mb-8">
              <ChevronRight className="h-3 w-3 rotate-180 mr-2" /> Back to Home
           </Link>
           <h1 className="text-5xl font-black uppercase tracking-tighter sm:text-7xl">Browse <br /><span className="text-blue-500">Infrastructure</span></h1>
           <p className="mt-6 max-w-xl text-gray-400 font-medium uppercase tracking-widest text-[12px] opacity-80 leading-relaxed">
             Comprehensive directory of real estate nodes across the state of Haryana. 
             Explore districts, cities, and villages with curated elite property listings.
           </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          
          {/* Areas Section */}
          <div className="lg:col-span-2 space-y-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-blue-600 pl-4">Network Nodes</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-12">
              {["DISTRICT", "CITY", "VILLAGE"].map((type: string) => {
                const group = areas.filter((a: any) => a.type === type);
                if (group.length === 0) return null;
                
                return (
                  <div key={type} className="space-y-6">
                    <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 border-b pb-4">{type}S</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {group.map((area: any) => (
                        <Link 
                          key={area.id} 
                          href={`/properties/${area.name.toLowerCase()}`}
                          className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50/50 transition-all"
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-3 group-hover:text-blue-600" />
                            <span className="text-sm font-bold text-gray-900 group-hover:text-blue-700 transition-colors uppercase tracking-tight">{area.name}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Categories Section */}
          <div className="space-y-12">
            <h2 className="text-2xl font-black uppercase tracking-tighter border-l-4 border-emerald-600 pl-4">Segments</h2>
            <div className="space-y-6">
               <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400 border-b pb-4">Asset types</h3>
               <div className="grid grid-cols-1 gap-3">
                 {categories.map((cat: any) => (
                   <Link 
                     key={cat.id} 
                     href={`/properties/haryana/${cat.name.toLowerCase()}`}
                     className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
                   >
                     <div className="flex items-center">
                       <Building2 className="h-4 w-4 text-gray-400 mr-3 group-hover:text-emerald-600" />
                       <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-700 transition-colors uppercase tracking-tight">{cat.label}</span>
                     </div>
                     <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                   </Link>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>

      <footer className="bg-gray-50 py-24 border-t">
        <div className="mx-auto max-w-7xl px-4 text-center">
           <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">© 2026 {siteName}</p>
        </div>
      </footer>
    </div>
  );
}
