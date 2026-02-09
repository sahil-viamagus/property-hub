"use client";

import { useState } from "react";
import Sidebar from "@/components/admin/Sidebar";
import { Building2, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AdminLayoutClient({
  children,
  session
}: {
  children: React.ReactNode;
  session: any;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on path change (mobile)
  if (isSidebarOpen && typeof window !== "undefined") {
     // A simple effect could work better but this prevents flash
  }

  return (
    <div className="flex h-screen bg-blue-50/20 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Hidden on mobile unless open */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
        <button 
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-white md:hidden"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative w-full">
        <header className="flex h-20 items-center justify-between border-b bg-white/90 backdrop-blur-md px-4 md:px-10 relative z-20 shrink-0">
           <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsSidebarOpen(true)}
               className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg md:hidden"
             >
               <Menu className="h-6 w-6" />
             </button>
             <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hidden sm:block">Panel / <span className="text-gray-950 tracking-tighter text-base font-black">Administration</span></h1>
             <span className="text-gray-950 font-black tracking-tighter text-lg sm:hidden">Admin Panel</span>
           </div>

           <div className="flex items-center gap-4">
              <div className="text-right mr-4 md:block hidden">
                 <p className="text-xs font-black text-gray-900 leading-none mb-1">Elite Portal</p>
                 <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Connected: {session?.user?.name || "Admin"}</p>
              </div>
              <div className="h-10 w-10 rounded-2xl bg-gray-900 flex items-center justify-center border border-white/10 shadow-xl">
                 <Building2 className="h-5 w-5 text-blue-500" />
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[#f8fafc]">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
