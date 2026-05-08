"use server";

import { revalidatePath } from "next/cache";

import { parsePhoneNumberFromString } from "libphonenumber-js";

import { createClient } from "@/supabase/server";
import {
  type SessionUser,
  toCurrentUserSession,
} from "@/actions/auth/session-contract";

type VerifyOtpResult = {
  editNumber?: boolean;
  error?: string;
  needsDetails?: boolean;
  user?: SessionUser;
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

  const { data: sessionData, error: sessionError } = await supabase.rpc(
    "get_current_user_session",
  );

  if (sessionError) {
    return {
      error: sessionError.message,
    };
  }

  const session = toCurrentUserSession(sessionData);

  if (session.error) {
    return {
      error: session.error,
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/login");

  if (!session.profileComplete) {
    return {
      needsDetails: true,
      user: session.user ?? undefined,
    };
  }

  return {
    user: session.user ?? undefined,
  };
}
