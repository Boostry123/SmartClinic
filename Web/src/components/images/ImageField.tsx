import React, { useEffect, useRef } from "react";
//hooks
import { useImageUpload } from "../../hooks/useImageUploadOptions";
//components
import { ImagePicker } from "./ImagePicker";

interface ImageFieldProps {
  label: string;
  onImageChange: (file: File | null) => void;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  onImageChange,
}) => {
  const { file, preview, error, handleFileChange, clear } = useImageUpload({
    maxSizeMB: 2,
  });

  // Keep track of the last file sent to the parent
  const lastFileRef = useRef<File | null>(null);

  useEffect(() => {
    // Only update parent if the file identity actually changed
    if (file !== lastFileRef.current) {
      lastFileRef.current = file;
      onImageChange(file);
    }
  }, [file, onImageChange]);

  return (
    <ImagePicker
      preview={preview}
      error={error}
      onFileSelect={handleFileChange}
      onClear={clear}
      label={label}
    />
  );
};
