import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PropertyForm from "@/components/admin/PropertyForm";

interface EditPropertyPageProps {
  params: Promise<{
    propertyId: string;
  }>;
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { propertyId } = await params;
  
  const property = await prisma.property.findUnique({
    where: { id: propertyId },
  });

  if (!property) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Edit Property</h2>
        <p className="text-gray-500">Modify existing property details.</p>
      </div>
      <PropertyForm initialData={property} />
    </div>
  );
}
