import apiClient from "./axiosClient";
// Types
import type {
  ClinicalDocument,
  DocumentUploadResponse,
  GetDocumentUrlResponse,
} from "./types/documents";

/**
 * Fetch all clinical documents across all user folders.
 */
export const getDocuments = async (): Promise<ClinicalDocument[]> => {
  try {
    const res = await apiClient.get<ClinicalDocument[]>("/documents/all");
    console.log("getDocuments success:", res.data.length, "items found");
    return res.data;
  } catch (err) {
    console.error("getDocuments error:", err);
    throw err;
  }
};

/**
 * Upload one or more documents.
 * @param files - File or array of files to upload.
 * @param fileName - Optional custom name for the document.
 */
export const uploadDocument = async (
  files: File | File[],
  fileName?: string,
): Promise<DocumentUploadResponse> => {
  try {
    const formData = new FormData();

    if (Array.isArray(files)) {
      files.forEach((file) => formData.append("files", file));
    } else {
      formData.append("files", files);
    }

    if (fileName) {
      formData.append("fileName", fileName);
    }

    const res = await apiClient.post<DocumentUploadResponse>(
      "/documents/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    console.log("uploadDocument success");
    return res.data;
  } catch (err) {
    console.error("uploadDocument error:", err);
    throw err;
  }
};

/**
 * Get a temporary signed URL for a specific file path.
 */
export const getDocumentUrl = async (
  filePath: string,
): Promise<GetDocumentUrlResponse> => {
  try {
    const res = await apiClient.get<GetDocumentUrlResponse>("/documents/url", {
      params: { filePath },
    });
    return res.data;
  } catch (err) {
    console.error("getDocumentUrl error:", err);
    throw err;
  }
};

/**
 * Delete a specific document by its file path.
 */
export const deleteDocument = async (
  filePath: string,
): Promise<{ message: string }> => {
  try {
    const res = await apiClient.delete<{ message: string }>("/documents", {
      params: { filePath },
    });
    console.log("deleteDocument success");
    return res.data;
  } catch (err) {
    console.error("deleteDocument error:", err);
    throw err;
  }
};
