import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create Admin User
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@property.com" },
    update: {},
    create: {
      email: "admin@property.com",
      name: "Admin User",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log({ admin });

  // Create Default Settings
  const settings = await prisma.settings.upsert({
    where: { id: "global" },
    update: {},
    create: {
      id: "global",
      contactPhone: "+91 99999 00000",
      whatsapp: "+91 99999 00000",
      email: "info@property.com",
    },
  });

  // Create Default Areas (Districts)
  const haryanaDistricts = [
    "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", 
    "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", 
    "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", 
    "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", 
    "Sonipat", "Yamunanagar", "Hansi"
  ];

  for (const name of haryanaDistricts) {
    await prisma.area.upsert({
      where: { name },
      update: {
        showOnHome: true,
        isPopular: true, // Marking as popular as well for front page visibility
      },
      create: { 
        name, 
        state: "Haryana",
        showOnHome: true,
        isPopular: true
      },
    });
  }

  // Create Default Property Categories
  const defaultCategories = [
    { name: "FLAT", label: "Flat / Apartment" },
    { name: "PLOT", label: "Plot / Land" },
    { name: "VILLA", label: "Villa / Kothi" },
    { name: "HOUSE", label: "Independent House" },
    { name: "COMMERCIAL", label: "Commercial (Shop/Office)" },
    { name: "INDUSTRIAL", label: "Industrial" },
    { name: "FARMHOUSE", label: "Farmhouse" },
    { name: "AGRICULTURAL", label: "Agricultural Land" },
  ];
  for (const cat of defaultCategories) {
    await prisma.propertyCategory.upsert({
      where: { name: cat.name },
      update: { label: cat.label },
      create: cat,
    });
  }

  // Create some sample properties in Hisar
  const properties = [
    {
      title: "Luxury 3 BHK Flat in Hisar",
      slug: "luxury-3-bhk-flat-in-hisar",
      description: "Beautiful 3 BHK flat with modern amenities in the heart of Hisar.",
      city: "Hisar",
      locality: "Model Town",
      propertyType: "FLAT",
      bhk: 3,
      price: 4500000,
      priceCategory: "under-50-lakh",
      areaSqFt: 1500,
      featured: true,
      status: "ACTIVE",
      images: ["https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80"],
    },
    {
      title: "Commercial Plot in Hisar Sector 14",
      slug: "commercial-plot-hisar-sector-14",
      description: "Prime location commercial plot available for sale.",
      city: "Hisar",
      locality: "Sector 14",
      propertyType: "PLOT",
      price: 8500000,
      priceCategory: "50-lakh-to-1-crore",
      areaSqFt: 2500,
      featured: true,
      status: "ACTIVE",
      images: ["https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"],
    },
    {
      title: "Modern Villa in Hisar",
      slug: "modern-villa-in-hisar",
      description: "Spacious villa with a private garden.",
      city: "Hisar",
      locality: "PLA",
      propertyType: "VILLA",
      bhk: 4,
      price: 12000000,
      priceCategory: "above-1-crore",
      areaSqFt: 3500,
      featured: false,
      status: "ACTIVE",
      images: ["https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"],
    },
  ];

  for (const property of properties) {
    await prisma.property.upsert({
      where: { slug: property.slug },
      update: {},
      create: property,
    });
  }

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
