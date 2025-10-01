"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [password, setPassword] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! Please login again.");
      router.push("/login?reason=password-updated");
    }
  }

  return (
    <div className="px-4 my-5 md:max-w-[500px] mx-auto">
      <h1 className="text-white text-2xl mb-4">Reset Password</h1>
      <form onSubmit={handleReset} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="Enter new password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="p-2 rounded text-black"
        />
        <button type="submit" className="bg-green-600 text-white p-2 rounded">
          Update Password
        </button>
      </form>
    </div>
  );
}
