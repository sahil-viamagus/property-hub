import PropertyForm from "@/components/admin/PropertyForm";

export default function AddPropertyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Add New Property</h2>
        <p className="text-gray-500">Create a new property listing for the public site.</p>
      </div>
      <PropertyForm />
    </div>
  );
}
