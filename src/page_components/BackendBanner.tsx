"use client";

import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function BackendBanner() {
  // null = checking, false = offline, true = online
  const [isOnline, setIsOnline] = useState<null | boolean>(null);

  useEffect(() => {
    const checkSupabase = async () => {
      try {
        const supabase = supabaseBrowser();
        const { error } = await supabase.auth.getSession();
        if (error) throw error;
        setIsOnline(true);
      } catch {
        setIsOnline(false);
      }
    };

    checkSupabase();

    // Recheck every 60s
    const interval = setInterval(checkSupabase, 60000);
    return () => clearInterval(interval);
  }, []);

  // While checking OR confirmed offline → show banner
  if (isOnline === null || isOnline === false) {
    return (
      <div className="bg-red-600 text-white text-center py-2 text-sm">
        ⚠️ Our backend is currently offline (Supabase paused). Some features may
        not work. Please try again later.
      </div>
    );
  }

  return null; // hide if online
}
