import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";
import PropertyCard from "@/components/public/PropertyCard";
import HeroSearch from "@/components/public/HeroSearch";
import Link from "next/link";
import { 
  Building2, 
  Map, 
  Home as HomeIcon, 
  MapPin, 
  ArrowRight, 
  ChevronRight, 
  Phone, 
  MessageCircle, 
  Mail 
} from "lucide-react";
import InquiryForm from "@/components/public/InquiryForm";

export default async function HomePage() {
  const [featuredProperties, districts, settings, popularDistricts] = await Promise.all([
    prisma.property.findMany({
      where: { featured: true, status: "ACTIVE" },
      take: 6,
      orderBy: { createdAt: "desc" },
    }),
    prisma.area.findMany({
      where: { showOnHome: true },
      orderBy: { order: "asc" }
    }),
    prisma.settings.findUnique({
      where: { id: "global" }
    }),
    prisma.area.findMany({
       where: { isPopular: true },
       select: { name: true }
    })
  ]);

  const popularNames = popularDistricts.map((d: { name: string }) => d.name).join(", ");

  if (settings?.maintenanceMode) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 text-center">
        <div className="mb-12 flex justify-center">
          <div className="bg-white/5 p-8 rounded-[3rem] border border-white/10 backdrop-blur-2xl animate-pulse">
            <Building2 className="h-20 w-20 text-blue-500" />
          </div>
        </div>
        <h1 className="text-5xl font-black text-white sm:text-7xl mb-6 uppercase tracking-tighter">System <br /><span className="text-blue-500">Upgrade</span></h1>
        <p className="max-w-md text-gray-400 font-medium uppercase tracking-[0.2em] text-[12px] opacity-80 leading-relaxed mb-12">
          {settings?.siteName} is currently undergoing a scheduled architectural refinement. We will be back shortly with a more elite experience.
        </p>
        <div className="flex flex-col items-center gap-6">
           <a href={`tel:${settings?.contactPhone}`} className="text-blue-500 font-black uppercase tracking-widest text-[10px] hover:text-white transition-all underline underline-offset-8">Critical Inquiries: {settings?.contactPhone}</a>
           <Link href="/admin/login" className="text-gray-800 text-[8px] font-black uppercase tracking-widest hover:text-gray-600">Administrative Access</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden bg-gray-900">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline
          className="h-full w-full object-cover opacity-40 scale-105"
        >
          <source src={settings?.heroVideoUrl || "https://assets.mixkit.co/videos/preview/mixkit-modern-architecture-of-a-house-1644-large.mp4"} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-950/20 to-gray-950/90" />
        <HeroSearch 
          title={settings?.heroTitle} 
          subtitle={settings?.heroSubtitle} 
          popularDistricts={popularNames}
        />
      </div>

      {/* Haryana Highlight */}
      <div className="bg-white py-14 border-b">
        <div className="mx-auto max-w-7xl px-4 flex flex-wrap justify-between items-center gap-8">
          <div className="flex flex-wrap gap-12 font-black uppercase tracking-[0.2em] text-[10px] text-gray-400">
            <div className="flex items-center"><MapPin className="mr-2 h-3 w-3 text-blue-500" /> State-wide coverage</div>
            <div className="flex items-center"><Building2 className="mr-2 h-3 w-3 text-emerald-500" /> Premium Listings</div>
            <div className="flex items-center"><HomeIcon className="mr-2 h-3 w-3 text-amber-500" /> RERA Approved</div>
          </div>
          <div className="hidden md:block">
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 italic">
              "Redefining real estate in North India"
            </span>
          </div>
        </div>
      </div>

      {/* Featured Properties */}
      <section className="mx-auto max-w-7xl px-4 py-32">
        <div className="mb-24 space-y-4 text-center">
            <span className="inline-block text-xs font-black uppercase tracking-[0.4em] text-blue-600">Selected Works</span>
            <h2 className="text-5xl font-black text-gray-900 sm:text-8xl uppercase tracking-tighter leading-none">Elite <br />Listings</h2>
            <div className="h-1.5 w-24 bg-blue-600 mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property: any) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        {featuredProperties.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] shadow-sm border border-gray-100">
            <p className="text-sm font-black text-gray-400 uppercase tracking-widest">Awaiting new collections...</p>
          </div>
        )}

        <div className="mt-24 text-center">
          <Link href="/properties/haryana" className="group inline-flex items-center rounded-full bg-gray-900 px-12 py-6 text-xs font-black text-white uppercase tracking-[0.3em] transition-all hover:bg-black hover:scale-105 active:scale-95 shadow-2xl">
            Explore All Properties
            <ArrowRight className="ml-4 h-4 w-4 transition-transform group-hover:translate-x-3" />
          </Link>
        </div>
      </section>

      {/* District Grid Section */}
      <section className="bg-gray-950 py-40 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 blur-[120px] rounded-full -mr-48 -mt-48"></div>
        <div className="mx-auto max-w-7xl px-4 relative z-10">
           <div className="mb-24 flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-white/10 pb-16">
              <h2 className="text-5xl font-black uppercase tracking-tighter sm:text-7xl leading-none">Haryana <br /><span className="text-blue-500">Districts</span></h2>
              <p className="max-w-md text-gray-400 font-medium text-base leading-relaxed uppercase tracking-wider opacity-80">We offer curated real estate solutions spanning across all major administrative zones of the state.</p>
           </div>
           
           <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
              {districts.map((area: any) => (
                <Link 
                  key={area.id} 
                  href={`/properties/${area.name.toLowerCase()}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all hover:bg-white/5 hover:border-blue-500/30"
                >
                   <Map className="mb-6 h-6 w-6 text-blue-500 transition-transform group-hover:scale-125" />
                   <h3 className="text-sm font-black uppercase tracking-widest group-hover:text-blue-400 transition-colors leading-tight">{area.name}</h3>
                   <div className="mt-4 flex items-center text-[10px] font-bold text-gray-600 group-hover:text-gray-400">
                      View Listings <ChevronRight className="h-3 w-3 ml-1" />
                   </div>
                </Link>
              ))}
           </div>
           
           <div className="mt-20 text-center">
              <Link href="/locations" className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white underline underline-offset-8">Browse Complete Infrastructure Network</Link>
           </div>
        </div>
      </section>

      {/* Connect Section - High Visibility Version */}
      <section id="connect" className="py-40 bg-gray-950 relative overflow-hidden text-white">
         <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/10 via-transparent to-transparent opacity-50"></div>
         <div className="mx-auto max-w-5xl px-4 text-center relative z-10">
            <div className="mb-12 inline-block rounded-full bg-blue-600/10 px-6 py-2 border border-blue-500/20">
               <span className="text-xs font-black text-blue-400 uppercase tracking-[0.4em] block">Get In Touch</span>
            </div>
            <h2 className="text-5xl font-black text-white sm:text-7xl mb-16 uppercase tracking-tighter leading-none">Connect <br /><span className="text-blue-500">With Us</span></h2>
            
            <div className="flex flex-col lg:flex-row gap-16 items-start">
               {/* Contact Info Cards */}
               <div className="w-full lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-xl group relative overflow-hidden text-left">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 text-blue-500">
                        <MapPin className="h-24 w-24 -mr-8 -mt-8" />
                     </div>
                     <MapPin className="h-8 w-8 mb-6 text-blue-500" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Head Office</p>
                     <p className="font-black text-xl tracking-tighter leading-tight">{settings?.headOffice || "Gurugram, Haryana"}</p>
                  </div>

                  <a href={`tel:${settings?.contactPhone}`} className="p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-xl hover:bg-blue-600 hover:border-blue-500 transition-all group relative overflow-hidden text-left">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                        <Phone className="h-24 w-24 -mr-8 -mt-8" />
                     </div>
                     <Phone className="h-8 w-8 mb-6 text-blue-500 group-hover:text-white transition-colors" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white/60 mb-2">Voice Call</p>
                     <p className="font-black text-xl tracking-tighter">{settings?.contactPhone || "+91 99999 00000"}</p>
                  </a>

                  <a href={`https://wa.me/${settings?.whatsapp?.replace(/\D/g, "")}`} className="p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-xl hover:bg-emerald-600 hover:border-emerald-500 transition-all group relative overflow-hidden text-left">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                        <MessageCircle className="h-24 w-24 -mr-8 -mt-8" />
                     </div>
                     <MessageCircle className="h-8 w-8 mb-6 text-emerald-500 group-hover:text-white transition-colors" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white/60 mb-2">WhatsApp</p>
                     <p className="font-black text-xl tracking-tighter">Direct Chat</p>
                  </a>

                  <a href={`mailto:${settings?.email}`} className="p-10 rounded-[3rem] border border-white/5 bg-white/5 backdrop-blur-xl hover:bg-white hover:text-black transition-all group relative overflow-hidden text-left">
                     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                        <Mail className="h-24 w-24 -mr-8 -mt-8" />
                     </div>
                     <Mail className="h-8 w-8 mb-6 text-gray-400 group-hover:text-black transition-colors" />
                     <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 group-hover:text-black/40 mb-2">Official Email</p>
                     <p className="font-black text-xl tracking-tighter overflow-hidden text-ellipsis whitespace-nowrap">{settings?.email || "info@property.com"}</p>
                  </a>
               </div>

               {/* Inquiry Form */}
               <div className="w-full lg:w-1/3">
                  <InquiryForm fixedInquiryType="GENERAL" />
               </div>
            </div>
         </div>
      </section>

      {/* Footer Branding - High Visibility Version */}
      <footer className="bg-gray-950 py-32 text-center relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent"></div>
        <div className="mx-auto max-w-7xl px-4 relative z-10">
          <div className="mb-10 flex justify-center">
            <div className="bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
              <Building2 className="h-12 w-12 text-blue-500" />
            </div>
          </div>
          <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter text-white">
            {settings?.siteName?.split(" ").slice(0, -1).join(" ")} <span className="text-blue-500">{settings?.siteName?.split(" ").slice(-1)}</span>
          </h2>
          <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.6em] mb-16 italic opacity-60">"Integrity. Luxury. Scale."</p>
          
          <div className="flex flex-wrap justify-center gap-x-16 gap-y-6 mb-24">
            <Link href="/admin/dashboard" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">Admin Console</Link>
            <Link href="/locations" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">Visual Sitemap</Link>
            <a href="#connect" className="text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-500 transition-colors">Connect</a>
          </div>
          
          <div className="pt-16 border-t border-white/5 text-[10px] font-black text-gray-600 uppercase tracking-widest">
            © 2026 {settings?.siteName || "Propery Management Hub"} • All Rights Reserved
          </div>
        </div>
      </footer>
    </div>
  );
}
