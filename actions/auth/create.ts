"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";

import { createClient } from "@/supabase/server";
import { USER_GENDERS, type UserRow } from "@/types/user";

const createUserAddressSchema = z.object({
  city: z.string().trim().min(2, "Enter a valid city."),
  country: z.string().trim().min(2, "Enter a valid country."),
  district: z.string().trim().min(2, "Enter a valid district."),
  pincode: z
    .string()
    .trim()
    .max(12, "Enter a valid pincode.")
    .optional()
    .or(z.literal("")),
  state: z.string().trim().min(2, "Enter a valid state."),
});

const createUserInputSchema = z.object({
  address: createUserAddressSchema,
  date_of_birth: z.string().trim().min(1, "Select your date of birth."),
  gender: z.enum(USER_GENDERS, {
    error: "Choose a gender.",
  }),
  name: z.string().trim().min(3, "Enter your full name."),
});

type CreateUserInput = z.infer<typeof createUserInputSchema>;

type CreateUserResult = {
  error?: string;
  user?: UserRow;
};

export async function createUserProfile(
  input: CreateUserInput,
): Promise<CreateUserResult> {
  const parsedInput = createUserInputSchema.safeParse(input);

  if (!parsedInput.success) {
    return {
      error: parsedInput.error.issues[0]?.message,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_user_profile", {
    p_address: parsedInput.data.address,
    p_date_of_birth: parsedInput.data.date_of_birth,
    p_gender: parsedInput.data.gender,
    p_name: parsedInput.data.name,
  });

  if (error) {
    return {
      error: error.message,
    };
  }

  revalidatePath("/", "layout");
  revalidatePath("/login");

  return {
    user: data,
  };
}
