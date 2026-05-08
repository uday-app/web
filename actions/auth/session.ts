"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/supabase/server";

import {
  type CurrentUserSession,
  toCurrentUserSession,
} from "./session-contract";

export async function getCurrentUserSession(): Promise<CurrentUserSession> {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return {
      profileComplete: false,
      user: null,
    };
  }

  const { data, error } = await supabase.rpc("get_current_user_session");

  if (error) {
    return {
      error: error.message,
      profileComplete: false,
      user: null,
    };
  }

  return toCurrentUserSession(data);
}

export async function signOutCurrentUser(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/login");

  return {};
}
