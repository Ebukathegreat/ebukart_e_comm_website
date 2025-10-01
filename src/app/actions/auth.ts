"use server";

import { supabaseServer } from "@/lib/supabase/server";
import {
  ChangePasswordSchema,
  LoginFormSchema,
  RegisterFormSchema,
} from "@/lib/zodRules";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";
// ************************************* REGISTER FORM AUTHENTICATION *************************************

// Types for error structure
type FieldErrors = {
  email: string[];
  password: string[];
  confirmPassword: string[];
};

interface FormErrorState {
  errors: FieldErrors;
  email: FormDataEntryValue | null;
}

// Type for successful result
interface FormSuccessState {
  redirectTo: string;
}

// Union type for the returned form state
type RegFormState = FormErrorState | FormSuccessState;

interface ListUsersParams {
  page?: number;
  perPage?: number;
  filter?: string;
}

// Create Supabase Admin client (uses service role key, only safe on server)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Only use this on the server!
);

export async function reg(
  state: RegFormState | undefined,
  formData: FormData
): Promise<RegFormState | undefined> {
  // 1. Validate form inputs using Zod
  const validatedFields = RegisterFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  // 2. If validation fails, return structured error messages
  if (!validatedFields.success) {
    const errorTree = z.treeifyError(validatedFields.error);

    return {
      errors: {
        email: errorTree.properties?.email?.errors ?? [],
        password: errorTree.properties?.password?.errors ?? [],
        confirmPassword: errorTree.properties?.confirmPassword?.errors ?? [],
      },
      email: formData.get("email"),
    };
  }

  const { email, password } = validatedFields.data;

  // 3. Check if the user already exists using Supabase Admin API
  const { data: userData, error: adminError } =
    await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
      filter: `email:ilike.${email}`, // ilike = case-insensitive
    } as ListUsersParams); // <-- Cast to any to bypass TS error

  // 4. If Admin API fails, return the error message
  if (adminError) {
    return {
      errors: {
        email: [adminError.message],
        password: [],
        confirmPassword: [],
      },
      email,
    };
  }

  // 5. If user exists, return a user-friendly error
  if (userData?.users?.length > 0) {
    return {
      errors: {
        email: ["Email is already registered. Try logging in instead."],
        password: [],
        confirmPassword: [],
      },
      email,
    };
  }

  // 🔹 NEW: Use browser client for actual signup (NOT supabaseServer, which skips email confirmation)

  const supabase = supabaseBrowser();

  // Build redirect URL to handle confirmation with email included
  const redirectUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/otp_error`);
  redirectUrl.searchParams.append("email", email);

  // 6. Attempt to register the user
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectUrl.toString(), // 🔹 NEW: ensures confirmation email gets sent
    },
  });

  // 7. If Supabase returns an error, return it as form feedback
  if (error) {
    return {
      errors: {
        email: [error.message],
        password: [],
        confirmPassword: [],
      },
      email,
    };
  }

  // 8. On success, redirect to the confirmation check page
  return { redirectTo: "/account_confirmation_check_email" };
}

// ************************************* LOGIN FORM AUTHENTICATION *************************************

// Define the structure of possible field errors from the login form
type LoginFieldErrors = {
  email: string[];
  password: string[];
};

// Interface for the form state when validation or login fails
interface LoginFormErrorState {
  errors: LoginFieldErrors;
  email: FormDataEntryValue | null;
}

// Interface for the form state when login succeeds
interface LoginFormSuccessState {
  redirectTo: string; // where to redirect the user after successful login
}

// Union type representing either an error state or a success state
type LoginFormState = LoginFormErrorState | LoginFormSuccessState;

// Server action function to handle login authentication
export async function loginAuth(
  state: LoginFormState | undefined,
  formData: FormData
): Promise<LoginFormState | undefined> {
  // Validate form fields using Zod schema
  const validatedFields = LoginFormSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    // If validation fails, transform the error into a structured format
    const errorTree = z.treeifyError(validatedFields.error);

    // Return structured error response with relevant field messages
    return {
      errors: {
        email: errorTree.properties?.email?.errors ?? [],
        password: errorTree.properties?.password?.errors ?? [],
      },
      email: formData.get("email"),
    };
  }

  // Extract validated data
  const { email, password } = validatedFields.data;

  // Create Supabase server client to interact with auth API
  const supabase = supabaseServer();

  // Attempt login with email and password
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // If Supabase returns an auth error, send it back in the response
    return {
      errors: {
        email: [error.message], // include message in the email field
        password: [], // no password-specific error from Supabase
      },
      email,
    };
  }

  // On success, return a redirect instruction to the dashboard
  return { redirectTo: "/dashboard" };
}

// ************************************* CHANGE PASSWORD AUTHENTICATION *************************************

// Types for error structure
type NewPasswordFieldErrors = {
  newPassword: string[];
  confirmNewPassword: string[];
};

interface NewPasswordFormErrorState {
  errors: NewPasswordFieldErrors;
  newPassword: FormDataEntryValue | null;
}

// Type for successful result
interface NewPasswordFormSuccessState {
  redirectTo: string;
}

// Union type for the returned form state
type NewPasswordFormState =
  | NewPasswordFormErrorState
  | NewPasswordFormSuccessState;

export async function changePasswordAuth(
  state: NewPasswordFormState | undefined,
  formData: FormData
): Promise<NewPasswordFormState | undefined> {
  const validatedFields = ChangePasswordSchema.safeParse({
    newPassword: formData.get("newPassword"),
    confirmNewPassword: formData.get("confirmNewPassword"),
  });

  if (!validatedFields.success) {
    // If validation fails, transform the error into a structured format
    const errorTree = z.treeifyError(validatedFields.error);

    // Return structured error response with relevant field messages
    return {
      errors: {
        newPassword: errorTree.properties?.newPassword?.errors ?? [],
        confirmNewPassword:
          errorTree.properties?.confirmNewPassword?.errors ?? [],
      },
      newPassword: formData.get("newPassword"),
    };
  }

  const { newPassword } = validatedFields.data;

  const supabase = supabaseServer();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    //  API-level error (e.g. user not authenticated)
    return {
      errors: {
        newPassword: [error.message],
        confirmNewPassword: [],
      },
      newPassword: formData.get("newPassword"),
    };
  }

  // Immediately log the user out
  await supabase.auth.signOut();

  //  3. Success – redirect user to login
  return {
    redirectTo: "/login?reason=password-updated",
  };
}

// ************************************* DELETE USER AUTHENTICATION *************************************

export async function deleteUser(formData: FormData): Promise<void> {
  const userId = formData.get("userId") as string;
  const supabase = supabaseServer();

  // 1. Delete the user from Supabase (admin)
  await supabaseAdmin.auth.admin.deleteUser(userId);

  // 2. End the current session (sign out locally)
  await supabase.auth.signOut();

  // 3. Redirect to homepage
  redirect("/");
}
