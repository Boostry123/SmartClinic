export interface DocumentMetadata {
  eTag: string;
  size: number;
  mimetype: string;
  cacheControl: string;
  lastModified: string;
  contentLength: number;
  httpStatusCode: number;
}

export interface ClinicalDocument {
  name: string;
  userId: string;
  path: string;
  signedUrl: string | undefined;
  metadata: DocumentMetadata | null;
  createdAt: string;
  updatedAt: string;
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

export interface GetDocumentUrlResponse {
  signedUrl: string;
  error?: string;
}
