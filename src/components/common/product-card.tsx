import Image from "next/image";
import { Button } from "@/components/common/button";
import { ShoppingBag, Heart } from "lucide-react";

export function ProductCard({
  image,
  title,
  price,
  customization,
  onAddToCart,
  onWishlist,
  isWishlisted,
}: {
  image: string;
  title: string;
  price: string;
  customization: boolean;
  onAddToCart?: () => void;
  onWishlist?: () => void;
  isWishlisted?: boolean;
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:shadow-[#4A85E4]/20">
      <div className="aspect-[4/5] w-full relative">
        <Image
          src={image}
          alt={title}
          priority
          fill
          className="object-cover rounded-t-2xl"
          sizes="(min-width: 640px) 250px, 100vw"
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="font-medium text-base">{title}</div>
        <div className="text-[#4A85E4] font-semibold text-lg">{price}</div>
        <div className="text-xs text-[#162844]">Customization: {customization ? "Yes" : "No"}</div>
        <div className="flex gap-2 mt-2">
          <Button
            variant="primary"
            icon={<ShoppingBag size={18} />}
            className="flex-1 bg-white border border-[#E4E7EC] text-black hover:bg-gray-50"
            onClick={onAddToCart}
          >
            Add to Cart
          </Button>
          <button
            onClick={onWishlist}
            className={`w-10 h-10 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-100 transition-colors ${
              isWishlisted ? "text-[#4A85E4]" : "text-gray-400"
            }`}
            aria-label="Add to wishlist"
            type="button"
          >
            <Heart fill={isWishlisted ? "#4A85E4" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
} 