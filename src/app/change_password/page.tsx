"use client";

import { Button } from "@/components/ui/button";
import { changePasswordAuth } from "../actions/auth";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePasswordPage() {
  const [state, action, isPending] = useActionState(
    changePasswordAuth,
    undefined
  );
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (state && "redirectTo" in state) {
      setSuccessMessage("Password successfully changed");

      const timer = setTimeout(() => {
        router.push(state.redirectTo);
        router.refresh();
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <div className="min-h-[90vh] mt-6 md:flex md:justify-center md:items-center md:mt-0 bg-black px-4">
      {successMessage && (
        <p className="text-green-500 text-center text-xl font-semibold">
          {successMessage}
        </p>
      )}

      {!successMessage && (
        <div className="bg-gray-900 border border-gray-700 shadow-lg rounded-2xl p-8 w-full max-w-xl">
          {/* Page title */}
          <h1 className="text-center font-bold text-3xl mb-6 text-white">
            Change Password
          </h1>

          {/* Change password form */}
          <form action={action} className="space-y-6">
            {/* New password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                placeholder="Enter new password"
                defaultValue={
                  state && "newPassword" in state
                    ? String(state.newPassword)
                    : ""
                }
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {state &&
                "errors" in state &&
                state.errors.newPassword.length > 0 && (
                  <ul className="mt-2 text-red-500 text-sm">
                    {state.errors.newPassword.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                )}
            </div>

            {/* Confirm new password */}
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Re-enter new password"
                defaultValue={
                  state && "confirmNewPassword" in state
                    ? String(state.confirmNewPassword)
                    : ""
                }
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {state &&
                "errors" in state &&
                state.errors.confirmNewPassword.length > 0 && (
                  <ul className="mt-2 text-red-500 text-sm">
                    {state.errors.confirmNewPassword.map((err, index) => (
                      <li key={index}>{err}</li>
                    ))}
                  </ul>
                )}
            </div>

            {/* Submit button */}
            <div>
              <Button
                type="submit"
                variant={"green"}
                className="w-full py-3 text-lg font-medium transition-transform duration-500 hover:scale-105"
                disabled={isPending}
              >
                {isPending ? "Changing..." : "Change Password"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
