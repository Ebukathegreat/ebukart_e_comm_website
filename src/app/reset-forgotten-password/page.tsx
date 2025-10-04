"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import styles from "./resetfgtpsw.module.css"; // new unique CSS module

export default function ResetPasswordPage() {
  const supabase = supabaseBrowser();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated! Please log in again.");
      router.push("/login?reason=password-updated");
    }

    setLoading(false);
  }

  return (
    <div className={styles.resetContainer}>
      <h1 className={styles.resetHeader}>Reset Your Password</h1>

      <form onSubmit={handleReset} className={styles.resetForm}>
        <label htmlFor="password" className={styles.label}>
          New Password
        </label>

        <input
          id="password"
          type="password"
          placeholder="Enter new password..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        <button type="submit" className={styles.resetButton} disabled={loading}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      <p className={styles.backToLogin}>
        Remembered your password?{" "}
        <a href="/login" className={styles.loginLink}>
          Back to Login
        </a>
      </p>
    </div>
  );
}
