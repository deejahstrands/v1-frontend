"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import React from "react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showBackButton?: boolean;
  onBack?: () => void;
  className?: string;
}

export function Breadcrumb({ 
  items, 
  showBackButton = true, 
  onBack,
  className = "" 
}: BreadcrumbProps) {
  const router = useRouter();
  
  return (
    <nav className={`flex items-center gap-2 text-xs md:text-sm text-gray-500 ${className}`}>
      {showBackButton && (
        <>
          <button
            onClick={onBack || (() => router.back())}
            className="flex items-center px-2 py-1 rounded hover:bg-gray-100 transition"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Go Back
          </button>
          <span className="mx-1 text-gray-300">/</span>
        </>
      )}
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:underline hover:text-gray-700 transition-colors"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-primary font-medium">{item.label}</span>
          )}
          {index < items.length - 1 && (
            <span className="mx-1 text-gray-300">/</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
} 