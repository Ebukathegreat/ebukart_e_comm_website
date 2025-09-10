"use server";

import { stripe } from "@/lib/stripe";
import { CartItem } from "../../../store/cart_store";
import { redirect } from "next/navigation";

export const checkoutAction = async (formdata: FormData): Promise<void> => {
  const productsJSON = formdata.get("products") as string;
  const products = JSON.parse(productsJSON);
  const line_items = products.map((prod: CartItem) => ({
    price_data: {
      currency: "usd",
      product_data: { name: prod.name },
      unit_amount: prod.price,
    },
    quantity: prod.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  redirect(session.url!);
};
