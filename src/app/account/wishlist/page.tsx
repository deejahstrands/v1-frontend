'use client'

import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import React, { useState, useEffect } from 'react';
import { useWishlist } from '@/store/use-wishlist';
import { ProductCard } from '@/components/common/product-card';
import { useToast } from '@/hooks/use-toast';
import { products } from '@/data/products';
import { Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';

export default function WishlistPage() {
  const { items: wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { toast } = useToast();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Get full product data for wishlist items
  const getWishlistProducts = () => {
    return wishlistItems.map(wishlistItem => {
      const product = products.find(p => p.id === wishlistItem.productId);
      return {
        ...wishlistItem,
        ...product,
        id: wishlistItem.productId, // Ensure id property exists
        // Use wishlist data for price if available, otherwise use product data
        price: wishlistItem.price || product?.price || '₦0',
        image: wishlistItem.image || product?.images?.[0] || '',
        images: product?.images || [wishlistItem.image || ''],
        customization: product?.customization || false,
        specifications: product?.specifications || [],
      };
    }).filter(Boolean); // Remove any undefined items
  };



  const handleRemoveFromWishlist = (productId: string, productTitle: string) => {
    removeFromWishlist(productId);
    toast.success(`${productTitle} has been removed from your wishlist.`);
  };

  const handleClearWishlist = () => {
    clearWishlist();
    toast.success('Your wishlist has been cleared.');
  };

  const wishlistProducts = getWishlistProducts();

  return (
    <div className="pb-8 lg:pb-12">
      <BannerSection
        title="WISHLIST"
        description="View all your saved products to be purchased here"
        bgImage="/images/bg2.svg"
        disableAnimation={!isHydrated}
        breadcrumb={
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Wishlist' }
            ]}
          />
        }
      />
      
      <SectionContainer>
        {!isHydrated ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : wishlistProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-6">Start adding products to your wishlist to see them here.</p>
            <Link
              href="/shop"
              className="px-6 py-3 bg-[#4A85E4] text-white rounded-lg hover:bg-[#3A75D4] transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="mt-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-ethereal font-semibold mb-2">
                  YOUR WISHLIST
                </h2>
                <p className="text-gray-600">
                  {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} in your wishlist
                </p>
              </div>
              <button
                onClick={handleClearWishlist}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="relative group"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    ease: "easeOut"
                  }}
                  whileHover={{ 
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                >
                  {/* Remove from wishlist button */}
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id, product.title)}
                    className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Product Card */}
                  <div className="relative">
                    <ProductCard
                      id={product.id}
                      images={product.images}
                      title={product.title}
                      price={product.price}
                      customization={product.customization}
                      specifications={product.specifications}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </SectionContainer>
    </div>
  );
} 