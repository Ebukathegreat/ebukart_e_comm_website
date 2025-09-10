import Image from "next/image";
import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import styles from "./deduplicategcomp.module.css";

interface DeDupliCategCompProps {
  ftProd: Stripe.Product;
}

export default function DeDupliCategComp({ ftProd }: DeDupliCategCompProps) {
  const productPrice = ftProd.default_price as Stripe.Price;
  return (
    <div className={styles.cardDiv}>
      <Link href={`/products/${ftProd.id}`}>
        <Card className={`pt-0 my-6 ${styles.card}`}>
          <div className="relative h-80  md:h-80 lg:h-60 ">
            <Image alt={ftProd.name} src={ftProd.images[0]} fill />
          </div>

          <div>
            <CardHeader className={styles.cardhdr}>
              <CardTitle>
                <h3>{ftProd.name}</h3>
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.cardcont}>
              {ftProd.description && <p>{ftProd.description}</p>}
              {productPrice && productPrice.unit_amount && (
                <h3 className="font-semibold">
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
