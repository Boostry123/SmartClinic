import { useState, useCallback } from "react";

interface UseImageUploadOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const useImageUpload = (options: UseImageUploadOptions = {}) => {
  const {
    maxSizeMB = 5,
    allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  } = options;

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      setError(null);

      if (!selectedFile) {
        setFile(null);
        setPreview(null);
        return;
      }

      // Validation: File Type
      if (!allowedTypes.includes(selectedFile.type)) {
        setError(
          `Unsupported file type. Please use ${allowedTypes.join(", ")}`,
        );
        return;
      }

      // Validation: File Size
      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`File is too large. Max size is ${maxSizeMB}MB.`);
        return;
      }

      setFile(selectedFile);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    },
    [maxSizeMB, allowedTypes],
  );

  const clear = () => {
    setFile(null);
    setPreview(null);
    setError(null);
  };

  return { file, preview, error, handleFileChange, clear };
};
