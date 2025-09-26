"use client";

import { Button } from "@/components/ui/button";
import { useHasMounted } from "@/lib/my_personal_hooks/useHasMounted";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useUser } from "@/page_components/UserProvider";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteUser } from "../actions/auth";
import { getInitialsFromEmail } from "@/lib/getInitialsFromEmail";

export default function ProfilePage() {
  // Custom hook to detect if the component has mounted (for safe rendering on the client)
  const hasMounted = useHasMounted();

  const { user, signOut } = useUser();

  const router = useRouter();

  const initials = getInitialsFromEmail(user?.email);

  return (
    <div className="p-6 max-w-lg mx-auto text-white">
      {/* Page title */}
      <h1 className="text-3xl font-bold mb-6 text-center">Profile</h1>

      {/* User information card */}
      <div className="bg-gray-900 border border-gray-700 shadow-lg p-6 rounded-2xl">
        {/* Profile avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-600 flex items-center justify-center text-2xl font-bold shadow-md">
            {initials}
          </div>
        </div>

        {/* User email */}
        <div className="mb-6">
          <p className="text-center text-lg font-semibold text-gray-300">
            Email
          </p>
          <p className="text-center mt-2 text-xl">{user?.email}</p>
        </div>

        {/* Account creation date */}
        <div className="mb-6">
          <p className="text-center text-lg font-semibold text-gray-300">
            Joined
          </p>
          <p className="text-center mt-2">
            {user?.created_at
              ? new Date(user.created_at)
                  .toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace(/am|pm/, (match) => match.toUpperCase())
              : "Unknown"}
          </p>
        </div>

        {/* Last login timestamp */}
        <div>
          <p className="text-center text-lg font-semibold text-gray-300">
            Last Login
          </p>
          <p className="text-center mt-2">
            {user?.last_sign_in_at
              ? new Date(user.last_sign_in_at)
                  .toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })
                  .replace(/am|pm/, (match) => match.toUpperCase())
              : "Unknown"}
          </p>
        </div>
      </div>

      {/* Logout and Change Password buttons (only shown after component has mounted) */}
      {hasMounted && (
        <div className="mt-8 space-y-4">
          {/* Logout */}
          <Button
            variant={"destructive"}
            className="w-full text-lg py-4 transition-transform duration-500 hover:scale-105 cursor-pointer"
            onClick={async () => {
              const supabase = supabaseBrowser();

              // Sign out the user
              await supabase.auth.signOut();

              router.push("/");

              router.refresh(); // Refesh page to show home page
            }}
          >
            Log out
          </Button>

          {/* Change Password */}
          <Button
            asChild
            className="w-full text-lg py-4 transition-transform duration-500 hover:scale-105 cursor-pointer"
            variant={"green"}
          >
            <Link href="/change_password">Change Password</Link>
          </Button>

          {/* Delete Account */}
          <Button
            className="w-full text-lg py-4 transition-transform duration-500 hover:scale-105 cursor-pointer"
            variant={"destructive"}
            onClick={async () => {
              const confirmed = confirm(
                "Are you sure you want to delete your account?"
              );
              if (!confirmed) return;

              if (!user) {
                alert("No user found.");
                return;
              }

              const supabase = supabaseBrowser();

              // 1. Sign out from client session first
              await supabase.auth.signOut();

              // 2. Then delete user from Supabase (server-side action)
              const formData = new FormData();
              formData.append("userId", user.id);

              await deleteUser(formData);

              //await supabase.auth.signOut();

              //localStorage.removeItem("supabase.auth.token");
              //sessionStorage.clear();

              // 3. Sign out cleanly (updates context immediately)
              await signOut();

              // 4. Optional: navigate home
              router.push("/");
            }}
          >
            Delete Account
          </Button>
        </div>
      )}
    </div>
  );
}
