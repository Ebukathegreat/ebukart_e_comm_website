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
  const code = searchParams.get("code"); // Supabase sometimes sends this

  // Track resend button status
  const [status, setStatus] = useState<
    "idle" | "resending" | "sent" | "error" | "redirecting"
  >("idle");
  useEffect(() => {
    if (!urlError) {
      const run = async () => {
        // Case 1: Confirmation link with ?code=...
        if (code) {
          console.log("🔑 Code found in URL:", code);
          setStatus("redirecting");

          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            console.error("❌ exchangeCodeForSession failed:", error.message);
            setStatus("error");
            return;
          }

          console.log("✅ Session returned:", data.session);

          if (data.session?.user) {
            // 🚀 Always send newly confirmed users to welcome page
            router.replace("/welcome_new_user");
            router.refresh();
          } else {
            console.warn("⚠️ No user in session after exchange!");
          }
          return;
        }

        // Case 2: Confirmation link with #access_token=...
        const hashParams = new URLSearchParams(window.location.hash.slice(1));
        const access_token = hashParams.get("access_token");

        if (access_token) {
          console.log("🔑 Access token found in hash:", access_token);
          setStatus("redirecting");

          const { data: authListener } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log("📡 Auth state changed:", event, session);
              if (event === "SIGNED_IN" && session?.user) {
                router.replace("/welcome_new_user");
                router.refresh();
              }
            }
          );

          return () => {
            authListener.subscription.unsubscribe();
          };
        }
      };

      run();
    }
  }, [urlError, code, supabase, router]);

  // If no error in URL, user will be redirected
  if (!urlError && status === "redirecting") {
    return <p className="text-center mt-8">Redirecting to welcome page...</p>;
  }

  if (!urlError) {
    return <p className="text-center mt-8">Redirecting...</p>;
  }

  // Main UI (error state)
  return (
    <div className=" max-w-md mx-auto mt-12 p-8 bg-white rounded-lg shadow-md font-sans">
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
              onClick={async () => {
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
              }}
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
