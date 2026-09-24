import { axiosInstance } from './api/axiosInstance';
import { API_PATHS } from './api/apiPaths';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    username: string;
    role: string;
  };
  accessToken?: string;
  refreshToken?: string;
}

export interface SignupResponse {
  id: string;
  email: string;
  username: string;
  role: string;
  isVerified: boolean;
}

export const authService = {
  async signup(email: string, username: string, password: string): Promise<SignupResponse> {
    const response = await axiosInstance.post<SignupResponse>(API_PATHS.AUTH.SIGNUP, {
      email,
      username,
      password,
    });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  async verifyOtp(email: string, code: string, purpose: string = 'SIGNUP'): Promise<AuthResponse> {
    const response = await axiosInstance.post<AuthResponse>(API_PATHS.AUTH.VERIFY_OTP, {
      email,
      code,
      purpose,
    });
    return response.data;
  },

  async resendOtp(email: string, purpose: string = 'SIGNUP'): Promise<{ message: string }> {
    const response = await axiosInstance.post<{ message: string }>(API_PATHS.AUTH.RESEND_OTP, {
      email,
      purpose,
    });
    return response.data;
  },

  async logout(): Promise<{ success: boolean }> {
    const response = await axiosInstance.post<{ success: boolean }>(API_PATHS.AUTH.LOGOUT);
    return response.data;
  },

  async getMe(): Promise<{ user: AuthResponse['user'] | null }> {
    try {
      const response = await axiosInstance.get<{ user: AuthResponse['user'] | null }>(API_PATHS.AUTH.ME);
      return response.data;
    } catch {
      return { user: null };
    }
  },
};
