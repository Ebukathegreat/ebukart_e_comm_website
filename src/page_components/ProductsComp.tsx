"use client";

import Stripe from "stripe";
import ProductsList from "./ProductsList";
import styles from "./productscomp.module.css";
import { useState } from "react";

interface ProductsCompProps {
  productsData: Stripe.Product[];
}

export default function ProductsComp({ productsData }: ProductsCompProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = productsData.filter(
    (prod) =>
      prod.name
        .toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim()) ||
      prod.description
        ?.toLowerCase()
        .trim()
        .includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div>
      <div className={styles.filterInpDiv}>
        <input
          type="text"
          placeholder="Filter Products by name/description"
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
      </div>

      <ul className={styles.productsListDiv}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((ftProd, key) => (
            <li key={key}>
              <ProductsList ftProd={ftProd} />
            </li>
          ))
        ) : (
          <p className="text-white font-bold text-2xl italic text-center mt-5">
            The product you&apos;re looking for isn&apos;t available.
          </p>
        )}
      </ul>
    </div>
  );
}
