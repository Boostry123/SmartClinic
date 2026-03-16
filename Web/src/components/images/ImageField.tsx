import React, { useEffect, useRef } from "react";
import { useImageUpload } from "../../hooks/useImageUploadOptions";
import { ImagePicker } from "./ImagePicker";

interface ImageFieldProps {
  label?: string;
  initialUrl?: string | null; // This comes from your database (treatment_data)
  onImageChange: (file: File | null) => void;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  initialUrl,
  onImageChange,
}) => {
  const { file, preview, error, handleFileChange, clear } = useImageUpload({
    maxSizeMB: 5,
  });

  const lastFileRef = useRef<File | null>(null);

  // Determine what to show:
  // 1. The new local preview (if a file was just picked)
  // 2. OR the initial URL (if we are viewing an existing record)
  const displayPreview = preview || initialUrl || null;

  useEffect(() => {
    // Only update parent if the doctor actually picked a NEW file
    if (file !== lastFileRef.current) {
      lastFileRef.current = file;
      onImageChange(file);
    }
  }, [file, onImageChange]);

  return (
    <ImagePicker
      label={label}
      preview={displayPreview}
      error={error}
      onFileSelect={handleFileChange}
      onClear={clear}
    />
  );
};
