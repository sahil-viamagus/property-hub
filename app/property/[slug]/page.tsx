import { Metadata } from "next";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import InquiryForm from "@/components/public/InquiryForm";
import ContactReveal from "@/components/public/ContactReveal";
import PropertyGallery from "@/components/public/PropertyGallery";
import ShareButton from "@/components/public/ShareButton";
import Link from "next/link";
import { 
  MapPin, 
  Maximize, 
  Building2, 
  Bed, 
  Calendar, 
  CheckCircle,
  Phone,
  MessageCircle,
  ChevronLeft
} from "lucide-react";

interface PropertyPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PropertyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await prisma.property.findUnique({
    where: { slug },
  });

  if (!property) return { title: "Property Not Found" };

  const areaText = `${property.locality}, ${property.city}`;
  return {
    title: `Buy ${property.title} in ${areaText} | Premium Real Estate Haryana`,
    description: `Explore this exclusive ${property.propertyType} in ${areaText}. ${property.description.substring(0, 140)}... Contact for price and site visit.`,
    keywords: [`properties in ${property.city}`, `real estate ${property.city}`, `buy ${property.propertyType}`, property.locality, 'property hub haryana'],
    openGraph: {
      title: `${property.title} - ${areaText}`,
      description: property.description.substring(0, 160),
      images: [property.images[0]],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyPageProps) {
  const { slug } = await params;
  
  const [property, settings] = await Promise.all([
    prisma.property.findUnique({
      where: { slug },
    }),
    prisma.settings.findUnique({
      where: { id: "global" },
    }),
  ]);

  if (!property) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "name": property.title,
    "description": property.description,
    "url": `${process.env.NEXT_PUBLIC_APP_URL}/property/${property.slug}`,
    "image": property.images,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.locality,
      "addressRegion": property.city,
      "addressCountry": "IN"
    },
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Navigation & Header */}
      <div className="bg-white border-b sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
           <Link 
             href={`/properties/${property.city.toLowerCase()}`} 
             className="group flex items-center text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-colors"
           >
              <ChevronLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to {property.city} Listings
           </Link>
           <div className="hidden sm:flex items-center gap-4">
              <ShareButton title={property.title} />
           </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Gallery - Fixed Layout to prevent overlap */}
      <div className="mx-auto max-w-7xl px-4 pt-12">
        <PropertyGallery images={property.images} title={property.title} />
      </div>

      <div className="mx-auto max-w-7xl px-4 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Info */}
          <div className="flex-1 space-y-10">
            <div>
              <div className="mb-4 flex items-center space-x-2">
                <span className="rounded-full bg-blue-100 px-4 py-1 text-xs font-black text-blue-700 uppercase tracking-widest">
                  {property.propertyType}
                </span>
                {property.status === "SOLD" && (
                  <span className="rounded-full bg-red-100 px-4 py-1 text-xs font-black text-red-700 uppercase tracking-widest">
                    SOLD
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-black text-gray-900 sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                {property.title}
              </h1>
              <div className="mt-6 flex items-center text-xl font-bold text-gray-500">
                <MapPin className="mr-2 h-6 w-6 text-blue-600" />
                {property.locality}, {property.city}
              </div>
              <div className="mt-8 text-4xl font-black text-blue-600">
                {formatPrice(property.price)}
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 border-y border-gray-100 py-10">
              <div className="flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-gray-50 border border-gray-100 transition-all hover:bg-blue-50 hover:border-blue-100">
                <Bed className="mb-3 h-8 w-8 text-blue-600" />
                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-1">{property.bhk ? `${property.bhk} BHK` : 'N/A'}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-gray-50 border border-gray-100 transition-all hover:bg-blue-50 hover:border-blue-100">
                <Maximize className="mb-3 h-8 w-8 text-blue-600" />
                <span className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-1">{property.areaSqFt} <span className="text-xs">Sq.Ft</span></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Area</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Building2 className="mb-2 h-6 w-6 text-blue-600" />
                <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{property.propertyType}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</span>
              </div>
              <div className="flex flex-col items-center justify-center text-center p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <Calendar className="mb-2 h-6 w-6 text-blue-600" />
                <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{new Date(property.createdAt).getFullYear()}</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Listed</span>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4">Description</h2>
              <p className="text-lg leading-relaxed text-gray-600 font-medium whitespace-pre-wrap">
                {property.description}
              </p>
            </div>
            
            <div className="pt-10 border-t border-gray-100 mb-10">
              <h2 className="text-2xl font-black text-gray-900 mb-6 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4">Location</h2>
              <div className="space-y-6">
                 <div className="flex items-center text-lg font-bold text-gray-700">
                    <MapPin className="mr-2 h-5 w-5 text-blue-600" />
                    {property.locality}, {property.city}
                 </div>
                 <div className="w-full h-80 rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative bg-gray-50">
                    <iframe
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      marginHeight={0}
                      marginWidth={0}
                      src={`https://maps.google.com/maps?q=${property.latitude && property.longitude ? `${property.latitude},${property.longitude}` : encodeURIComponent(property.locality + ", " + property.city)}&hl=en&z=14&ie=UTF8&iwloc=B&output=embed`}
                      className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-500"
                      title="Property Location"
                      loading="lazy"
                    ></iframe>
                 </div>
              </div>
            </div>
            <div className="rounded-3xl bg-gray-50 border border-gray-100 p-8 shadow-sm relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-2xl font-black mb-6 uppercase tracking-tight text-gray-900 border-l-4 border-blue-600 pl-4">Contact Agent</h3>
                  <ContactReveal 
                    phone={settings?.contactPhone || "+91 99999 00000"} 
                    email={settings?.email || "info@property.com"}
                    whatsapp={settings?.whatsapp || "+919999900000"}
                  />
               </div>
               <Building2 className="absolute -right-10 -bottom-10 h-64 w-64 text-blue-600/5 rotate-12" />
            </div>
          </div>

          {/* Sidebar Inquiry */}
          <div className="w-full lg:w-[400px] relative z-20">
            <div className="lg:sticky lg:top-24">
               <InquiryForm propertyId={property.id} />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Actions - Offset to prevent overlap with content */}
      <div className="fixed bottom-6 left-1/2 z-[60] flex w-[92%] -translate-x-1/2 gap-3 lg:hidden">
        <a 
          href={`tel:${settings?.contactPhone || "+919999900000"}`} 
          className="flex flex-1 items-center justify-center rounded-2xl bg-gray-900 py-5 text-[11px] font-black text-white uppercase tracking-widest shadow-2xl border border-white/10 backdrop-blur-md"
        >
          <Phone className="mr-2 h-4 w-4" /> Call
        </a>
        <a 
          href={`https://wa.me/${(settings?.whatsapp || "919999900000").replace(/\D/g, "")}`} 
          target="_blank"
          className="flex flex-1 items-center justify-center rounded-2xl bg-emerald-600 py-5 text-[11px] font-black text-white uppercase tracking-widest shadow-2xl border border-white/10"
        >
          <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
