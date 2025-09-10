import Link from "next/link";
import Stripe from "stripe";
import styles from "./categoriescomp.module.css";

interface CategoriesCompProps {
  productsData: Stripe.Product[];
}

export default function CategoriesComp({ productsData }: CategoriesCompProps) {
  const allCategories = productsData
    .flatMap((prod) => prod.metadata?.Category)
    .map((cat) => cat.trim());

  const deduplicatedCategories = [...new Set(allCategories)].sort();

  return (
    <div className="mt-6.5">
      <ul className={styles.dedepluCategDiv}>
        {deduplicatedCategories.map((dedepluCateg, key) => (
          <li key={key} className="my-2.5">
            <Link href={`/categories/${dedepluCateg}`}>
              <div className={styles[`color${key % 5}`]}>{dedepluCateg}</div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
