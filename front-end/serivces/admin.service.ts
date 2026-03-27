import { API_ENDPOINTS } from "@/config/api";
import apiClient from "./apiClient";

export const adminService = {
  getUploadUrl: async (videoID: string) => {
    const response = await apiClient.post(
      API_ENDPOINTS.STREAMING.GET_UPLOAD_URL,
      {
        video_id: videoID,
      },
    );
    return response.data;
  },

  addContent: async (content: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.ADMIN.ADD_CONTENT,
      content,
    );
    return response.data;
  },

  notifyUploadComplete: async (data: {
    video_id: string;
    title: string;
    description: string;
    storage_path: string;
  }) => {
    const response = await apiClient.post(
      API_ENDPOINTS.ADMIN.NOTIFY_UPLOAD,
      data,
    );
    return response.data;
  },

  getContentStatus: async (id: string) => {
    const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.ADD_CONTENT}/${id}`);
    return response.data;
  },

  uploadToMinio: async (
    url: string,
    file: File,
    onProgress: (percent: number) => void,
  ) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", url);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(true);
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () =>
        reject(new Error("Upload failed due to network error"));
      xhr.send(file);
    });
  },
};
