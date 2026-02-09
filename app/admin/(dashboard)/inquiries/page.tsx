"use client";

import { useEffect, useState } from "react";
import { Phone, Calendar, Building, Loader2, CheckCircle } from "lucide-react";

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    try {
      const response = await fetch("/api/inquiries");
      if (response.ok) {
        const data = await response.json();
        setInquiries(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  const onUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/inquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (response.ok) {
        setInquiries(inquiries.map((inq) => inq.id === id ? { ...inq, status } : inq));
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tighter">Inquiries</h2>
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest mt-1">Manage property inquiries and leads.</p>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-gray-100">
           {inquiries.map((inquiry) => (
             <div key={inquiry.id} className="p-4 space-y-4">
                <div className="flex justify-between items-start">
                   <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{inquiry.name}</span>
                      <a href={`tel:${inquiry.phone}`} className="flex items-center text-[10px] font-bold text-blue-600 mt-1">
                        <Phone className="h-2.5 w-2.5 mr-1" />
                        {inquiry.phone}
                      </a>
                   </div>
                   <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[8px] font-black uppercase tracking-widest ${
                      inquiry.type === 'PROPERTY' ? 'bg-purple-100 text-purple-800' :
                      inquiry.type === 'VISIT' ? 'bg-indigo-100 text-indigo-800' :
                      inquiry.type === 'LOAN' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-800'
                   }`}>
                     {inquiry.type}
                   </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="flex items-center text-xs font-black text-gray-900 uppercase tracking-tighter mb-1">
                      <Building className="h-3 w-3 mr-1.5 text-gray-400" />
                      {inquiry.property?.title || "General Inquiry"}
                   </div>
                    {inquiry.message && (
                      <p className="text-[10px] font-bold text-gray-400 line-clamp-3 italic leading-relaxed">
                        {inquiry.message}
                      </p>
                    )}
                </div>

                <div className="flex justify-between items-center">
                   <div className="flex items-center text-[8px] font-black text-gray-400 uppercase tracking-widest">
                      <Calendar className="h-2.5 w-2.5 mr-1" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                   </div>
                   <div className="flex items-center gap-3">
                      <span className={`text-[8px] font-black uppercase tracking-widest ${
                        inquiry.status === 'PENDING' ? 'text-amber-600' : 
                        inquiry.status === 'CONTACTED' ? 'text-blue-600' : 
                        'text-slate-600'
                      }`}>
                        {inquiry.status}
                      </span>
                      {inquiry.status === 'PENDING' ? (
                        <button 
                          onClick={() => onUpdateStatus(inquiry.id, 'CONTACTED')}
                          className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest shadow-md shadow-blue-500/20"
                        >
                          Mark Contacted
                        </button>
                      ) : inquiry.status === 'CONTACTED' && (
                        <button 
                          onClick={() => onUpdateStatus(inquiry.id, 'PENDING')}
                          className="text-[8px] font-black text-gray-400 uppercase tracking-widest underline"
                        >
                          Revert
                        </button>
                      )}
                   </div>
                </div>
             </div>
           ))}
           {inquiries.length === 0 && (
              <div className="p-8 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                 No inquiries found.
              </div>
           )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Client</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Type</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Property/Detail</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Date</th>
                <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-wider text-gray-400">Status</th>
                <th className="px-6 py-3 text-right text-[10px] font-black uppercase tracking-wider text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-black text-gray-900 uppercase tracking-tighter">{inquiry.name}</span>
                      <a href={`tel:${inquiry.phone}`} className="flex items-center text-[10px] font-bold text-blue-600 mt-1 hover:underline">
                        <Phone className="h-2.5 w-2.5 mr-1" />
                        {inquiry.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      inquiry.type === 'PROPERTY' ? 'bg-purple-100 text-purple-800' :
                      inquiry.type === 'VISIT' ? 'bg-indigo-100 text-indigo-800' :
                      inquiry.type === 'LOAN' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {inquiry.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col space-y-1">
                      <div className="flex items-center text-sm font-black text-gray-900 uppercase tracking-tighter">
                        <Building className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                        {inquiry.property?.title || "General Inquiry"}
                      </div>
                      {inquiry.message && (
                        <p className="text-[10px] font-bold text-gray-400 line-clamp-2 italic leading-relaxed max-w-xs">
                          {inquiry.message}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      <Calendar className="h-3 w-3 mr-1.5" />
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest ${
                      inquiry.status === 'PENDING' ? 'bg-amber-100 text-amber-800 border border-amber-200' : 
                      inquiry.status === 'CONTACTED' ? 'bg-blue-100 text-blue-800 border border-blue-200' : 
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {inquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    {inquiry.status === 'PENDING' && (
                      <button 
                        onClick={() => onUpdateStatus(inquiry.id, 'CONTACTED')}
                        className="inline-flex items-center text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors"
                      >
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Mark Contacted
                      </button>
                    )}
                    {inquiry.status === 'CONTACTED' && (
                      <button 
                        onClick={() => onUpdateStatus(inquiry.id, 'PENDING')}
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-600"
                      >
                        Revert
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {inquiries.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest italic">
                    No inquiries found. Real-time leads will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
