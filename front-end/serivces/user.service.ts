// import { API_ENDPOINTS } from "@/config/api";
// import type { User, Profile, ApiResponse } from "@/types";
// import apiClient from "./apiClient";

// export const userService = {
//   getProfiles: async (): Promise<Profile[]> => {
//     const response = await apiClient.get<ApiResponse<Profile[]>>(
//       API_ENDPOINTS.USER.PROFILES,
//     );
//     return response.data.data;
//   },

//   createProfile: async (data: Partial<Profile>): Promise<Profile> => {
//     const response = await apiClient.post<ApiResponse<Profile>>(
//       API_ENDPOINTS.USER.PROFILES,
//       data,
//     );
//     return response.data.data;
//   },

//   updateProfile: async (
//     id: string,
//     data: Partial<Profile>,
//   ): Promise<Profile> => {
//     const response = await apiClient.patch<ApiResponse<Profile>>(
//       `${API_ENDPOINTS.USER.PROFILES}/${id}`,
//       data,
//     );
//     return response.data.data;
//   },

//   deleteProfile: async (id: string): Promise<void> => {
//     await apiClient.delete(`${API_ENDPOINTS.USER.PROFILES}/${id}`);
//   },

//   updateUser: async (data: Partial<User>): Promise<User> => {
//     const response = await apiClient.patch<ApiResponse<User>>(
//       API_ENDPOINTS.USER.UPDATE_USER,
//       data,
//     );
//     return response.data.data;
//   },
// };
