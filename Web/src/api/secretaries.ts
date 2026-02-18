import apiClient from "./axiosClient";
import type { Secretary, secretaryFilterTypes } from "./types/secretary";

export const getSecretaries = async (
  filter?: secretaryFilterTypes
): Promise<Secretary[]> => {
  try {
    const res = await apiClient.get<Secretary[]>(`secretaries`, {
      params: filter,
    });
    console.log("getSecretaries success:", res.data.length, "items found");
    return res.data;
  } catch (err) {
    console.error("getSecretaries error:", err);
    throw err;
  }
};
