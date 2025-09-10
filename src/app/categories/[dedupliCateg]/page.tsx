import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import DeDupliCategComp from "@/page_components/DedupliCategComp";
import Link from "next/link";
import styles from "./deduplicateg.module.css";

export default async function ProductCategory({
  params,
}: {
  params: Promise<{ dedupliCateg: string }>;
}) {
  const { dedupliCateg } = await params;

  const productsList = await stripe.products.list({
    expand: ["data.default_price"],
  });

  const filteredProducts = productsList.data.filter(
    (prod) =>
      prod.metadata.Category.trim().toLowerCase() ===
      dedupliCateg.trim().toLowerCase()
  );

  console.log(filteredProducts);

  return (
    <div>
      <h1 className="text-center font-bold text-3xl text-white mt-3">
        {dedupliCateg}
      </h1>

      <ul className={styles.dedupliCategCardsUl}>
        {filteredProducts.map((ftProd, key) => (
          <li key={ftProd.id}>
            <DeDupliCategComp ftProd={ftProd} />
          </li>
        ))}
      </ul>

      <div className={styles.btnLinkDiv}>
        <Link href={"/categories"}>
          <Button
            variant={"green"}
            className="w-full md:w-[520px] cursor-pointer text-lg"
          >
            Check Other Categories
          </Button>
        </Link>
      </div>
    </div>
  );
}
