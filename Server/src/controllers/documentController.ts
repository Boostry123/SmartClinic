import { getSupabaseClient } from "../config/supaDb.js";
//services
import { StorageService } from "../services/storage.js";
//types
import type { DocumentUploadResult } from "../types/enums/documentTypes.js";

const { uploadClinicalImage, getPublicUrl, listFiles } = StorageService;

//uploading public documents
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
      "public_documents",
      filePath,
      file.buffer,
      file.mimetype,
    );

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    // Get the public URL string directly from the service
    const publicUrl = getPublicUrl(supabase, "public_documents", filePath);

    // Return the path and public URL of the uploaded document
    return {
      data: uploadData as { path: string },
      publicUrl,
    };
  } catch (err: any) {
    console.error(`Document upload failed: ${err?.message ?? err}`);
    return {
      data: null,
      publicUrl: undefined,
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
      "public_documents",
      "",
    );

    if (rootError) throw rootError;

    const allFiles: any[] = [];

    // 2. Iterate through each item at root
    for (const item of rootItems || []) {
      // In Supabase Storage, directories don't have an ID in the list response
      // or they can be identified as having no metadata (usually).
      // Or you can try listing it.

      // We'll treat all items at root as folders (which matches our schema: userId/)
      const { data: userFiles, error: userFilesError } = await listFiles(
        supabase,
        "public_documents",
        item.name,
      );

      if (userFilesError) {
        // This might happen if 'item' is a file, not a folder
        continue;
      }

      // 3. For each file inside the user folder, generate its metadata and public URL
      for (const file of userFiles || []) {
        const filePath = `${item.name}/${file.name}`;
        const publicUrl = getPublicUrl(supabase, "public_documents", filePath);

        allFiles.push({
          name: file.name,
          userId: item.name,
          path: filePath,
          publicUrl,
          metadata: file.metadata,
          createdAt: file.created_at,
          updatedAt: file.updated_at,
        });
      }
    }

    return { data: allFiles };
  } catch (err: any) {
    console.error(`Listing all documents failed: ${err?.message ?? err}`);
    return { data: [], error: err?.message ?? "Unknown error" };
  }
};

export const getDocumentUrl = (
  token: string,
  filePath: string,
): { publicUrl: string } => {
  const supabase = getSupabaseClient(token);
  const publicUrl = getPublicUrl(supabase, "public_documents", filePath);
  return { publicUrl };
};
