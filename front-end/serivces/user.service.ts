import { API_ENDPOINTS } from "@/config/api";
import type { Profile, ApiResponse } from "@/types";
import apiClient from "./apiClient";

export interface ProfileWithPrefs extends Profile {
  preferences?: any;
}

export const userService = {
  getProfiles: async (): Promise<Profile[]> => {
    const response = await apiClient.get<ApiResponse<Profile[]>>(
      API_ENDPOINTS.USER.PROFILES,
    );
    return response.data.data;
  },

  createProfile: async (data: Partial<Profile>): Promise<Profile> => {
    const response = await apiClient.post<ApiResponse<Profile>>(
      API_ENDPOINTS.USER.PROFILES,
      data,
    );
    return response.data.data;
  },

  updateProfile: async (
    id: string,
    data: Partial<Profile>,
  ): Promise<Profile> => {
    const response = await apiClient.patch<ApiResponse<Profile>>(
      `${API_ENDPOINTS.USER.PROFILES}/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteProfile: async (id: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.USER.PROFILES}/${id}`);
  },

  updatePreferences: async (profileId: string, data: any): Promise<void> => {
    await apiClient.patch(
      `${API_ENDPOINTS.USER.PROFILES}/${profileId}/preferences`,
      data,
    );
  },
};
