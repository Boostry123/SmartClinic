import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getDocuments,
  uploadDocument,
  getDocumentUrl,
  deleteDocument,
} from "../api/documents";
import type {
  ClinicalDocument,
  DocumentUploadResponse,
} from "../api/types/documents";

/**
 * Hook to fetch all clinical forms and templates.
 */
const useDocuments = () => {
  return useQuery<ClinicalDocument[], Error>({
    queryKey: ["documents"],
    queryFn: getDocuments,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
  });
};

/**
 * Hook to upload new forms or documents.
 */
export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<
    DocumentUploadResponse,
    Error,
    { files: File | File[]; fileName?: string }
  >({
    mutationFn: ({ files, fileName }) => uploadDocument(files, fileName),
    onSuccess: () => {
      // Invalidate the documents list to show the new upload
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

/**
 * Hook to delete a document.
 */
export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation<{ message: string }, Error, string>({
    mutationFn: (filePath: string) => deleteDocument(filePath),
    onSuccess: () => {
      // Invalidate the documents list to reflect the deletion
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

/**
 * Hook to fetch a temporary signed URL for a specific document path.
 * Useful if a signed URL has expired and needs a refresh.
 */
export const useDocumentUrl = (filePath: string | null) => {
  return useQuery({
    queryKey: ["documentUrl", filePath],
    queryFn: () => getDocumentUrl(filePath!),
    enabled: !!filePath,
    staleTime: 1000 * 60 * 50, // 50 minutes (slightly less than the 1-hour expiry)
  });
};

export default useDocuments;
