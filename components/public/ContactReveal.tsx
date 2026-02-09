"use client";

import { useState } from "react";
import { Phone, Mail, MessageCircle, ChevronRight, Eye } from "lucide-react";

interface ContactRevealProps {
  phone: string;
  email: string;
  whatsapp: string;
}

export default function ContactReveal({ phone, email, whatsapp }: ContactRevealProps) {
  const [showPhone, setShowPhone] = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  return (
    <div className="space-y-4">
      <div 
        className="group relative overflow-hidden rounded-2xl bg-blue-600 p-1 transition-all hover:shadow-xl hover:shadow-blue-500/20"
        onMouseEnter={() => setShowPhone(true)}
        onMouseLeave={() => setShowPhone(false)}
      >
        <div className="flex items-center justify-between rounded-xl bg-blue-600 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-white/20 p-2">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-blue-100">Call Agent</p>
              <p className="text-sm font-black tracking-tighter sm:text-lg">
                {showPhone ? phone : "••••••••••"}
              </p>
            </div>
          </div>
          {!showPhone && (
            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-blue-200">
              <Eye className="mr-1 h-3 w-3" /> Hover to Reveal
            </div>
          )}
          {showPhone && (
            <a 
              href={`tel:${phone}`}
              className="rounded-lg bg-white px-3 py-1.5 text-[10px] font-black uppercase text-blue-600 transition-transform hover:scale-105 active:scale-95"
            >
              Call Now
            </a>
          )}
        </div>
      </div>

      <div 
        className="group relative overflow-hidden rounded-2xl bg-gray-900 p-1 transition-all hover:shadow-xl hover:shadow-gray-900/20"
        onMouseEnter={() => setShowEmail(true)}
        onMouseLeave={() => setShowEmail(false)}
      >
        <div className="flex items-center justify-between rounded-xl bg-gray-900 px-6 py-4 text-white">
          <div className="flex items-center space-x-3">
            <div className="rounded-lg bg-white/10 p-2">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Official Email</p>
              <p className="text-sm font-black tracking-tighter sm:text-lg">
                {showEmail ? email : "•••••••••••••••"}
              </p>
            </div>
          </div>
          {!showEmail && (
            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
              <Eye className="mr-1 h-3 w-3" /> Hover to Reveal
            </div>
          )}
          {showEmail && (
            <a 
              href={`mailto:${email}`}
              className="rounded-lg bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase text-white transition-all hover:bg-white/20"
            >
              Mail Agent
            </a>
          )}
        </div>
      </div>

      <a 
        href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-between rounded-2xl border-2 border-green-100 bg-green-50 px-6 py-4 text-green-700 transition-all hover:bg-green-100 hover:shadow-lg hover:shadow-green-500/10"
      >
        <div className="flex items-center space-x-3">
          <div className="rounded-lg bg-green-600 p-2 text-white">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-green-600/60">WhatsApp Lead</p>
            <p className="text-lg font-black tracking-tighter">Chat on WhatsApp</p>
          </div>
        </div>
        <ChevronRight className="h-5 w-5" />
      </a>
    </div>
  );
}
