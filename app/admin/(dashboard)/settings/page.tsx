import prisma from "@/lib/prisma";
export const dynamic = "force-dynamic";
import SettingsForm from "@/components/admin/SettingsForm";

export default async function SettingsPage() {
  const settings = await prisma.settings.findUnique({
    where: { id: "global" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Application Settings</h2>
        <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Manage global contact information.</p>
      </div>
      <SettingsForm initialData={settings} />
    </div>
  );
}
