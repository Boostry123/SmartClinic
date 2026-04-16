import { getSupabaseClient } from "../config/supaDb.js";
//services
import { StorageService } from "../services/storage.js";
//types
import type { DocumentUploadResult } from "../types/enums/documentTypes.js";

const {
  uploadClinicalImage,
  generateSignedUrl,
  generateSignedUrls,
  listFiles,
  deleteFile,
} = StorageService;

const BUCKET_NAME = "public_documents";

// Delete a clinical document
export const deleteDocument = async (
  token: string,
  filePath: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const supabase = getSupabaseClient(token);
    const { error } = await deleteFile(supabase, BUCKET_NAME, filePath);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error(`Deleting document failed: ${err?.message ?? err}`);
    return { success: false, error: err?.message ?? "Unknown error" };
  }
};

//uploading clinical documents
export const uploadDocument = async (
  token: string,
  userId: string,
  file: Express.Multer.File,
  fileName: string,
): Promise<Omit<DocumentUploadResult, "fileName">> => {
  try {
    const supabase = getSupabaseClient(token);
    const fileExt = file.originalname.split(".").pop() || "pdf";

    // Sanitize fileName to prevent path traversal
    const sanitizedFileName = fileName
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const filePath = `${userId}/${sanitizedFileName}.${fileExt}`;

    const { data: uploadData, error: uploadError } = await uploadClinicalImage(
      supabase,
      BUCKET_NAME,
      filePath,
      file.buffer,
      file.mimetype,
    );

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get a temporary signed URL (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } =
      await generateSignedUrl(supabase, BUCKET_NAME, filePath, 3600);

    if (signedUrlError) {
      console.warn(
        "Failed to generate signed URL after upload:",
        signedUrlError.message,
      );
    }

    // Return the path and signed URL of the uploaded document
    return {
      data: uploadData as { path: string },
      signedUrl: signedUrlData?.signedUrl,
    };
  } catch (err: any) {
    console.error(`Document upload failed: ${err?.message ?? err}`);
    return {
      data: null,
      signedUrl: undefined,
      error: err?.message ?? "Unknown error",
    };
  }
};

export const listAllDocuments = async (
  token: string,
): Promise<{ data: any[]; error?: string }> => {
  try {
    const supabase = getSupabaseClient(token);

    // 1. Get all root-level items (these are the user ID folders)
    const { data: rootItems, error: rootError } = await listFiles(
      supabase,
      BUCKET_NAME,
      "",
    );

    if (rootError) throw rootError;

    const filesToFetch: {
      name: string;
      userId: string;
      path: string;
      metadata: any;
      createdAt: any;
      updatedAt: any;
    }[] = [];
    const pathsToSign: string[] = [];

    // 2. Iterate through each item at root to find folders
    for (const item of rootItems || []) {
      const { data: userFiles, error: userFilesError } = await listFiles(
        supabase,
        BUCKET_NAME,
        item.name,
      );

      if (userFilesError) continue;

      // 3. Collect file paths for batch signing
      for (const file of userFiles || []) {
        const filePath = `${item.name}/${file.name}`;
        pathsToSign.push(filePath);
        filesToFetch.push({
          name: file.name,
          userId: item.name,
          path: filePath,
          metadata: file.metadata,
          createdAt: file.created_at,
          updatedAt: file.updated_at,
        });
      }
    }

    // 4. Batch generate signed URLs for all collected files (efficient)
    const { data: signedUrls, error: signedError } = await generateSignedUrls(
      supabase,
      BUCKET_NAME,
      pathsToSign,
      3600,
    );

    if (signedError) throw signedError;

    // 5. Combine file metadata with their corresponding signed URLs
    const allFiles = filesToFetch.map((file) => {
      const signedUrlObj = signedUrls?.find(
        (s: { path: string; signedUrl: string }) => s.path === file.path,
      );
      return {
        ...file,
        signedUrl: signedUrlObj?.signedUrl,
      };
    });

    return { data: allFiles };
  } catch (err: any) {
    console.error(`Listing all documents failed: ${err?.message ?? err}`);
    return { data: [], error: err?.message ?? "Unknown error" };
  }
};

export const getDocumentUrl = async (
  token: string,
  filePath: string,
): Promise<{ signedUrl: string; error?: string }> => {
  try {
    const supabase = getSupabaseClient(token);
    const { data, error } = await generateSignedUrl(
      supabase,
      BUCKET_NAME,
      filePath,
      3600,
    );

    if (error) throw error;
    return { signedUrl: data?.signedUrl || "" };
  } catch (err: any) {
    console.error(`Retrieving signed URL failed: ${err?.message ?? err}`);
    return { signedUrl: "", error: err?.message ?? "Unknown error" };
  }
};
