"use client"; // Tells Next.js this is a Client Component (needed because we use hooks like useState/useEffect)

import { FormEvent, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import NavBar from "../page_components/NavBar";
import "./globals.css"; // Global CSS
import { UserProvider } from "@/page_components/UserProvider";
import { supabaseBrowser } from "@/lib/supabase/client";
import { Toaster } from "sonner";
import BackendBanner from "@/page_components/BackendBanner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Controls whether the search input is visible
  const [openSearchInp, setOpenSearchInp] = useState(false);

  // Holds the user's search input value
  const [searchTerm, setSearchTerm] = useState("");

  // For client-side navigation
  const router = useRouter();

  // Current page path (e.g., "/products", "/dashboard")
  const pathname = usePathname();

  // Handle search form submission
  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (searchTerm.trim()) {
      // Redirect to search results page with query
      router.push(`/search?query=${encodeURIComponent(searchTerm)}`);
      setSearchTerm(""); // Clear input
    }
  }

  //  Automatically sign out if the session is broken (e.g. user was deleted from Supabase)
  useEffect(() => {
    const cleanupInvalidSession = async () => {
      const supabase = supabaseBrowser(); // Create browser Supabase client
      const { data, error } = await supabase.auth.getSession(); // Get current session

      if (error || !data.session) {
        // If there's no session or a refresh token error, clear local session
        await supabase.auth.signOut(); // Clears localStorage and cookies
        // Optional: Redirect to login page or show fallback UI
        // router.push("/login");
      }
    };

    cleanupInvalidSession(); // Run on initial load
  }, [router]);

  return (
    <html lang="en">
      <head>
        {/* Load Offline Font Awesome (from public folder) */}
        <link rel="stylesheet" href="/fontawesomeicons/css/all.css" />
      </head>
      <body>
        <BackendBanner /> {/*  shows only if Supabase is offline */}
        {/* Wrap entire app in UserProvider so we can access `user` on any page */}
        <UserProvider>
          <header>
            {/* Navbar receives toggle state for search input */}
            <NavBar
              setOpenSearchInp={setOpenSearchInp}
              openSearchInp={openSearchInp}
            />

            {/* Only show search input if toggled open and NOT on the products page */}
            {openSearchInp && pathname !== "/products" && (
              <div className="tog-Search-Inp-Div">
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    placeholder="Search Products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </form>
              </div>
            )}
          </header>
          {/* Render page content */}
          <main>{children}</main>
          <Toaster richColors position="top-center" /> {/* ← toast container */}
        </UserProvider>
      </body>
    </html>
  );
}
