"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Loader2 } from "lucide-react";
import { useCallback } from "react";

interface CloudinaryUploadProps {
  onUpload: (url: string) => void;
  disabled?: boolean;
}

export default function CloudinaryUpload({ onUpload, disabled }: CloudinaryUploadProps) {
  const onUploadSuccess = useCallback((result: any) => {
    if (result.info && result.info.secure_url) {
      onUpload(result.info.secure_url);
    }
  }, [onUpload]);

  return (
    <CldUploadWidget 
      onSuccess={onUploadSuccess}
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "property_uploads"}
    >
      {({ open }) => {
        return (
          <button
            type="button"
            disabled={disabled}
            onClick={() => open()}
            className="flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ImagePlus className="h-4 w-4" />
            Upload Image
          </button>
        );
      }}
    </CldUploadWidget>
  );
}
