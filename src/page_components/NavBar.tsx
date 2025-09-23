"use client"; // Marks this component as a Client Component

import { Button } from "@/components/ui/button";
import Link from "next/link";
import styles from "./navbar.module.css";
import { SearchIcon, ShoppingCartIcon } from "lucide-react";
import { useCartStore } from "../../store/cart_store";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client"; // Supabase client for logout
import { useUser } from "./UserProvider"; // Custom hook providing authenticated user
import { useHasMounted } from "@/lib/my_personal_hooks/useHasMounted"; // Custom hook to prevent hydration errors
import Image from "next/image";

type NavBarProps = {
  openSearchInp: boolean;
  setOpenSearchInp: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function NavBar({
  openSearchInp,
  setOpenSearchInp,
}: NavBarProps) {
  const hasMounted = useHasMounted(); // Ensures code runs only after client hydration
  const { products } = useCartStore(); // State for cart items
  const totalQuantity = products.reduce((acc, prod) => acc + prod.quantity, 0); // Total items in cart

  const [menu, setMenu] = useState(false); // Mobile menu toggle
  const menuRef = useRef<HTMLDivElement | null>(null); // Reference to mobile menu for outside click detection
  const pathname = usePathname(); // Current URL path
  const router = useRouter(); // Next.js router for navigation
  const { user } = useUser(); // Authenticated user from context
  const supabase = supabaseBrowser(); // Supabase client (browser side)

  // Toggle mobile menu open
  function open() {
    setMenu(true);
  }

  // Close mobile menu
  function close() {
    setMenu(false);
  }

  // Toggle search input field visibility
  function openSearch() {
    setOpenSearchInp(!openSearchInp);
  }

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenu(false);
      }
    }

    function handleEscKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenu(false);
      }
    }

    if (menu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [menu]);

  // Close menu on route change
  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  if (!hasMounted) {
    // Avoid rendering until client mounted to prevent hydration mismatch
    return null;
  }

  return (
    <div className={styles.navbar}>
      <section className={styles.homeLinkLogoDivSect}>
        {/* Logo on the far left */}
        <div className={styles.homeLinkDiv}>
          <Link href="/">
            <Image
              alt="Ebukart logo"
              src="/Cropped_Ebukart_Logo_Design_On_Transparent_Background.png"
              fill
              className={styles.ebukart_Logo}
            />
          </Link>
        </div>
      </section>

      <section className={styles.sideMenuDivSect}>
        {/* Mobile side menu */}
        <div
          ref={menuRef}
          className={`${styles.sideMenuDiv} ${!menu ? styles.closedMenu : ""} ${
            pathname === "/" ? styles.homeNavLinks : ""
          }`}
        >
          {/* Close icon for mobile menu */}
          <div className={styles.cancelIconDiv}>
            <XMarkIcon
              className="w-6 h-6 mt-2.5 cursor-pointer hover:bg-black hover:text-white "
              onClick={close}
            />
          </div>

          {/* Navigation links */}
          {user && (
            <Link href="/profile" className="text-[16.4px]">
              {" "}
              Profile{" "}
            </Link>
          )}
          <Link href="/products"> Products </Link>
          <Link href="/categories"> Categories </Link>
          <Link href="/contact_us"> Contact Us </Link>

          {/* Logout button */}
          {user && (
            <div className={styles.logoutDiv}>
              <Link
                href=""
                onClick={async () => {
                  const { error } = await supabase.auth.signOut();
                  if (error) {
                    console.error("Logout failed:", error.message);
                    return;
                  }
                  router.push("/");
                  router.refresh();
                }}
                className={styles.logout}
              >
                Logout
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className={styles.inputAndOthersSect}>
        {/* Search button */}
        {pathname === "/products" ? (
          <div className={styles.searchBtnDiv} style={{ visibility: "hidden" }}>
            <Button variant="default" className="cursor-default">
              <SearchIcon />
            </Button>
          </div>
        ) : (
          <div className={styles.searchBtnDiv}>
            <Button
              variant={openSearchInp ? "destructive" : "green"}
              onClick={openSearch}
              className="cursor-pointer"
            >
              {openSearchInp ? <XMarkIcon /> : <SearchIcon />}
            </Button>
          </div>
        )}

        {/* Login/Dashboard, Cart, Mobile menu button */}
        <div className={styles.loginCartMenuDiv}>
          <div>
            {user ? (
              <Link href="/dashboard">
                <Button variant="green" className="cursor-pointer p-2">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="green" className="cursor-pointer">
                  Login
                </Button>
              </Link>
            )}
          </div>

          <div className={styles.cartAndQuantity}>
            <Link href="/checkout">
              <ShoppingCartIcon
                className={`mt-2.5 cursor-pointer text-white ${
                  pathname === "/" ? styles.homeNavCartIcon : ""
                } `}
              />
              {totalQuantity > 0 && (
                <div className={styles.totalQuantityDiv}>{totalQuantity}</div>
              )}
            </Link>
          </div>

          <Bars3Icon
            className={`${styles.hamburgerMenu} ${
              pathname === "/" ? styles.homeNavMenuIcon : ""
            } `}
            onClick={open}
          />
        </div>
      </section>
    </div>
  );
}
