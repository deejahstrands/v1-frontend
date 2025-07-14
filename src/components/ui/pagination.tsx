import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMediaQuery } from "@/lib/use-media-query";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
  className = "",
}) => {
  const isMobile = useMediaQuery("(max-width: 640px)");
  
  const getPages = () => {
    const pages: (number | string)[] = [];
    const showPages = isMobile ? 3 : 7;

    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      pages.push(1);
      pages.push(2);
      pages.push(3);
      pages.push("...");
      pages.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push("...");
      pages.push(totalPages - 2);
      pages.push(totalPages - 1);
      pages.push(totalPages);
    } else {
      pages.push(1);
      pages.push("...");
      pages.push(currentPage - 1);
      pages.push(currentPage);
      pages.push(currentPage + 1);
      pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <button
        onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 transition disabled:opacity-60 disabled:cursor-not-allowed mr-1`}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <div className="flex items-center gap-1">
        {getPages().map((page, index) => (
          <React.Fragment key={index}>
            {typeof page === "number" ? (
              <button
                onClick={() => onPageChange(page)}
                className={`w-9 h-9 flex items-center justify-center rounded-md border transition font-medium
                  ${currentPage === page
                    ? "bg-black text-white border-black shadow"
                    : "bg-white text-black border-gray-200 hover:bg-gray-50"}
                `}
                style={{ marginLeft: index === 0 ? 0 : 4 }}
              >
                {page}
              </button>
            ) : (
              <span className="w-9 h-9 flex items-center justify-center text-gray-400 select-none">{page}</span>
            )}
          </React.Fragment>
        ))}
      </div>
      <button
        onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-9 h-9 flex items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 transition disabled:opacity-60 disabled:cursor-not-allowed ml-1`}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}; 