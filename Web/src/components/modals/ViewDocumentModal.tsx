import React from "react";
import { X, ExternalLink, FileText } from "lucide-react";

interface ViewDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  signedUrl: string;
  fileName: string;
}

const ViewDocumentModal: React.FC<ViewDocumentModalProps> = ({
  isOpen,
  onClose,
  signedUrl,
  fileName,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl overflow-hidden flex flex-col h-[95vh] max-h-[1000px] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-800 truncate max-w-[250px] sm:max-w-md">
                {fileName}
              </h2>
              <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">
                Document Preview
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-slate-100 relative overflow-hidden flex items-center justify-center">
          {signedUrl ? (
            <iframe
              src={signedUrl}
              className="w-full h-full border-none"
              title={fileName}
            />
          ) : (
            <div className="text-center p-8">
              <Loader
                className="animate-spin text-indigo-500 mx-auto mb-4"
                size={40}
              />
              <p className="text-gray-600">Loading document source...</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4 bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Close
            </button>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-all active:scale-95"
            >
              <ExternalLink size={18} />
              Open Full View
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper internal loader since we don't want to import from elsewhere for a small icon
const Loader = ({ className, size }: { className?: string; size?: number }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

export default ViewDocumentModal;
