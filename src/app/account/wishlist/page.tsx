'use client'

import { BannerSection } from '@/components/common/banner-section';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { SectionContainer } from '@/components/common/section-container';
import React, { useState, useEffect } from 'react';
import { useWishlist } from '@/store/use-wishlist';
import { useAuth } from '@/store/use-auth';
import { ProductCard } from '@/components/common/product-card';
import { useToast } from '@/hooks/use-toast';
import { Trash2, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { 
    items: localWishlistItems, 
    apiItems: apiWishlistItems,
    loading,
    error,
    totalItems,
    removeFromWishlist,
    removeFromWishlistApi,
    moveToCart,
    clearWishlist,
    fetchWishlist,
    clearError
  } = useWishlist();
  const { toast } = useToast();
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Fetch wishlist data when page is accessed (only for authenticated users)
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      fetchWishlist(1, 20); // Fetch first page with 20 items
    }
  }, [isHydrated, isAuthenticated, fetchWishlist]);

  // Get wishlist products based on authentication status
  const getWishlistProducts = () => {
    if (isAuthenticated) {
      // Use API data for authenticated users
      return apiWishlistItems.map(item => ({
        id: item.id,
        title: item.name,
        price: `₦${item.basePrice.toLocaleString()}`,
        image: item.thumbnail,
        images: [item.thumbnail],
        customization: item.customization,
        specifications: [],
        category: item.category?.name || '',
        isApiItem: true
      }));
    } else {
      // Use local storage data for unauthenticated users
      return localWishlistItems.map(wishlistItem => ({
        id: wishlistItem.productId,
        title: wishlistItem.title,
        price: wishlistItem.price,
        image: wishlistItem.image || '',
        images: [wishlistItem.image || ''],
        customization: false,
        specifications: [],
        category: wishlistItem.category || '',
        isApiItem: false
      }));
    }
  };

  const handleRemoveFromWishlist = async (productId: string, productTitle: string) => {
    try {
      if (isAuthenticated) {
        await removeFromWishlistApi(productId);
      } else {
        removeFromWishlist(productId);
      }
      toast.success(`${productTitle} has been removed from your wishlist.`);
    } catch {
      toast.error('Failed to remove item from wishlist');
    }
  };

  const handleMoveToCart = async (productId: string, productTitle: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to move items to cart');
      return;
    }
    
    try {
      await moveToCart(productId);
      toast.success(`${productTitle} moved to cart successfully`);
    } catch {
      toast.error('Failed to move item to cart');
    }
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
        {!isHydrated || loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error loading wishlist: {error}</p>
            <Button onClick={() => { clearError(); fetchWishlist(); }}>Try Again</Button>
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
              className="px-6 py-3 bg-[#4A85E4] text-white rounded-lg hover:bg-[#3A75D4] transition-colors cursor-pointer"
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
                  {isAuthenticated ? totalItems : wishlistProducts.length} {(isAuthenticated ? totalItems : wishlistProducts.length) === 1 ? 'item' : 'items'} in your wishlist
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
                  {/* Action buttons */}
                  <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {isAuthenticated && (
                      <button
                        onClick={() => handleMoveToCart(product.id, product.title)}
                        className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-green-500 hover:bg-green-50 transition-colors"
                        title="Move to cart"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id, product.title)}
                      className="w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

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