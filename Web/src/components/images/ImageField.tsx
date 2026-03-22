import React, { useEffect, useRef } from "react";
import { useImageUpload } from "../../hooks/useImageUploadOptions";
import { ImagePicker } from "./ImagePicker";

interface ImageFieldProps {
  label?: string;
  initialUrl?: string | null;
  onImageChange: (file: File | null) => void;
  disabled?: boolean;
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  initialUrl,
  onImageChange,
  disabled = false,
}) => {
  const { file, preview, error, handleFileChange, clear } = useImageUpload({
    maxSizeMB: 5,
  });

  const lastFileRef = useRef<File | null>(null);
  const displayPreview = preview || initialUrl || null;

  useEffect(() => {
    if (file !== lastFileRef.current) {
      lastFileRef.current = file;
      onImageChange(file);
    }
  }, [file, onImageChange]);

  return (
    <div className={disabled ? "pointer-events-none" : ""}>
      <ImagePicker
        label={label}
        preview={displayPreview}
        error={error}
        onFileSelect={disabled ? () => {} : handleFileChange}
        onClear={disabled ? () => {} : clear}
        disabled={disabled}
      />
    </div>
  );
};
