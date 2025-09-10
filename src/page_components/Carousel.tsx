"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { useEffect, useState } from "react";
import Stripe from "stripe";
import styles from "./carousel.module.css";

interface CarouselProps {
  productsData: Stripe.Product[];
}
export default function Carousel({ productsData }: CarouselProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => (prev + 1) % productsData.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [productsData.length]);

  const currentProduct = productsData[count];
  const currentProductPrice = productsData[count].default_price as Stripe.Price;

  return (
    <div className={styles.cardDiv}>
      <Card className={`h-120 bg-amber-950 ${styles.card}`}>
        {currentProduct.images && currentProduct.images[0] && (
          <div>
            <Image
              alt="Product Images"
              src={currentProduct.images[0]}
              fill
              objectFit="inherit"
            />
          </div>
        )}
        <div>
          <CardHeader className={styles.cardHdr}>
            <CardTitle>
              <h1>{currentProduct.name}</h1>
              {currentProductPrice && currentProductPrice.unit_amount && (
                <h2 className="text-lg">
                  ${(currentProductPrice.unit_amount / 100).toFixed(2)}
                </h2>
              )}
            </CardTitle>
          </CardHeader>
        </div>
      </Card>
    </div>
  );
}
