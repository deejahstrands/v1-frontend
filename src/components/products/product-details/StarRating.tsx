import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: number;
  className?: string;
}

export default function StarRating({ rating, onRate, size = 20, className = "" }: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = rating >= star || (star - rating <= 0.5 && rating % 1 !== 0);
        return (
          <button
            key={star}
            type={onRate ? "button" : undefined}
            onClick={onRate ? () => onRate(star) : undefined}
            className={onRate ? "cursor-pointer p-0 bg-transparent border-none" : "pointer-events-none p-0 bg-transparent border-none"}
            aria-label={onRate ? `Rate ${star} star${star > 1 ? 's' : ''}` : undefined}
            tabIndex={onRate ? 0 : -1}
          >
            <Star
              size={size}
              fill={filled ? "#D2A391" : "#E4E7EC"}
              stroke={filled ? "#D2A391" : "#E4E7EC"}
              className="inline"
            />
          </button>
        );
      })}
    </div>
  );
} 