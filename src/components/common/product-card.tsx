"use client";

import Image from "next/image";
import { Button } from "@/components/common/button";
import { ShoppingBag, Heart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/store/use-auth";
import { useLoginModal } from "@/hooks/use-login-modal";
import { useCart } from "@/store/use-cart";
import { useToast } from "@/hooks/use-toast";

export function ProductCard({
  images,
  title,
  price,
  customization,
  onWishlist,
  isWishlisted,
  id,
  specifications,
}: {
  images: string[];
  title: string;
  price: string;
  customization: boolean;
  onWishlist?: () => void;
  isWishlisted?: boolean;
  id: string;
  specifications?: { type: string; value: string }[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const { isAuthenticated } = useAuth();
  const { openModal } = useLoginModal();
  const addToCart = useCart(state => state.addToCart);
  const { toast } = useToast();
  
  // Use first image as default, second image on hover
  const defaultImage = images[0];
  const hoverImage = images[1] || images[0]; // Fallback to first image if no second image

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    if (!isAuthenticated) {
      openModal("Add Item to Cart", () => {
        // This will be called after successful login
        addProductToCart();
      });
      return;
    }
    
    addProductToCart();
  };

  const addProductToCart = () => {
    const basePrice = Number(price.replace(/[^0-9.-]+/g, ""));
    
    // Debug: Log specifications being passed to cart
    console.log('ProductCard - Adding to cart with specifications:', specifications);
    
    addToCart({
      productId: id,
      title: title,
      image: defaultImage,
      basePrice: basePrice,
      customizations: {},
      customizationTotal: 0,
      totalPrice: basePrice,
      quantity: 1,
      delivery: {
        "Private Fitting": { label: "None", price: 0 },
        "Processing Time": { label: "Default", price: 0 }
      },
      specifications: specifications
    });
    
    toast.success(`${title} has been added to your cart.`);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    
    if (!isAuthenticated) {
      openModal("Add Item to Wishlist", () => {
        // This will be called after successful login
        onWishlist?.();
      });
      return;
    }
    
    onWishlist?.();
  };

  return (
    <Link href={`/shop/${id}`} className="block">
      <motion.div 
        className="bg-white rounded-2xl overflow-hidden transition-shadow duration-200 hover:shadow-lg hover:shadow-[#4A85E4]/20 cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="aspect-[4/5] w-full relative">
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isHovered ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={defaultImage}
              alt={title}
              priority
              fill
              className="object-cover rounded-t-2xl"
              sizes="(min-width: 640px) 250px, 100vw"
            />
          </motion.div>
          <motion.div
            className="absolute inset-0"
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src={hoverImage}
              alt={title}
              priority
              fill
              className="object-cover rounded-t-2xl"
              sizes="(min-width: 640px) 250px, 100vw"
            />
          </motion.div>
        </div>
        <div className="p-4 flex flex-col gap-2">
          <div className="font-medium text-xs md:text-base xl:text-lg">
            <span className="hover:underline text-inherit">
              {title}
            </span>
          </div>
          <div className="text-[#4A85E4] font-semibold text-base md:text-lg xl:text-xl">{price}</div>
          <div className="text-xs text-[#162844]">Customization: {customization ? "Yes" : "No"}</div>
          <div className="grid grid-cols-12 gap-2 mt-2 relative z-10" onClick={(e) => e.stopPropagation()}>
            <motion.div
              className="col-span-9 md:col-span-10 lg:col-span-10"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="primary"
                icon={<ShoppingBag size={18} className="text-xs md:text-base xl:text-lg hidden md:block"/>}
                className="w-full bg-white border border-[#E4E7EC] text-black hover:bg-gray-50 text-xs md:text-base xl:text-lg !px-1 !lg:px-4"
                onClick={handleAddToCart}
              >
                Add to Cart
              </Button>
            </motion.div>
            <motion.button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              type="button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`col-span-3 md:col-span-2 lg:col-span-2 w-full h-10 flex items-center justify-center rounded-md md:border border-gray-200 hover:bg-gray-100 transition-colors ${isWishlisted ? "text-[#4A85E4]" : "text-gray-400"}`}
            >
              <Heart fill={isWishlisted ? "#4A85E4" : "none"} className="text-xs md:text-base xl:text-lg "/>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
} 