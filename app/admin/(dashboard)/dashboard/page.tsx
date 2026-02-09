import { 
  Building2, 
  MessageSquare, 
  Users, 
  TrendingUp 
} from "lucide-react";
import prisma from "@/lib/prisma";

async function getStats() {
  const propertyCount = await prisma.property.count();
  const inquiryCount = await prisma.inquiry.count();
  const soldCount = await prisma.property.count({
    where: { status: "SOLD" }
  });

  return [
    { label: "Total Properties", value: propertyCount, icon: Building2, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Total Inquiries", value: inquiryCount, icon: MessageSquare, color: "text-green-600", bg: "bg-green-100" },
    { label: "Properties Sold", value: soldCount, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  ];
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Overview</h2>
        <p className="text-gray-500">Welcome to your real estate management dashboard.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="flex items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100">
              <div className={`${stat.bg} rounded-lg p-3 mr-4`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="flex space-x-4">
          <a 
            href="/admin/properties/add" 
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            Add New Property
          </a>
          <a 
            href="/admin/inquiries" 
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            View Inquiries
          </a>
        </div>
      </div>
    </div>
  );
}
