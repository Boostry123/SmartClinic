import React, { useRef } from "react";

interface ImagePickerProps {
  preview: string | null;
  error: string | null;
  onFileSelect: (file: File | null) => void;
  onClear: () => void;
  label?: string;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  preview,
  error,
  onFileSelect,
  onClear,
  label = "",
}: ImagePickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onFileSelect(file);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        maxWidth: "300px",
      }}
    >
      <label style={{ fontWeight: "bold" }}>{label}</label>

      <div
        onClick={() => inputRef.current?.click()}
        style={{
          width: "100%",
          height: "200px",
          border: "2px dashed #ccc",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          overflow: "hidden",
          backgroundColor: "#f9f9f9",
        }}
      >
        {preview ? (
          <img
            src={preview}
            alt="Preview"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <span style={{ color: "#666" }}>Click to select an image</span>
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={handleChange}
        accept="image/*"
        style={{ display: "none" }}
      />

      {error && (
        <p style={{ color: "red", fontSize: "14px", margin: 0 }}>{error}</p>
      )}

      {preview && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          style={{
            padding: "8px",
            cursor: "pointer",
            backgroundColor: "#ff4d4d",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          Remove Image
        </button>
      )}
    </div>
  );
};
