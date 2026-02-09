"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { inquirySchema } from "@/lib/validations";
import * as z from "zod";
import { Loader2, Send, CheckCircle2 } from "lucide-react";

type InquiryFormValues = z.infer<typeof inquirySchema>;

interface InquiryFormProps {
  propertyId?: string | null;
  fixedInquiryType?: string;
}

export default function InquiryForm({ propertyId, fixedInquiryType }: InquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<InquiryFormValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: {
      name: "",
      phone: "",
      type: (fixedInquiryType || "PROPERTY") as any,
      message: "",
      propertyId: propertyId || null,
    },
  });

  // Override type if fixed - run on mount or when prop changes
  if (fixedInquiryType && getValues("type") !== fixedInquiryType) {
     setValue("type", fixedInquiryType as any);
  }

  const onSubmit = async (data: InquiryFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-green-50 p-8 text-center border-2 border-green-100">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500 mb-4" />
        <h3 className="text-xl font-black text-gray-900 mb-2 uppercase tracking-tighter">Inquiry Sent!</h3>
        <p className="text-sm font-medium text-gray-600">Our agent will contact you shortly.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-8 shadow-2xl border border-gray-100 lg:sticky lg:top-10">
      <h3 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-[0.2em] border-l-4 border-blue-600 pl-4">Enquire Now</h3>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" {...register("propertyId")} />
        
        <div className="space-y-1.5 text-black">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inquiry Type</label>
          {fixedInquiryType ? (
             <div className="w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-3.5 text-sm font-bold text-gray-500 cursor-not-allowed">
                General Information
                <input type="hidden" {...register("type")} value={fixedInquiryType} />
             </div>
          ) : (
            <>
              <select
                {...register("type")}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-bold outline-none focus:border-blue-500 focus:bg-white transition-all appearance-none"
              >
                <option value="PROPERTY">Regarding this Property</option>
                <option value="VISIT">Schedule a Visit</option>
                <option value="LOAN">Home Loan Inquiry</option>
                <option value="GENERAL">General Information</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.type && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.type.message}</p>}
            </>
          )}
        </div>

        <div className="space-y-1.5 text-black">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Full Name</label>
          <input
            {...register("name")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-bold placeholder:text-gray-300 outline-none focus:border-blue-500 focus:bg-white transition-all"
            placeholder="John Doe"
          />
          {errors.name && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.name.message}</p>}
        </div>

        <div className="space-y-1.5 text-black">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</label>
          <input
            {...register("phone")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-bold placeholder:text-gray-300 outline-none focus:border-blue-500 focus:bg-white transition-all"
            placeholder="+91 99999 00000"
          />
          {errors.phone && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5 text-black">
          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Message / Requirements</label>
          <textarea
            {...register("message")}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm font-bold placeholder:text-gray-300 outline-none focus:border-blue-500 focus:bg-white transition-all resize-none"
            placeholder="Tell us about your preferences (e.g., 3BHK Flat, Plot size, etc.)"
          />
          {errors.message && <p className="text-[10px] font-bold text-red-500 uppercase">{errors.message.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-4 text-xs font-black text-white uppercase tracking-[0.2em] shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Send className="mr-2 h-3 w-3" />
              Submit Inquiry
            </>
          )}
        </button>
      </form>
      <p className="mt-4 text-[10px] text-center font-bold text-gray-400 uppercase tracking-widest">
        Secure & Direct Communication
      </p>
    </div>
  );
}
