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
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-2 ${className}`}>
      <span className="text-xs sm:text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        
        <div className="flex items-center">
          {getPages().map((page, index) => (
            <React.Fragment key={index}>
              {typeof page === "number" ? (
                <button
                  onClick={() => onPageChange(page)}
                  className={`min-w-[28px] sm:min-w-[32px] h-7 sm:h-8 flex items-center justify-center text-xs sm:text-sm rounded-lg mx-0.5
                    ${currentPage === page 
                      ? "bg-primary text-white font-medium" 
                      : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  {page}
                </button>
              ) : (
                <span className="px-0.5 sm:px-1 text-gray-400">{page}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-1.5 sm:p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 