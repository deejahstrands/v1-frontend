import { Skeleton } from "./skeleton";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
  showHeader?: boolean;
  className?: string;
}

export function TableSkeleton({
  columns,
  rows = 8,
  showHeader = true,
  className = "",
}: TableSkeletonProps) {
  return (
    <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {/* Search and filter skeleton */}
      <div className="px-4 pt-4 pb-2 flex flex-col md:flex-row md:items-center gap-3">
        <Skeleton className="h-9 w-72" />
        <div className="flex items-center gap-2 ml-auto">
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[700px] md:min-w-[600px] lg:min-w-[600px] xl:min-w-[600px] w-full divide-y divide-gray-200">
          {showHeader && (
            <thead className="bg-gray-50">
              <tr>
                {Array.from({ length: columns }).map((_, idx) => (
                  <th
                    key={idx}
                    className="px-2 py-2 sm:px-4 sm:py-3 text-left"
                  >
                    <Skeleton className="h-4 w-20" />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody className="bg-white divide-y divide-gray-100">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td
                    key={colIdx}
                    className="px-2 py-2 sm:px-4 sm:py-3"
                  >
                    <Skeleton className="h-4 w-full max-w-[120px]" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination skeleton */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <Skeleton className="h-4 w-32" />
          <div className="flex items-center gap-1">
            <Skeleton className="h-8 w-8" />
            <div className="flex items-center gap-1">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Skeleton key={idx} className="h-8 w-8" />
              ))}
            </div>
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
} 