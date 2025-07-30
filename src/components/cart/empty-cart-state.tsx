'use client';

import Link from 'next/link';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmptyCartState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="mb-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
      </div>
      
      {/* Message */}
      <h2 className="text-2xl font-semibold text-gray-900 mb-2">
        You don&rsquo;t have any items in your cart
      </h2>
      
      <p className="text-gray-500 mb-8 max-w-md">
        Items remain in your bag for 60 minutes, and then they&apos;re moved to your Saved Items.
      </p>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link href="/account/wishlist" className="flex-1">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4" />
            View Wishlisted Items
          </Button>
        </Link>
        
        <Link href="/shop" className="flex-1">
          <Button className="w-full">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
} 