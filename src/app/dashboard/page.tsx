"use client";

import { supabaseBrowser } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useUser } from "@/page_components/UserProvider";
import { poppins } from "../fonts";

interface ProductItem {
  id: string;
  imageUrl: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  user_id: string;
  items: ProductItem[]; // array of products
  total: number;
  created_at: string;
}

export default function DashboardPage() {
  const { user } = useUser(); //  Context-based user
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true); // Loading state

  /*useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user]); */
  useEffect(() => {
    // Step 1: Still waiting for user to be determined. Run function again when when user is null or found.
    if (user === undefined) return;

    // Step 2: No user? Redirect and stop
    if (user === null) {
      router.push("/login");
      return;
    }

    // Step 3: User exists — now fetch orders
    const fetchOrders = async () => {
      const supabase = supabaseBrowser();
      const { data, error } = await supabase
        .from("orders_table")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error.message);
      } else {
        setOrders(data || []);
      }

      setLoading(false); // Done loading
    };

    fetchOrders();
  }, [user, router]);

  useEffect(() => {
    console.log("Current orders state:", orders);
  }, [orders]);

  return (
    <div className="max-w-2xl md:max-w-5xl  mx-auto px-4 py-4">
      <div>
        <h1
          className={`${poppins.className} text-[35px] font-semibold text-center text-white`}
        >
          Welcome back,
        </h1>

        {/* ⚡ Shows in Chrome, Firefox, and Safari (desktop + iOS). */}
        <h2 className="italic text-2xl text-center mb-2.5 bg-gradient-to-r from-[#4ade80] to-[#3b82f6] bg-clip-text text-transparent [-webkit-background-clip:text] [-webkit-text-fill-color:transparent]">
          {user?.email}
        </h2>

        <h3 className="text-center font-semibold text-[18px] text-white">
          Here are the orders you&apos;ve made so far:
        </h3>
      </div>

      {loading && (
        <div className="text-center">
          <p className="mt-2.5 font-semibold text-white">
            <i>Checking for Orders List</i>
          </p>
          <div className="mt-2.5 flex justify-center">
            <Loader2 className="animate-spin w-8 h-8 text-primary" />
          </div>
        </div>
      )}

      {orders.length > 0 && (
        <ul className="space-y-4 md:grid md:grid-cols-[repeat(auto-fit,_400px)] md:justify-between">
          {orders.map((order) => (
            <li
              key={order.id}
              className="border rounded-[15px] p-4 bg-white shadow-sm my-7"
            >
              <p className="text-sm">
                <span className="text-[16px] font-semibold">Product Id: </span>{" "}
                <span className="text-gray-900">{order.id}</span>
              </p>
              <p className="text-sm text-gray-500 my-3">
                Placed on:{" "}
                {new Date(order.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <div>
                {order.items.map((prod) => (
                  <div key={prod.id} className="mb-4 flex justify-between">
                    <div>
                      <div className="font-semibold mb-2.5">{prod.name}</div>
                      <div className="text-sm text-gray-900">
                        ${(prod.price / 100).toFixed(2)} x {prod.quantity}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${((prod.price * prod.quantity) / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
                <div className="font-semibold text-right">
                  Total: ${(order.total / 100).toFixed(2)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {user && !loading && orders.length === 0 && (
        <p className="text-center text-white mt-4 ">
          You haven&apos;t placed any orders yet.
        </p>
      )}

      <Button
        variant={"green"}
        className="mt-4 mb-8 cursor-pointer w-full text-lg"
        onClick={() => {
          router.push("/products");
          router.refresh();
        }}
      >
        Go to Products Page
      </Button>
    </div>
  );
}
