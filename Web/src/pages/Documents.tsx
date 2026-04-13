import { useState, useRef } from "react";
import {
  AlertTriangle,
  FileText,
  Loader,
  Upload,
  Calendar,
  Trash2,
} from "lucide-react";
// Store
import { useAuthStore } from "../store/authStore";
// Hooks
import useDocuments, {
  useUploadDocument,
  useDeleteDocument,
} from "../hooks/useDocuments";
// Components
import Hint from "../components/hint";
import ViewDocumentModal from "../components/modals/ViewDocumentModal";
import Card from "../components/Card";

const Documents = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedDoc, setSelectedDoc] = useState<{
    url: string;
    name: string;
  } | null>(null);

  // Fetch real data from hook
  const { data: documents, isLoading, isError, error } = useDocuments();

  // Mutation for uploading
  const { mutate: upload, isPending: isUploading } = useUploadDocument();

  // Mutation for deleting
  const { mutate: deleteDoc, isPending: isDeleting } = useDeleteDocument();

  const user = useAuthStore((state) => state.user);
  const userRole = user?.user_metadata?.role;
  const isDoctorOrAdmin = userRole === "doctor" || userRole === "admin";

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // For now, we upload them one by one or as a batch
      upload({ files: Array.from(files) });
      // Reset input so the same file can be uploaded again if needed
      e.target.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-indigo-500" size={48} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 border border-red-200 rounded-lg p-8 m-6">
        <AlertTriangle className="text-red-500" size={48} />
        <h2 className="mt-4 text-xl font-semibold text-red-800">
          Error Fetching Documents
        </h2>
        <p className="mt-2 text-red-600">
          {error?.message || "Failed to load clinic forms and templates."}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 animate-fade-in">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        multiple
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
      />

      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          Documents
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <div className="w-full sm:w-auto">
          <Hint
            text={
              isDoctorOrAdmin
                ? "Upload and manage clinic documents and informational files."
                : "Access available clinic documents and files."
            }
          />
        </div>

        {isDoctorOrAdmin && (
          <button
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isUploading ? (
              <Loader className="animate-spin" size={20} />
            ) : (
              <Upload size={20} />
            )}
            {isUploading ? "Uploading..." : "Upload Document"}
          </button>
        )}
      </div>

      {!documents || documents.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-gray-400" size={32} />
          </div>
          <h3 className="text-lg font-medium text-gray-900">
            No documents found
          </h3>
          <p className="text-gray-500 mt-1">
            Start by uploading a document or file.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {documents.map((doc, index) => (
            <Card
              key={index}
              onClick={() =>
                setSelectedDoc({
                  url: doc.signedUrl || "",
                  name: doc.name,
                })
              }
              className="group transform hover:-translate-y-1 transition-all"
              title={
                <div className="flex justify-between items-start w-full">
                  <div className="p-3 bg-indigo-50 rounded-lg group-hover:bg-indigo-600 transition-colors">
                    <FileText
                      className="text-indigo-600 group-hover:text-white transition-colors"
                      size={24}
                    />
                  </div>
                  {isDoctorOrAdmin && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm(
                            "Are you sure you want to delete this document?",
                          )
                        ) {
                          deleteDoc(doc.path);
                        }
                      }}
                      disabled={isDeleting}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete document"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              }
            >
              <h2
                className="text-lg font-bold text-gray-800 truncate mb-3"
                title={doc.name}
              >
                {doc.name}
              </h2>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Calendar size={14} className="text-gray-400" />
                  <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-50 flex justify-between items-center">
                <span className="text-[10px] font-bold px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md uppercase tracking-wider">
                  {doc.path.split(".").pop()}
                </span>
                <span className="text-[10px] text-gray-400 font-medium italic">
                  {((doc.metadata?.size || 0) / 1024).toFixed(1)} KB
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {selectedDoc && (
        <ViewDocumentModal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          signedUrl={selectedDoc.url}
          fileName={selectedDoc.name}
        />
      )}
    </div>
  );
};

export default Documents;
