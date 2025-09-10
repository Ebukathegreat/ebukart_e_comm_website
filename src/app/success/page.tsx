"use client";
// Ensures this component is rendered on the client-side —
// required for Zustand, Supabase auth, and DOM/browser APIs.

import { Button } from "@/components/ui/button"; // UI button component
import Link from "next/link"; // Navigation between pages
import { useCartStore } from "../../../store/cart_store"; // Zustand store for cart
import { useEffect, useState } from "react"; // React hooks
import { supabaseBrowser } from "@/lib/supabase/client"; // Supabase client for browser (auth + database)

export default function SuccessPage() {
  // Get the cart products and a function to clear the cart
  const { products, clearCart, hasHydrated } = useCartStore();

  // State to track whether the order is still being saved
  const [saving, setSaving] = useState(true);

  useEffect(() => {
    if (!hasHydrated) return; // Wait until Zustand has loaded from localStorage
    // Create a Supabase client for browser-side use
    const supabase = supabaseBrowser();

    // Function to save the current order to the database
    const saveOrderToSupabase = async () => {
      // Get currently logged-in user from Supabase
      const { data: userData } = await supabase.auth.getUser();
      const user = userData?.user;

      // If there's no user or the cart is empty, skip saving
      if (!user || products.length === 0) {
        setSaving(false);
        return;
      }

      // Calculate total cost of all cart items
      const total = products.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // Insert the order into the 'orders_table' in Supabase
      const { error } = await supabase.from("orders_table").insert([
        {
          user_id: user.id,
          items: products,
          total,
        },
      ]);

      // Log any errors or clear cart if successful
      if (error) {
        console.error(" Failed to save order:", error.message);
      } else {
        console.log("Order saved for user:", user.id);
        clearCart(); // Empty the cart after saving
      }

      // Update UI to show we're done saving
      setSaving(false);
    };
    saveOrderToSupabase();
  }, [hasHydrated]);

  return (
    <div className="min-h-screen bg-black md:flex md:items-center md:justify-center px-4">
      <div className="bg-zinc-900 mt-4 md:mt-0 rounded-2xl shadow-xl p-4 max-w-md w-full text-center border border-zinc-800">
        {/* Heading shows current saving status */}
        <h1 className="font-bold text-2xl md:text-3xl text-white mb-4">
          {saving ? "Saving Your Order..." : "Payment Successful 🎉"}
        </h1>

        {/* Message changes based on saving state */}
        <p className="text-zinc-300 text-sm mb-6">
          {saving
            ? "Please wait while we process your order."
            : "Thank you for your purchase! Your order has been saved successfully."}
        </p>

        {/* Only show 'Continue Shopping' once order is saved */}
        {!saving && (
          <Link href={"/products"}>
            <Button
              variant={"green"}
              className="cursor-pointer w-full py-3 text-base font-semibold rounded-xl"
            >
              Continue Shopping
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
