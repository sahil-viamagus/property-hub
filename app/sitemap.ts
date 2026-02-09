import { MetadataRoute } from "next";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { HARYANA_DISTRICTS } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Get all property slugs
  const properties = await prisma.property.findMany({
    select: { slug: true, updatedAt: true },
    where: { status: "ACTIVE" },
  });

  const propertyEntries = properties.map((p) => ({
    url: `${baseUrl}/property/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  // Fetch dynamic areas and categories for SEO routes
  const [areas, categories] = await Promise.all([
    prisma.area.findMany({ select: { name: true } }),
    prisma.propertyCategory.findMany({ select: { name: true } })
  ]);

  const districtRoutes = areas.flatMap((area: any) => {
    const dLower = area.name.toLowerCase();
    const typeRoutes = categories.map((cat: any) => `/properties/${dLower}/${cat.name.toLowerCase()}`);
    return [
      `/properties/${dLower}`,
      ...typeRoutes
    ];
  }).map((route: string) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  // Static routes
  const staticRoutes = [
    "",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...districtRoutes, ...propertyEntries];
}
