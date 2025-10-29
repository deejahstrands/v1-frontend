'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/store/use-auth';
import { useLoginModal } from '@/hooks/use-login-modal';

export function EmptyCartState() {
  const { isAuthenticated } = useAuth();
  const { openModal } = useLoginModal();

  const handleViewSavedItems = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openModal("View Saved Items", () => {
        // After login, user can access wishlist
        window.location.href = '/account/wishlist';
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className="mb-6">
        <ShoppingBag className="w-16 h-16 text-gray-400" />
      </div>
      
      {/* Message */}
      <h2 className=" text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
        You don&rsquo;t have any items in your cart
      </h2>
      
      <p className="text-gray-500 mb-8 max-w-md text-sm lg:text-base">
        Items remain in your bag for 60 minutes, and then they&apos;re moved to your Saved Items.
      </p>
      
             {/* Action Buttons */}
       <div className="flex flex-col gap-4 w-full max-w-sm">
         {isAuthenticated ? (
           <Link href="/account/wishlist" className="w-full">
             <Button 
               className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white font-semibold rounded-lg py-3 text-base transition-colors"
             >
               VIEW SAVED ITEMS
             </Button>
           </Link>
         ) : (
           <button
             onClick={handleViewSavedItems}
             className="w-full bg-[#C9A898] hover:bg-[#b88b6d] text-white font-semibold rounded-lg py-3 text-base transition-colors"
           >
             VIEW SAVED ITEMS
           </button>
         )}
        
        <div className="text-center">
          <Link 
            href="/shop" 
            className="text-gray-700 underline hover:text-gray-900 transition-colors font-bold"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
} 