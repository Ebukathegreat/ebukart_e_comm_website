// We are using Zustand to manage the shopping cart — like a brain that remembers what's in your cart
import { create } from "zustand";

// This helps us *remember the cart* even if the page is reloaded or closed
import { persist } from "zustand/middleware";

// This is the shape of each product in the cart — like a box with product details
export interface CartItem {
  id: string; // A special ID to know which product it is
  name: string; // The product's name (like "Apple" or "Shoes")
  price: number; // How much the product costs
  imageUrl: string | null; // Picture of the product (can be missing/null)
  quantity: number; // How many of this product is in the cart
}

// This is the full cart store — like the cart's control panel
interface CartStore {
  products: CartItem[]; // A list of all products in the cart
  hasHydrated: boolean; // A flag that becomes true once the cart is loaded from localStorage
  setHasHydrated: (state: boolean) => void; // A function to manually set hasHydrated
  addProduct: (newProduct: CartItem) => void; // A function to add a product to the cart
  removeProduct: (id: string) => void; // A function to remove one quantity of a product
  clearCart: () => void; // A function to empty the whole cart
}

// We create the store — the cart brain that remembers what we do
export const useCartStore = create<CartStore>()(
  // Make it remember across refreshes by saving in the browser
  persist(
    // This is where we define what the cart does
    (set, get) => ({
      // Start with an empty cart (nothing inside yet)
      products: [],

      // This tracks if the store has finished loading from localStorage
      hasHydrated: false,

      // This lets us manually change the 'hasHydrated' state
      setHasHydrated: (state: boolean) => set({ hasHydrated: state }),

      // This adds a product to the cart
      addProduct: (newProduct) =>
        set((state) => {
          // First, check if the product is already in the cart
          const existing = state.products.find(
            (prod) => prod.id === newProduct.id
          );

          // If it already exists, just increase the quantity
          // If it doesn't exist, add it as a new item
          return {
            products: existing
              ? state.products.map((prod) =>
                  prod.id === newProduct.id
                    ? { ...prod, quantity: prod.quantity + newProduct.quantity }
                    : prod
                )
              : [...state.products, newProduct],
          };
        }),

      // This removes ONE quantity of a product from the cart
      removeProduct: (id) =>
        set((state) => {
          return {
            products: state.products
              .map((prod) =>
                prod.id === id ? { ...prod, quantity: prod.quantity - 1 } : prod
              )
              // If the quantity becomes 0, remove the product completely from the cart
              .filter((ftProd) => ftProd.quantity > 0),
          };
        }),

      // This clears the cart — like clicking a "Reset" button
      clearCart: () => set(() => ({ products: [] })),
    }),

    {
      name: "cart", // Give this store a name in the browser so it can be saved and loaded later

      // This is called automatically when data is loaded from localStorage
      onRehydrateStorage: () => (state) => {
        console.log("Zustand cart store hydrated from localStorage");
        state?.setHasHydrated(true); // Tell Zustand we've finished loading the cart
      },
    }
  )
);
