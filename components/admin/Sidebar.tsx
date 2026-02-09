"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Building2, 
  MessageSquare, 
  LogOut,
  Home,
  MapPin,
  Tag,
  Settings
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils"; // I'll create this utility

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/dashboard" },
  { icon: Building2, label: "Properties", href: "/admin/properties" },
  { icon: MessageSquare, label: "Inquiries", href: "/admin/inquiries" },
  { icon: MapPin, label: "Areas / Districts", href: "/admin/areas" },
  { icon: Tag, label: "Property Types", href: "/admin/categories" },
  { icon: Settings, label: "Settings", href: "/admin/settings" },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-72 flex-col bg-gray-900 text-white shadow-2xl relative z-30">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3 mb-1">
          <Building2 className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-black uppercase tracking-tighter">Propery Hub</span>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 italic">Elite Management</p>
      </div>

      <nav className="flex-1 space-y-1 p-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center rounded-xl px-4 py-3.5 text-sm font-bold tracking-tight transition-all duration-300",
                isActive 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                  : "text-gray-400 hover:bg-white/5 hover:text-white"
              )}
              onClick={onClose}
            >
              <Icon className={cn(
                "mr-3 h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                isActive ? "text-white" : "text-gray-500"
              )} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/5 space-y-4">
        <Link 
          href="/"
          className="group flex items-center rounded-xl px-4 py-3 text-sm font-bold text-gray-400 hover:bg-blue-600 hover:text-white transition-all shadow-lg shadow-transparent hover:shadow-blue-500/20"
        >
          <Home className="mr-3 h-5 w-5" />
          View Live Site
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="group flex w-full items-center rounded-xl px-4 py-3 text-sm font-bold text-gray-400 hover:bg-red-600/10 hover:text-red-500 transition-all border border-transparent hover:border-red-500/20"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout System
        </button>
        
        <div className="mt-4 p-4 rounded-2xl bg-white/5 border border-white/5">
           <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">System Core v2.0.4</span>
           </div>
        </div>
      </div>
    </div>
  );
}
