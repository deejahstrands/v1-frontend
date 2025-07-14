import ProductDetailPage from "@/components/products/product-details/ProductDetailPage";
import { products } from "@/data/products";

export default async function ProductDetailRoute({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // ✅ Await params
  const product = products.find((p) => p.id === id);

  if (!product) {
    return <div className="p-8 text-center text-gray-500">Product not found</div>;
  }

  return <ProductDetailPage product={product} />;
}
