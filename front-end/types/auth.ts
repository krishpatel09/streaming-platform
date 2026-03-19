import { User } from "./user";


export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface LoginRequest {
  email?: string;
  phoneNumber?: string;
  password?: string;
  otp?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  fullName: string;
}
