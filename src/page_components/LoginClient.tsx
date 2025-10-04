"use client"; // This tells Next.js that this file should run in the browser, not just the server

import { Button } from "@/components/ui/button"; // Importing a button component (fancy looking button)
import styles from "../app/(reglog)/login/login.module.css"; // Importing our custom CSS styles
import Link from "next/link"; // Lets us move between pages
import { useActionState, useEffect, useRef, useState } from "react"; // React hooks – we'll use these to handle actions and side effects
import { loginAuth } from "@/app/actions/auth"; // This is the function that actually logs the user in
import { useRouter, useSearchParams } from "next/navigation"; // Helps us change or read the URL
import { toast } from "sonner"; // Using the new Sonner toast – small popup messages
import { useUser } from "@/page_components/UserProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { altSupabaseClient } from "@/lib/supabase/alternateclient";

export default function LoginClient() {
  // This handles form state (errors, loading, etc.)
  const [state, action, isPending] = useActionState(loginAuth, undefined);

  // Helps us go to another page
  const router = useRouter();

  // This helps us read things in the URL like ?reason=password-updated
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false); // This will make the useEffect for password change run only once

  const user = useUser();
  const supabase = supabaseBrowser();

  // 🔹 NEW: State for forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [loadingReset, setLoadingReset] = useState(false); // 🔹 NEW: track loading state for reset

  //  This runs when the page loads (or when URL changes). It will run if the user is redirected here due to a password change.
  useEffect(() => {
    async function logoutAndRedirect() {
      if (
        searchParams.get("reason") === "password-updated" &&
        !hasShownToast.current
      ) {
        toast.success("Password changed. Please log in again.");

        hasShownToast.current = true; // Makes useEffect run once

        await supabase.auth.signOut();

        router.refresh(); // Makes sure that login button shows in Navbar instead of Dashboard button

        // Delay redirect a bit so toast can show, and then redirect
        setTimeout(() => {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("reason");
          router.replace(newUrl.toString());
        }, 500); //  half a second delay
      }
    }
    logoutAndRedirect();
  }, [searchParams, router, supabase]);

  //  This checks if login was successful
  useEffect(() => {
    if (state && "redirectTo" in state && user !== null) {
      //  If yes, move the user to another page (like /dashboard)
      window.location.href = state.redirectTo; // Makes sure that Dashboard button shows instead of login button
    }
  }, [state, user]);

  return (
    <div className="px-4 my-5  md:max-w-[700px] mx-auto">
      <h1 className={styles.loginHeader}>Login</h1>

      {/* This is our login form – when submitted, it calls the loginAuth function */}
      <form action={action} className={styles.formClass}>
        {/* EMAIL INPUT */}
        <div>
          <label className="text-white">Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Enter Email..."
            defaultValue={state && "email" in state ? String(state.email) : ""}
          />

          {/* If there are any errors with the email, show them */}
          {state && "errors" in state && state.errors.email.length > 0 && (
            <ul className="text-red-600">
              {state.errors.email.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        {/* PASSWORD INPUT */}
        <div>
          <label className="text-white">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password..."
          />

          {/* If there are any errors with the password, show them */}
          {state && "errors" in state && state.errors.password.length > 0 && (
            <ul className="text-red-600">
              {state.errors.password.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}

          {/* 🔹 NEW: Forgot password link */}
          <p className="text-sm mt-2">
            <button
              type="button"
              onClick={() => setShowForgotModal(true)}
              className="text-blue-400 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </p>
        </div>

        {/* LOGIN BUTTON + LINK TO REGISTER PAGE */}
        <div className="mt-3 ">
          <Button
            type="submit"
            variant={"green"}
            className={styles.gradientButton}
            disabled={isPending} // disable while loading
          >
            {/* While logging in, show "Loading..." */}
            {isPending ? "Loading..." : "Login"}
          </Button>

          {/* If user doesn’t have an account, let them register */}
          <Link href={"/register"} className={styles.registerLink}>
            Or register here
          </Link>
        </div>
      </form>

      {/* 🔹 NEW: Forgot password modal */}
      {showForgotModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-60 z-50">
          <div className="bg-white p-6 rounded-lg w-[300px] sm:w-[350px]">
            <h2 className="text-lg font-semibold mb-3">Reset your password</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setLoadingReset(true); // NEW: show loading

                try {
                  // 🔹 NEW: Call our secure API route to check user
                  const res = await fetch("/api/auth/check_user", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email: resetEmail }),
                  });

                  const result = await res.json();

                  if (!result.exists) {
                    toast.error("No account found with this email.");
                    setLoadingReset(false);
                    return;
                  }

                  const altSupabase = altSupabaseClient();

                  // If user exists, send reset email
                  const { error } =
                    await altSupabase.auth.resetPasswordForEmail(resetEmail, {
                      redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-forgotten-password`,
                    });

                  if (error) {
                    toast.error(error.message);
                  } else {
                    toast.success("Check your email for a reset link.");
                    setShowForgotModal(false);
                    setResetEmail("");
                  }
                } catch (err) {
                  toast.error("Unexpected error. Try again.");
                  console.error(err);
                } finally {
                  setLoadingReset(false);
                }
              }}
              className="flex flex-col gap-3"
            >
              <input
                type="email"
                placeholder="Enter your email..."
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                required
                className="p-2 border rounded text-black"
              />
              <div className="flex justify-between mt-3">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="px-3 py-1 bg-gray-300 rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loadingReset} // NEW: disable button while loading
                  className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
                >
                  {loadingReset ? "Sending..." : "Send Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
