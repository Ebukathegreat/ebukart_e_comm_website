"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Stripe from "stripe";
import styles from "./productdetailscomp.module.css";
import { useCartStore } from "../../store/cart_store";
import { StarIcon } from "@heroicons/react/16/solid";
import Link from "next/link";
import { Card } from "@/components/ui/card";

interface ProductsDetailsCompProps {
  prodDetails: Stripe.Product;
}

export default function ProductsDetailsComp({
  prodDetails,
}: ProductsDetailsCompProps) {
  const prodPrice = prodDetails.default_price as Stripe.Price;

  const { products, addProduct, removeProduct } = useCartStore();

  const sameproduct = products.find((prod) => prod.id === prodDetails.id);

  const quantity = sameproduct ? sameproduct.quantity : 0;

  function add() {
    addProduct({
      id: prodDetails.id,
      name: prodDetails.name,
      price: prodPrice.unit_amount as number,
      imageUrl: prodDetails.images ? prodDetails.images[0] : null,
      quantity: 1,
    });
  }

  function remove() {
    removeProduct(prodDetails.id);
  }

  return (
    <div className={styles.cardDiv}>
      <Card className={styles.card}>
        <div className="relative h-80 md:h-80 lg:h-60">
          <Image alt={prodDetails.name} src={prodDetails.images[0]} fill />
        </div>

        <div className="p-2.5 lg:h-44">
          <h1 className="font-bold text-xl">{prodDetails.name}</h1>
          {prodDetails.description && (
            <p className="font-medium italic my-1.5">
              {prodDetails.description}
            </p>
          )}
          {prodPrice && prodPrice.unit_amount && (
            <h2 className="font-semibold  mb-1.5">
              ${(prodPrice.unit_amount / 100).toFixed(2)}
            </h2>
          )}
          <div className={styles.iconsDiv}>
            <StarIcon className="w-5 h-5" />
            <StarIcon className="w-5 h-5" />
            <StarIcon className="w-5 h-5" />
            <StarIcon className="w-5 h-5" />
            <i className="fas fa-star-half-alt"></i>
          </div>

          <div className="my-2.5">
            <Button
              onClick={remove}
              variant="default"
              className="cursor-pointer"
            >
              -
            </Button>
            <span className="mx-2.5">{quantity}</span>
            <Button onClick={add} variant="default" className="cursor-pointer">
              +
            </Button>
          </div>
        </div>
      </Card>

      <div className="mt-7">
        <Link href={"/products"}>
          <Button variant={"green"} className="w-full cursor-pointer text-lg">
            Select Other Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
