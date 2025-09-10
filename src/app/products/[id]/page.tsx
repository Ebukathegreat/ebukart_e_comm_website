import { stripe } from "@/lib/stripe";
import ProductsDetailsComp from "@/page_components/ProductsDetailsComp";
import styles from "./productid.module.css";

export default async function ProductsDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prodDetails = await stripe.products.retrieve(id, {
    expand: ["default_price"],
  });

  const prodDetailsPlainObject = JSON.parse(JSON.stringify(prodDetails));

  return (
    <div>
      <div>
        <h1 className="font-bold text-3xl text-white text-center mt-2.5">
          Product
        </h1>
      </div>
      <div className={styles.productDetailsCompDiv}>
        <ProductsDetailsComp prodDetails={prodDetailsPlainObject} />
      </div>
    </div>
  );
}
