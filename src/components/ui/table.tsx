"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { TableSkeleton } from "./table-skeleton";
import { FolderOpen } from "lucide-react";

export type TableColumn<T> = {
  label: string;
  accessor: keyof T | string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

export type TableProps<T> = {
  columns: TableColumn<T>[];
  data: T[];
  actions?: (row: T) => React.ReactNode;
  children?: React.ReactNode; // For filters/search
  footerContent?: React.ReactNode; // For pagination
  className?: string;
  isLoading?: boolean;
  emptyMessage?: string;
};

export function Table<T extends { id?: string | number }>({
  columns,
  data,
  actions,
  children,
  footerContent,
  className = "",
  isLoading = false,
  emptyMessage = "No data available",
}: TableProps<T>) {
  return (
    <div className={`w-full bg-white rounded-xl shadow-sm border border-gray-100 ${className}`}>
      {children && (
        <div className="px-4 pt-4 pb-2 flex flex-col gap-2">{children}</div>
      )}
      {isLoading ? (
        <TableSkeleton columns={columns.length + (actions ? 1 : 0)} rows={8} showHeader={false} />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-[700px] md:min-w-[600px] lg:min-w-[600px] xl:min-w-[600px] w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((col, idx) => (
                    <th
                      key={col.label + idx}
                      className={`px-2 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wider ${col.className || ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                  {actions && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length + (actions ? 1 : 0)} className="px-2 py-8 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                        <span className="text-sm text-gray-500">{emptyMessage}</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((row, rowIdx) => (
                    <tr key={row.id ?? rowIdx} className="hover:bg-gray-50 transition-colors">
                      {columns.map((col, colIdx) => (
                        <td key={col.label + colIdx} className={`px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm ${col.className || ""}`}>
                          {col.render ? col.render(row) : (row as any)[col.accessor]}
                        </td>
                      ))}
                      {actions && (
                        <td className="px-2 py-2 sm:px-4 sm:py-3 text-xs sm:text-sm">{actions(row)}</td>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {footerContent && (
            <div className="px-4 py-4 border-t border-gray-100">
              {footerContent}
            </div>
          )}
        </>
      )}
    </div>
  );
} 