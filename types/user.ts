export const USER_ROLES = ["user", "seller", "admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const USER_GENDERS = [
  "male",
  "female",
  "other",
  "prefer_not_to_say",
] as const;

export type UserGender = (typeof USER_GENDERS)[number];

export type UserAddress = {
  city: string;
  district: string;
  state: string;
  pincode?: number | string;
  country: string;
};

export type UserRow = {
  id: string;
  auth_id: string | null;
  name: string | null;
  date_of_birth: string | null;
  gender: UserGender | null;
  avatar_url: string | null;
  address: UserAddress | null;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
};

export type UserInsert = {
  id?: string;
  auth_id?: string | null;
  name?: string | null;
  date_of_birth?: string | null;
  gender?: UserGender | null;
  avatar_url?: string | null;
  address?: UserAddress | null;
  phone: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
};

export type UserUpdate = {
  id?: string;
  auth_id?: string | null;
  name?: string | null;
  date_of_birth?: string | null;
  gender?: UserGender | null;
  avatar_url?: string | null;
  address?: UserAddress | null;
  phone?: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
};
