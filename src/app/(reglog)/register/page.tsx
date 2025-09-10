"use client";

import { useActionState } from "react";
import { reg } from "@/app/actions/auth";
import styles from "./register.module.css"; // using the same module CSS (login-style)
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const [state, action, isPending] = useActionState(reg, undefined);
  const router = useRouter();

  //  When `state` is updated and contains a redirect, navigate to it
  useEffect(() => {
    if (state && "redirectTo" in state) {
      router.push(state.redirectTo);
    }
  }, [state, router]);

  return (
    <div className="px-4 my-5 text-white md:max-w-[700px] mx-auto">
      {/* Page Header */}
      <h1 className={styles.registerHeader}>Register</h1>

      {/* Form Card */}
      <form className={styles.formClass} action={action}>
        {/* Email Field */}
        <div>
          <label>Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Enter Email..."
            defaultValue={state && "email" in state ? String(state.email) : ""}
          />
          {/* Show Email Errors */}
          {state && "errors" in state && state.errors.email.length > 0 && (
            <ul className="text-red-500 mt-1 text-sm">
              {state.errors.email.map((err, index) => (
                <li key={index} className="mb-2.5">
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password..."
          />
          {/* Show Password Errors */}
          {state && "errors" in state && state.errors.password.length > 0 && (
            <ul className="text-red-500 mt-1 text-sm">
              {state.errors.password.map((err, index) => (
                <li key={index} className="mb-2.5">
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Re-enter Password to confirm..."
          />
          {/* Show Confirm Password Errors */}
          {state &&
            "errors" in state &&
            state.errors.confirmPassword.length > 0 && (
              <ul className="text-red-500 mt-1 text-sm">
                {state.errors.confirmPassword.map((err, index) => (
                  <li key={index} className="mb-2.5">
                    {err}
                  </li>
                ))}
              </ul>
            )}
        </div>

        {/* Submit Button and Link */}
        <div className="mt-4 flex items-center flex-wrap gap-3">
          {/* Styled Gradient Submit Button */}
          <button
            type="submit"
            className={styles.gradientButton}
            disabled={isPending}
          >
            {isPending ? "Loading..." : "Register"}
          </button>

          {/* Styled Gradient Login Link */}
          <Link href="/login" className={styles.registerLink}>
            Or login here
          </Link>
        </div>
      </form>
    </div>
  );
}
