import { z } from "zod";

import { USER_GENDERS, USER_ROLES } from "@/types/user";

const userAddressSchema = z.object({
  city: z.string(),
  country: z.string(),
  district: z.string(),
  pincode: z.union([z.string(), z.number()]).optional(),
  state: z.string(),
});

export const sessionUserSchema = z.object({
  address: userAddressSchema.nullable(),
  auth_id: z.string().nullable(),
  avatar_url: z.string().nullable(),
  created_at: z.string(),
  date_of_birth: z.string().nullable(),
  gender: z.enum(USER_GENDERS).nullable(),
  id: z.string(),
  name: z.string().nullable(),
  phone: z.string(),
  role: z.enum(USER_ROLES),
  updated_at: z.string(),
});

export const currentUserSessionRpcSchema = z.object({
  profile_complete: z.boolean(),
  user: sessionUserSchema.nullable(),
});

export type SessionUser = z.infer<typeof sessionUserSchema>;

export type CurrentUserSession = {
  error?: string;
  profileComplete: boolean;
  user: SessionUser | null;
};

export function toCurrentUserSession(value: unknown): CurrentUserSession {
  const parsed = currentUserSessionRpcSchema.safeParse(value);

  if (!parsed.success) {
    return {
      error: "Unable to read your login session.",
      profileComplete: false,
      user: null,
    };
  }

  return {
    profileComplete: parsed.data.profile_complete,
    user: parsed.data.user,
  };
}
