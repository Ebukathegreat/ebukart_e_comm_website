import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export function supabaseServer(cookieHeader?: string) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {
        getAll: async () => {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        },
        setAll: async (newCookies) => {
          const cookieStore = await cookies();
          for (const { name, value, options } of newCookies) {
            cookieStore.set(name, value, options);
          }
        },
      },
    }
  );
}
