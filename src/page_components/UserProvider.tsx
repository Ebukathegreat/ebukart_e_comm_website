"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabaseBrowser } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";

// Define the shape of the context value
interface UserContextType {
  user: User | null | undefined; // Current authenticated user, null if not logged in, undefined if still checking
  signOut: () => Promise<void>; // 🔹 NEW: expose signOut function so UI can log out cleanly
}

// Create the context with a default value of undefined
const UserContext = createContext<UserContextType | undefined>(undefined);

// Props type for the provider component
interface UserProviderProps {
  children: ReactNode; // React children elements
}

/**
 * UserProvider
 * -------------
 * This component wraps the entire app and keeps track of the user's authentication state.
 * It uses Supabase to:
 *   1. Fetch the current authenticated user on mount.
 *   2. Listen for auth state changes (login, logout, refresh).
 * The `user` state is made available to the whole app through context.
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null | undefined>(undefined); // State to store the current user (null = no user, undefined = loading)
  const supabase = supabaseBrowser(); // Create a Supabase browser client

  useEffect(() => {
    async function init() {
      // 🔹 NEW: Look for both `code` and `token` query params (Supabase may send either)
      const url = new URL(window.location.href);
      const code =
        url.searchParams.get("code") || url.searchParams.get("token");

      if (code) {
        // 🔹 NEW: Always try to exchange code/token for a Supabase session
        const { data, error } = await supabase.auth.exchangeCodeForSession(
          code
        );
        if (error) {
          console.error("Session exchange failed:", error);
          setUser(null);
        } else {
          setUser(data?.session?.user ?? null);
        }
      } else {
        // 1. Fetch the latest user information on component mount.
        // Using getSession() ensures we always have the freshest, verified user data
        const { data } = await supabase.auth.getSession();
        setUser(data.session?.user || null);
      }

      // 2. Listen to authentication state changes (login/logout events)
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          setUser(session?.user || null);
        }
      );

      // 3. Cleanup: unsubscribe from the auth listener when this component unmounts.
      return () => authListener.subscription.unsubscribe();
    }

    init();
  }, [supabase]);

  // 🔹 NEW: logout function updates context immediately so UI reacts
  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("supabase.auth.token");
    sessionStorage.clear();
    setUser(null); // force UI update
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  };

  return (
    // Provide the `user` value and signOut function to all child components via context.
    <UserContext.Provider value={{ user, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * useUser Hook
 * -------------
 * A custom hook to access the current authenticated user anywhere in the app.
 * Throws an error if called outside of a <UserProvider>.
 */
export function useUser(): UserContextType {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}
