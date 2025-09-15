import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import SearchComp from "@/page_components/SearchComp";
import Link from "next/link";

export default async function SearchPageComp() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
  });

  return (
    <div>
      <SearchComp productsData={products.data} />

      <div className="mb-9 px-6 text-center">
        <Link href={"/products"}>
          <Button
            variant={"green"}
            className="w-full md:w-[400px] cursor-pointer text-lg mt-5"
          >
            Check All Products
          </Button>
        </Link>
      </div>
    </div>
  );
}
