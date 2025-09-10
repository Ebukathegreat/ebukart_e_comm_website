import { stripe } from "@/lib/stripe";
import CategoriesComp from "@/page_components/CategoriesComp";

export default async function Categories() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });
  return (
    <div>
      <CategoriesComp productsData={products.data} />
    </div>
  );
}
