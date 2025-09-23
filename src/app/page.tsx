import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import Image from "next/image";
import Carousel from "../page_components/Carousel";
import styles from "./home.module.css";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
  });

  return (
    <div className={styles.homeDiv}>
      <section className={styles.sect1}>
        <div className="mt-5 ">
          <div className={styles.welcome_LogoDiv}>
            <div className={styles.welcome}>Welcome to</div>
            <div className={styles.ebukartLogoDiv}>
              <Image
                alt="Ebukart logo"
                src="/Cropped_Ebukart_Logo_Design_On_Transparent_Background.png"
                fill
                className={styles.ebukart_Logo}
              />
            </div>
          </div>

          <p className={styles.discover}>
            Discover the latest products at the best prices.
          </p>
          <p className={styles.click}>
            Click the button below to start your journey.
          </p>
          <p className="animate-bounce  mx-auto w-[70%] mt-3  text-center text-2xl  sm:w-[58%]  ">
            👇
          </p>
          <div className={styles.browseAllBtnLinkDiv}>
            <Link href="/products">
              <Button variant={"green"} className={styles.browseAllBtn}>
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>

        <div className={styles.carouselDiv}>
          <Suspense
            fallback={
              <p className="text-center text-white">Loading products...</p>
            }
          >
            <Carousel productsData={products.data} />
          </Suspense>
        </div>
      </section>

      <section className="about-section bg-white text-gray-800 py-16 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-6 tracking-wide text-gray-900">
            About Ebukart
          </h2>
          <p className=" leading-relaxed text-gray-600 italic">
            Ebukart is a unique e-commerce brand founded and managed by
            <span className="font-semibold text-gray-900">
              {" "}
              Ebuka Chigozie.{" "}
            </span>
            With a focus on elegance, quality, and value, every product in our
            collection is hand-picked to meet the highest standards. We believe
            luxury should be accessible—without compromise.
          </p>
        </div>
      </section>
    </div>
  );
}
