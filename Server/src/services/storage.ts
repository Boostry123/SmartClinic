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

  getPublicUrl: (client: any, bucket: string, path: string) => {
    const { data } = client.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  },

  listFiles: async (client: any, bucket: string, path: string = "") => {
    return client.storage.from(bucket).list(path, {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" },
    });
  },
};
