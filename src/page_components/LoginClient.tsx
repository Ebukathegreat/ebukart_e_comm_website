"use client"; // This tells Next.js that this file should run in the browser, not just the server

import { Button } from "@/components/ui/button"; // Importing a button component (fancy looking button)
import styles from "./login.module.css"; // Importing our custom CSS styles
import Link from "next/link"; // Lets us move between pages
import { useActionState, useEffect, useRef } from "react"; // React hooks – we'll use these to handle actions and side effects
import { loginAuth } from "@/app/actions/auth"; // This is the function that actually logs the user in
import { useRouter, useSearchParams } from "next/navigation"; // Helps us change or read the URL
import { toast } from "sonner"; // Using the new Sonner toast – small popup messages
import { useUser } from "@/page_components/UserProvider";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginClient() {
  // This handles form state (errors, loading, etc.)
  const [state, action, isPending] = useActionState(loginAuth, undefined);

  // Helps us go to another page
  const router = useRouter();

  // This helps us read things in the URL like ?reason=password-updated
  const searchParams = useSearchParams();
  const hasShownToast = useRef(false); // This will make the useEffect for password change run only once

  const user = useUser();
  const supabase = supabaseBrowser();

  //  This runs when the page loads (or when URL changes). It will run if the user is redirected here due to a password change.
  useEffect(() => {
    async function logoutAndRedirect() {
      if (
        searchParams.get("reason") === "password-updated" &&
        !hasShownToast.current
      ) {
        toast.success("Password changed. Please log in again.");

        hasShownToast.current = true; // Makes useEffect run once

        await supabase.auth.signOut();

        router.refresh(); // Makes sure that login button shows in Navbar instead of Dashboard button

        // Delay redirect a bit so toast can show, and then redirect
        setTimeout(() => {
          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete("reason");
          router.replace(newUrl.toString());
        }, 500); //  half a second delay
      }
    }
    logoutAndRedirect();
  }, [searchParams, router, supabase]);

  //  This checks if login was successful
  useEffect(() => {
    if (state && "redirectTo" in state && user !== null) {
      //  If yes, move the user to another page (like /dashboard)
      //router.push(state.redirectTo);
      // router.refresh();
      window.location.href = state.redirectTo; // Makes sure that Dashboard button shows instead of login button
    }
  }, [state, user]);

  return (
    <div className="px-4 my-5  md:max-w-[700px] mx-auto">
      <h1 className={styles.loginHeader}>Login</h1>

      {/* This is our login form – when submitted, it calls the loginAuth function */}
      <form action={action} className={styles.formClass}>
        {/* EMAIL INPUT */}
        <div>
          <label className="text-white">Email:</label>
          <input
            type="text"
            name="email"
            placeholder="Enter Email..."
            defaultValue={state && "email" in state ? String(state.email) : ""}
          />

          {/* If there are any errors with the email, show them */}
          {state && "errors" in state && state.errors.email.length > 0 && (
            <ul className="text-red-600">
              {state.errors.email.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        {/* PASSWORD INPUT */}
        <div>
          <label className="text-white">Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password..."
          />

          {/* If there are any errors with the password, show them */}
          {state && "errors" in state && state.errors.password.length > 0 && (
            <ul className="text-red-600">
              {state.errors.password.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          )}
        </div>

        {/* LOGIN BUTTON + LINK TO REGISTER PAGE */}
        <div className="mt-3 ">
          <Button
            type="submit"
            variant={"green"}
            className={styles.gradientButton}
            disabled={isPending} // disable while loading
          >
            {/* While logging in, show "Loading..." */}
            {isPending ? "Loading..." : "Login"}
          </Button>

          {/* If user doesn’t have an account, let them register */}
          <Link href={"/register"} className={styles.registerLink}>
            Or register here
          </Link>
        </div>
      </form>
    </div>
  );
}
