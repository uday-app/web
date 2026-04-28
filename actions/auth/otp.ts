"use server";

import { parsePhoneNumberFromString } from "libphonenumber-js";
import { z } from "zod";

import { createClient } from "@/supabase/server";

const sendOtpInputSchema = z.string().trim().min(1, "Enter your phone number.");

export async function sendOtp(phone: string): Promise<{ error?: string }> {
  const parsedPhone = sendOtpInputSchema.safeParse(phone);

  if (!parsedPhone.success) {
    return { error: parsedPhone.error.issues[0]?.message };
  }

  const phoneNumber = parsePhoneNumberFromString(parsedPhone.data);

  if (!phoneNumber || phoneNumber.country !== "IN" || !phoneNumber.isValid()) {
    return { error: "Enter a valid Indian mobile number." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    phone: phoneNumber.number,
  });

  if (error) {
    return { error: error.message };
  }

  return {};
}
