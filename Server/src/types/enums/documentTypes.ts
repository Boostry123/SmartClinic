export interface ClinicalDocument {
  id?: string;
  user_id: string;
  file_name: string;
  file_path: string;
  signed_url: string | undefined;
  file_type: string;
  created_at?: string;
}

export interface DocumentUploadResult {
  fileName: string;
  data: {
    path: string;
  } | null;
  signedUrl: string | undefined;
  error?: string;
}

export interface DocumentUploadResponse {
  message: string;
  results: DocumentUploadResult[];
  errors?: { fileName: string; error: string }[];
}
