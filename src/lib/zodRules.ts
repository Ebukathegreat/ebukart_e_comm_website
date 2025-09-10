import { z } from "zod";

//REGISTER FORM SCHEMA

export const RegisterFormSchema = z
  .object({
    email: z.email({ message: "Valid Email required" }).trim(),
    password: z
      .string()
      .min(1, { message: "Must not be empty" })
      .min(5, { message: "Must be at least 5 characters long" })
      .regex(/[a-zA-Z]/, { message: "Must contain at least one letter" })
      .regex(/[0-9]/, { message: "Must have at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Must have at least one special character",
      })
      .trim(),
    confirmPassword: z.string().trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password fields don't match",
    path: ["confirmPassword"],
  });

// LOGIN FROM SCHEMA

export const LoginFormSchema = z.object({
  email: z.email({ message: "Valid Email required" }).trim(),
  password: z.string().min(1, { message: "Password is required" }),
});

// CHANGE PASSWORD SCHEMA

export const ChangePasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: "Must not be empty" })
      .min(5, { message: "Must be at least 5 characters long" })
      .regex(/[a-zA-Z]/, { message: "Must contain at least one letter" })
      .regex(/[0-9]/, { message: "Must have at least one number" })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Must have at least one special character",
      })
      .trim(),
    confirmNewPassword: z.string().trim(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password fields don't match",
    path: ["confirmNewPassword"],
  });
