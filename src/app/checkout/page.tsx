"use client";

import { Card } from "@/components/ui/card";
import { useCartStore } from "../../../store/cart_store";
import { Button } from "@/components/ui/button";
import { checkoutAction } from "./checkout_action";
import Link from "next/link";

export default function CheckoutPage() {
  const { products, addProduct, removeProduct } = useCartStore();

  // calculate total
  const total = products.reduce(
    (acc, prod) => acc + prod.price * prod.quantity,
    0
  );

  // if cart is empty
  if (total === 0 || products.length === 0) {
    return (
      <div className="px-4 mt-8 text-white text-center">
        <h1 className="font-bold text-2xl">Your cart is empty!!!</h1>
        <h2 className="mt-3 text-lg">
          Kindly go to the products page and add some products to your cart.
          <span className="block animate-bounce text-2xl mt-2">👇</span>
        </h2>

        <div className="w-full flex justify-center mt-3">
          <Link href={"/products"}>
            <Button variant="green" className="text-white text-lg px-6 py-3">
              Go to Products Page
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // if cart has items
  return (
    <div className="px-4 mt-8 text-white max-w-2xl mx-auto">
      {/* Page Title */}
      <h1 className="text-center font-bold text-3xl mb-6">Checkout</h1>

      {/* Order Summary Card */}
      <Card className="bg-gray-200 shadow-lg p-6 rounded-2xl ">
        <h2 className="font-bold text-xl">Order Summary</h2>
        <ul className="divide-y divide-gray-700 ">
          {products.map((prod) => (
            <li
              key={prod.id}
              className="flex justify-between items-center py-4"
            >
              <div>
                <p className="text-lg font-bold">{prod.name}</p>
                <div className="mt-3 flex items-center">
                  <Button
                    onClick={() => removeProduct(prod.id)}
                    variant="destructive"
                    className="cursor-pointer px-3 py-1 text-lg"
                  >
                    -
                  </Button>
                  <span className="mx-3 text-lg">{prod.quantity}</span>
                  <Button
                    onClick={() => addProduct({ ...prod, quantity: 1 })}
                    variant="green"
                    className="cursor-pointer px-3 py-1 text-lg"
                  >
                    +
                  </Button>
                </div>
              </div>

              <div className="font-bold text-lg">
                ${((prod.price * prod.quantity) / 100).toFixed(2)}
              </div>
            </li>
          ))}
        </ul>

        <h2 className="text-xl font-bold ">
          Total: ${(total / 100).toFixed(2)}
        </h2>
      </Card>

      {/* Proceed to Payment */}
      <div className="my-6">
        <form action={checkoutAction}>
          <input
            type="hidden"
            name="products"
            value={JSON.stringify(products)}
          />
          <Button
            type="submit"
            variant={"green"}
            className="w-full cursor-pointer text-lg text-white py-4 transition-transform duration-500 hover:scale-105"
          >
            Proceed to Payment
          </Button>
        </form>
      </div>

      {/* Add More Products */}
      <div className="mb-5">
        <Link href="/products">
          <Button
            variant={"green"}
            className="w-full cursor-pointer text-lg text-white py-4 mb-3 transition-transform duration-500 hover:scale-105"
          >
            Or Add More Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
