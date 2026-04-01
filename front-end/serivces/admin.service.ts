import { API_ENDPOINTS } from "@/config/api";
import apiClient from "./apiClient";

export const adminService = {
  getUploadUrl: async (videoID: string, type: string = "source") => {
    const response = await apiClient.post(
      API_ENDPOINTS.STREAMING.GET_UPLOAD_URL,
      {
        video_id: videoID,
        type: type,
      },
    );
    return response.data;
  },

  getAllContent: async () => {
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.ADD_CONTENT);
    return response.data;
  },

  getContentByID: async (id: string) => {
    const response = await apiClient.get(`${API_ENDPOINTS.ADMIN.ADD_CONTENT}/${id}`);
    return response.data;
  },

  addContent: async (content: any) => {
    const response = await apiClient.post(
      API_ENDPOINTS.ADMIN.ADD_CONTENT,
      content,
    );
    return response.data;
  },

  updateContent: async (id: string, content: any) => {
    const response = await apiClient.put(
      `${API_ENDPOINTS.ADMIN.ADD_CONTENT}/${id}`,
      content,
    );
    return response.data;
  },

  deleteContent: async (id: string) => {
    const response = await apiClient.delete(
      `${API_ENDPOINTS.ADMIN.ADD_CONTENT}/${id}`,
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
    const response = await apiClient.get(
      `${API_ENDPOINTS.ADMIN.ADD_CONTENT}/${id}`,
    );
    return response.data;
  },

  getNotificationUrl: (videoID: string) => {
    return `http://localhost:8008/api/notifications/events/${videoID}`;
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
