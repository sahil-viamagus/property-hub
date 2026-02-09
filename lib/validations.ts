import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  city: z.string().min(2, "City is required"),
  locality: z.string().min(2, "Locality is required"),
  propertyType: z.string().min(1, "Property type is required"),
  bhk: z.preprocess((val) => (val === "" || val === undefined || isNaN(Number(val)) ? null : Number(val)), z.number().nullable()) as unknown as z.ZodType<number | null>,
  price: z.number().min(0, "Price must be a positive number"),
  areaSqFt: z.number().min(0, "Area must be a positive number"),
  featured: z.boolean(),
  status: z.enum(["ACTIVE", "SOLD"]),
  images: z.array(z.string()).min(1, "At least one image is required"),
  latitude: z.preprocess((val) => (val === "" || val === undefined || isNaN(Number(val)) ? null : Number(val)), z.number().nullable().optional()),
  longitude: z.preprocess((val) => (val === "" || val === undefined || isNaN(Number(val)) ? null : Number(val)), z.number().nullable().optional()),
});

export const inquirySchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  type: z.enum(["PROPERTY", "GENERAL", "LOAN", "VISIT", "OTHER"]),
  message: z.string().optional(),
  propertyId: z.string().optional().nullable(),
});
