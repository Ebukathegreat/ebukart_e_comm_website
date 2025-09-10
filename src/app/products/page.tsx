import { stripe } from "@/lib/stripe";
import ProductsComp from "@/page_components/ProductsComp";

export default async function ProductsPage() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });
  return (
    <div>
      <h1 className="text-3xl font-bold text-center my-5 text-white">
        All Products
      </h1>

      <div>
        <ProductsComp productsData={products.data} />
      </div>
    </div>
  );
}
