import React from "react";
import { Loader2, Camera, X } from "lucide-react";

interface ImagePickerProps {
  preview: string | null;
  error: string | null;
  onFileSelect: (file: File | null) => void;
  onClear: () => void;
  label?: string;
  isLoading?: boolean;
}

export const ImagePicker: React.FC<ImagePickerProps> = ({
  preview,
  error,
  onFileSelect,
  onClear,
  label = "",
  isLoading = false,
}) => {
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // When the preview URL changes (e.g. initial Signed URL arrives),
  // we start the local loading state.
  React.useEffect(() => {
    if (preview && preview.startsWith("http")) {
      setIsImageLoading(true);
    }
  }, [preview]);

  // Combine parent loading state with local image loading state
  const showSpinner = isLoading || isImageLoading;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-sm font-semibold text-slate-700">{label}</label>

      <div
        onClick={() => !isLoading && inputRef.current?.click()}
        className={`relative group aspect-video w-full rounded-xl border-2 border-dashed flex items-center justify-center overflow-hidden transition-all
          ${preview ? "border-indigo-200" : "border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer"}
          ${showSpinner ? "cursor-wait opacity-70" : ""}`}
      >
        {showSpinner && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50/50">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        )}

        {preview ? (
          <>
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
              // When the image finishes downloading, hide the spinner
              onLoad={() => setIsImageLoading(false)}
              onError={() => setIsImageLoading(false)}
            />

            {/* Hover Overlay - only show if NOT loading */}
            {!showSpinner && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  className="p-2 bg-white rounded-full text-slate-700 hover:text-indigo-600 shadow-lg"
                >
                  <Camera size={20} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onClear();
                  }}
                  className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 shadow-lg"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </>
        ) : (
          !showSpinner && (
            <div className="text-center p-4">
              <Camera className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <span className="text-sm text-slate-500 font-medium">
                Click to upload photo
              </span>
            </div>
          )
        )}
      </div>

      <input
        type="file"
        ref={inputRef}
        onChange={(e) => {
          const file = e.target.files?.[0] || null;
          if (file) setIsImageLoading(false); // Local files load instantly
          onFileSelect(file);
        }}
        accept="image/*"
        className="hidden"
      />

      {error && (
        <p className="text-xs text-red-500 mt-1 font-medium">{error}</p>
      )}
    </div>
  );
};
