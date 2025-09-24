"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function OtpErrorInnerComp() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = supabaseBrowser();

  const urlError = searchParams.get("error");
  const error_code = searchParams.get("error_code");
  const error_description = searchParams.get("error_description");
  const email = searchParams.get("email");

  // Track resend button status
  const [status, setStatus] = useState<"idle" | "resending" | "sent" | "error">(
    "idle"
  );

  // Redirect if no error is found (likely a successful login from confirmation email)
  useEffect(() => {
    // Only run this redirect logic if there's no error in the URL
    if (!urlError) {
      // 1. Subscribe to auth state changes (e.g., when user signs in via email link)
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          // 2. If user signs in successfully, decide redirect
          if (event === "SIGNED_IN" && session?.user) {
            // ✅ Check if user is new
            const isNewUser = session.user.user_metadata?.isNewUser;

            if (isNewUser) {
              // Redirect to welcome page
              router.replace("/welcome_new_user");
              router.refresh();
            } else {
              // Redirect to dashboard
              router.replace("/dashboard");
              router.refresh();
            }
          }
        }
      );

      // 3. Also immediately check if user is already authenticated
      // (sometimes Supabase restores the session before this runs)
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          const isNewUser = data.user.user_metadata?.isNewUser;

          if (isNewUser) {
            router.replace("/welcome_new_user");
            router.refresh();
          } else {
            router.replace("/dashboard");
            router.refresh();
          }
        }
      });

      // 4. Cleanup subscription when component unmounts
      return () => {
        authListener.subscription.unsubscribe();
      };
    }
  }, [urlError, router, supabase]);

  // Handle resend confirmation email
  const handleResend = async () => {
    if (!email) {
      setStatus("error");
      return;
    }

    setStatus("resending");

    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${
          location.origin
        }/otp_error?email=${encodeURIComponent(email)}`,
      },
    });

    setStatus(error ? "error" : "sent");
  };

  // If no error in URL, user will be redirected
  if (!urlError) {
    return <p className="text-center mt-8">Redirecting...</p>;
  }

  // Main UI
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-md font-sans">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Authentication Error
      </h1>

      <p className="mb-4 text-base leading-relaxed font-semibold">
        {error_description || "Something went wrong."}
      </p>

      {/* If OTP expired, show resend button */}
      {error_code === "otp_expired" && (
        <>
          <p className="mb-4 text-base leading-relaxed">
            Your confirmation link has expired.
          </p>

          {email ? (
            <button
              onClick={handleResend}
              disabled={status === "resending"}
              className={`px-5 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
                status === "resending"
                  ? "bg-blue-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {status === "resending"
                ? "Resending..."
                : "Resend Confirmation Email"}
            </button>
          ) : (
            <p className="text-gray-600 mb-4">
              Email not found in URL. Please go back to register.
            </p>
          )}

          {/* Show result message */}
          {status === "sent" && (
            <p className="mt-4 text-green-600 font-semibold">
              Email resent! Check your inbox.
            </p>
          )}

          {status === "error" && (
            <p className="mt-4 text-red-600 font-semibold">
              Failed to resend. Please try again later.
            </p>
          )}
        </>
      )}

      {/* Back to register button */}
      <button
        onClick={() => router.push("/register")}
        className="mt-8 px-5 py-2 rounded-md bg-gray-700 hover:bg-gray-800 text-white font-medium transition-colors duration-200"
      >
        Back to Register
      </button>
    </div>
  );
}
