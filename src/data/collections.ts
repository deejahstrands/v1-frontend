import { products } from "./products";

// Get all products with customization: false
const collectionProducts = products.filter(p => p.customization === false).map(p => p.id);

export const collections = [
  {
    id: "1",
    title: "Ready-to-Wear Wigs",
    description: "Discover our curated collection of ready-to-wear wigs. No customization needed—just style and go! Perfect for effortless beauty and everyday glam.",
    productIds: collectionProducts,
  },
  // Add more collections as needed
]; 