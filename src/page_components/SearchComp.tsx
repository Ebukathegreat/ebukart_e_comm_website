"use client";

import { useSearchParams } from "next/navigation";
import Stripe from "stripe";
import SearchCompCardLink from "./SearchCompCardLink";
import styles from "./searchcomp.module.css";

interface SearchCompProps {
  productsData: Stripe.Product[];
}

export default function SearchComp({ productsData }: SearchCompProps) {
  const qry = useSearchParams().get("query") || "";
  const filteredProducts = productsData.filter(
    (prod) =>
      prod.name.toLowerCase().includes(qry.toLowerCase()) ||
      prod.description?.toLowerCase().includes(qry.toLowerCase())
  );

  return (
    <ul className={styles.searchCompCardLinkDiv}>
      {filteredProducts.length > 0 ? (
        filteredProducts.map((ftProd) => (
          <li key={ftProd.id}>
            <SearchCompCardLink ftProd={ftProd} qry={qry} />
          </li>
        ))
      ) : (
        <h1 className="text-xl font-bold text-center mt-5 text-white">
          Unavailable
        </h1>
      )}
    </ul>
  );
}
