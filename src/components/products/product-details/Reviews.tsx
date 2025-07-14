import { useState } from "react";
import StarRating from "./StarRating";
import { useUser } from "@/store/use-users";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import Image from "next/image";
import { PlusIcon } from "lucide-react";

interface Review {
  userId: string;
  date: string;
  text: string;
  rating: number;
  reply?: string;
}

interface Product {
  id: string;
  reviews: Review[];
  rating?: number;
  reviewCount?: number;
}

interface User {
  id: string;
  firstName: string;
  lastName: string;
  image: string;
}

interface ReviewsProps {
  product: Product;
  users: User[];
}

const REVIEWS_PER_PAGE = 2;
const SORT_OPTIONS = [
  { label: "Most Recent", value: "recent" },
  { label: "Highest Rated", value: "high" },
  { label: "Lowest Rated", value: "low" },
];

export default function Reviews({ product, users }: ReviewsProps) {
  const { isAuthenticated, hasPurchasedProduct } = useUser();
  const [sort, setSort] = useState(SORT_OPTIONS[0].value);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Simulate loading skeleton on page change
  const handlePageChange = (p: number) => {
    setLoading(true);
    setTimeout(() => {
      setPage(p);
      setLoading(false);
    }, 600);
  };

  // Sort reviews
  const reviews = [...(product.reviews || [])];
  if (sort === "high") reviews.sort((a, b) => b.rating - a.rating);
  if (sort === "low") reviews.sort((a, b) => a.rating - b.rating);
  // Paginate
  const start = (page - 1) * REVIEWS_PER_PAGE;
  const end = start + REVIEWS_PER_PAGE;
  const pagedReviews = reviews.slice(start, end);

  // User lookup
  const getUser = (id: string) => users.find(u => u.id === id);

  return (
    <div className="bg-white rounded-lg sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
        <h3 className="font-semibold text-base sm:text-lg">Customer Reviews</h3>
        {isAuthenticated() && hasPurchasedProduct(product.id) && (
          <button className="bg-primary text-white font-medium rounded px-3 py-2 sm:px-4 sm:py-2 flex items-center gap-1 text-sm sm:text-base w-fit">
            <PlusIcon className="w-4 h-4" /> Write a Review
          </button>
        )}
      </div>
      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" className="sm:w-12 sm:h-12" fill="none" viewBox="0 0 24 24"><path fill="#E4E7EC" d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm-1-7h2v2h-2v-2Zm0-6h2v4h-2V7Z"/></svg>
          <span className="mt-2 text-gray-400 text-sm sm:text-base text-center">No reviews yet. Be the first to review this product!</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <StarRating rating={product.rating || 0} size={20} />
            <span className="font-normal text-base sm:text-lg">{(product.rating || 0).toFixed(1)} out of 5 ({product.reviewCount || 0} Reviews)</span>
          </div>
          {/* Horizontal line */}
          <hr className="my-3 sm:my-4 border-gray-200" />
          {/* Sort Dropdown */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 gap-2 sm:gap-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-white border border-gray-200 rounded px-3 py-1 text-sm flex items-center gap-2 min-w-[140px] w-fit">
                  {SORT_OPTIONS.find(o => o.value === sort)?.label}
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24"><path stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6"/></svg>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white">
                {SORT_OPTIONS.map(option => (
                  <DropdownMenuItem key={option.value} onClick={() => setSort(option.value)}>
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {/* Horizontal line */}
          <hr className="my-3 sm:my-4 border-gray-200" />
          {/* Review List */}
          <div className="mb-4">
            <div className="flex lg:flex-row flex-col lg:justify-between lg:items-center gap-2 mb-6">
              <div className="font-semibold mb-2 text-sm sm:text-base">Review List</div>
              <span className="text-sm text-black text-left w-full sm:w-auto">Showing {start + 1}-{Math.min(end, reviews.length)} of {reviews.length} results</span>
            </div>
            {loading ? (
              <div className="space-y-4">
                {[...Array(REVIEWS_PER_PAGE)].map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3 items-start">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/3" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              pagedReviews.length === 0 ? (
                <div className="text-gray-400 text-sm text-center">No reviews yet.</div>
              ) : (
                pagedReviews.map((review, i) => {
                  const user = getUser(review.userId);
                  return (
                    <div key={i} className="flex gap-3 items-start mb-6">
                      <Image src={user?.image || "/dummy/avatar.svg"} alt={user?.firstName || "User"} width={32} height={32} className="rounded-full object-cover w-8 h-8 sm:w-10 sm:h-10" />
                      <div className="flex-1">
                        <div className="flex flex-row items-center gap-2 mb-1">
                          <span className="font-semibold text-xs sm:text-sm">{user?.firstName} {user?.lastName}</span>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <StarRating rating={review.rating} size={16} />
                        <div className="text-xs sm:text-sm mt-1 mb-2">{review.text}</div>
                        {review.reply && (
                          <div className="bg-[#F0F2F5] text-xs rounded px-3 py-2 text-gray-700">Deejah Strands replied: {review.reply}</div>
                        )}
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>
          {/* Pagination */}
          <div className="flex justify-center">
            <Pagination
              totalPages={Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
              currentPage={page}
              onPageChange={handlePageChange}
              className="mt-2"
            />
          </div>
        </>
      )}
    </div>
  );
} 