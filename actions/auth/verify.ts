"use server";

import { revalidatePath } from "next/cache";

import { parsePhoneNumberFromString } from "libphonenumber-js";

import { createClient } from "@/supabase/server";

type VerifiedUser = {
  auth_id: string | null;
  avatar_url: string | null;
  id: string;
  name: string | null;
  phone: string;
};

type VerifyOtpResult = {
  editNumber?: boolean;
  error?: string;
  user?: VerifiedUser;
};

export async function verifyOtp(
  phone: string,
  otp: string,
): Promise<VerifyOtpResult> {
  const token = otp.trim();

  if (!/^\d{6}$/.test(token)) {
    return {
      error: "Enter the 6-digit OTP.",
    };
  }

  const phoneNumber = parsePhoneNumberFromString(phone);

  if (!phoneNumber || phoneNumber.country !== "IN" || !phoneNumber.isValid()) {
    return {
      editNumber: true,
      error: "Please enter your number again.",
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    phone: phoneNumber.number,
    token,
    type: "sms",
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  if (!data.user) {
    return {
      error: "Unable to verify OTP right now.",
    };
  }

  const { data: user, error: userError } = await supabase
    .from("users")
    .select("id, auth_id, name, phone, avatar_url")
    .eq("auth_id", data.user.id)
    .maybeSingle();

  if (userError) {
    return {
      error: userError.message,
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/login");

  return {
    user: user ?? undefined,
  };
}
