import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";
import styles from "./productslist.module.css";

interface ProductsListProps {
  ftProd: Stripe.Product;
}

export default function ProductsList({ ftProd }: ProductsListProps) {
  const productPrice = ftProd.default_price as Stripe.Price;
  return (
    <div className={styles.cardDiv}>
      <Link href={`/products/${ftProd.id}`}>
        <Card className={`pt-0 my-6 ${styles.card}`}>
          <div className="relative h-80 ">
            <Image alt={ftProd.name} src={ftProd.images[0]} fill />
          </div>

          <div>
            <CardHeader className={styles.cardhdr}>
              <CardTitle>
                <h3 className="font-bold text-xl">{ftProd.name}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.cardcont}>
              {ftProd.description && (
                <p className="font-medium italic my-1.5">
                  {ftProd.description}
                </p>
              )}
              {productPrice && productPrice.unit_amount && (
                <h3 className="font-semibold italic">
                  ${(productPrice.unit_amount / 100).toFixed(2)}
                </h3>
              )}
            </CardContent>
          </div>
        </Card>
      </Link>
    </div>
  );
}
