import { useState } from "react";
import StarRating from "./StarRating";
import { useUser } from "@/store/use-users";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";
import Image from "next/image";

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
  rating: number;
  reviewCount: number;
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
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">Customer Reviews</h3>
        {isAuthenticated() && hasPurchasedProduct(product.id) && (
          <button className="bg-secondary text-black font-medium rounded px-4 py-2 flex items-center gap-1">
            + Write a Review
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mb-2">
        <StarRating rating={product.rating} size={20} />
        <span className="font-medium text-base">{product.rating.toFixed(1)}</span>
        <span className="text-gray-500 text-sm">out of 5 ({product.reviewCount} Reviews)</span>
      </div>
      {/* Horizontal line */}
      <hr className="my-4 border-gray-200" />
      {/* Sort Dropdown */}
      <div className="flex items-center justify-between mb-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-white border border-gray-200 rounded px-3 py-1 text-sm flex items-center gap-2 min-w-[140px]">
              {SORT_OPTIONS.find(o => o.value === sort)?.label}
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
        <span className="text-xs text-gray-500">Showing {start + 1}-{Math.min(end, reviews.length)} of {reviews.length} results</span>
      </div>
      {/* Horizontal line */}
      <hr className="my-4 border-gray-200" />
      {/* Review List */}
      <div className="mb-4">
        <div className="font-semibold mb-2">Review List</div>
        {loading ? (
          <div className="space-y-4">
            {[...Array(REVIEWS_PER_PAGE)].map((_, i) => (
              <div key={i} className="animate-pulse flex gap-3 items-start">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
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
            <div className="text-gray-400 text-sm">No reviews yet.</div>
          ) : (
            pagedReviews.map((review, i) => {
              const user = getUser(review.userId);
              return (
                <div key={i} className="flex gap-3 items-start mb-6">
                  <Image src={user?.image || "/dummy/avatar.svg"} alt={user?.firstName || "User"} width={40} height={40} className="rounded-full object-cover w-10 h-10" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{user?.firstName} {user?.lastName}</span>
                      <span className="text-xs text-gray-400">{review.date}</span>
                    </div>
                    <StarRating rating={review.rating} size={16} />
                    <div className="text-sm mt-1 mb-2">{review.text}</div>
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
      <Pagination
        totalPages={Math.ceil(reviews.length / REVIEWS_PER_PAGE)}
        currentPage={page}
        onPageChange={handlePageChange}
        className="mt-2"
      />
    </div>
  );
} 