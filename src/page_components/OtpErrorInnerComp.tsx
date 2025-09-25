"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OtpErrorInnerComp() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [status, setStatus] = useState<
    "idle" | "resending" | "sent" | "error" | "redirecting"
  >("idle");

  const searchParams = useSearchParams();
  const [urlError, setUrlError] = useState<string | null>(null);

  // Make urlError reactive with useState
  useEffect(() => {
    // Set the initial value from URL
    setUrlError(searchParams.get("error"));
  }, [searchParams]);

  useEffect(() => {
    // Only run this redirect logic if there's no error in the URL
    if (!urlError) {
      // 1. Subscribe to auth state changes (e.g., when user signs in via email link)
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          // 2. If user signs in successfully, redirect to welcome page
          if (event === "SIGNED_IN" && session?.user) {
            // NEW: update status before redirect
            setStatus("redirecting");
            router.push("/welcome_new_user");
            router.refresh();
          }
        }
      );

      // 4. Cleanup subscription when component unmounts
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [urlError, router, supabase]);

  // NEW: use status to show redirect message
  if (!urlError) {
    return (
      <div>
        <p className="text-xl text-center text-white mt-5">
          {status === "redirecting" ? "Redirecting..." : "Loading..."}
        </p>
      </div>
    );
  }

  // Main UI (error or idle)
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-md font-sans">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Authentication Error
      </h1>

      <p className="mb-4 text-base leading-relaxed font-semibold">
        Something went wrong with your confirmation link.
      </p>

      {/* Resend button logic can go here */}
      <button
        // NEW: disable button while resending
        disabled={status === "resending"}
        onClick={async () => {
          // NEW: set status before starting resend
          setStatus("resending");

          const email = localStorage.getItem("pendingEmail"); // ✅ fetch stored email
          if (!email) {
            setStatus("error");
            return;
          }

          const { error } = await supabase.auth.resend({
            type: "signup",
            email,
            options: { emailRedirectTo: `${location.origin}/otp_error` },
          });
          // NEW: update status based on success or error
          setStatus(error ? "error" : "sent");
        }}
        className={`px-5 py-2 rounded-md text-white font-medium transition ${
          status === "resending"
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {/* NEW: change button text while resending */}
        {status === "resending" ? "Sending..." : "Resend Confirmation Email"}
      </button>

      {/* NEW: success message */}
      {status === "sent" && (
        <p className="mt-4 text-green-600 font-semibold">
          ✅ Confirmation email sent! Check your inbox.
        </p>
      )}

      {/* NEW: error message */}
      {status === "error" && (
        <p className="mt-4 text-red-600 font-semibold">
          ❌ Failed to resend email. Please try again.
        </p>
      )}
    </div>
  );
}
