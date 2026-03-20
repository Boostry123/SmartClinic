// services/storageService.ts

export const StorageService = {
  uploadClinicalImage: async (
    client: any,
    bucket: string,
    path: string,
    fileBuffer: Buffer,
    contentType: string,
  ) => {
    return client.storage.from(bucket).upload(path, fileBuffer, {
      contentType,
      upsert: true,
    });
  },

  deleteFile: async (client: any, bucket: string, path: string) => {
    return client.storage.from(bucket).remove([path]);
  },

  generateSignedUrl: async (
    client: any,
    bucket: string,
    path: string,
    expiresIn: number = 3600,
  ) => {
    return client.storage.from(bucket).createSignedUrl(path, expiresIn);
  },
};
