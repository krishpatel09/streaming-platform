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
  user_id: string;
  profile_name: string;
  avatar_url?: string;
  is_kids_profile: boolean;
  is_primary: boolean;
  pin_code_hash?: string;
  created_at: string;
}
