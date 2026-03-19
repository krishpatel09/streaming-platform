export interface User {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  avatar?: string;
  isVerified: boolean;
  role: "USER" | "ADMIN";
  createdAt: string;
  updatedAt: string;
}

export interface Profile {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  isMain: boolean;
  pin?: string;
  language: string;
  maturityRating: string;
}
