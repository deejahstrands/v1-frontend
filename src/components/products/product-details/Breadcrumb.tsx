"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

interface BreadcrumbProps {
  productName: string;
  onBack?: () => void;
}

export default function Breadcrumb({ productName, onBack }: BreadcrumbProps) {
  const router = useRouter();
  return (
    <nav className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
      <button
        onClick={onBack || (() => router.back())}
        className="flex items-center px-2 py-1 rounded hover:bg-gray-100 transition"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Go Back
      </button>
      <span className="mx-1">
        <Link href="/shop" className="hover:underline">Shop</Link>
      </span>
      <span className="mx-1 text-gray-300">/</span>
      <span className="text-primary font-medium">{productName}</span>
    </nav>
  );
} 