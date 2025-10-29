"use client";

import { useState } from "react";
import Reviews from "./Reviews";

interface ProductTabsProps {
  description: React.ReactNode;
  product: {
    id: string;
    reviews?: Array<{
      user: {
        id: string;
        avatar: string;
        lastName: string;
        firstName: string;
      };
      rating: number;
      review: string;
    }>;
  };
}

const TABS = [
  { label: "Descriptions", key: "description" },
  { label: "Reviews", key: "reviews" },
];

export default function ProductTabs({ description, product }: ProductTabsProps) {
  const [active, setActive] = useState("description");

  return (
    <div className="bg-white rounded-lg p-4">
      <div className="flex bg-[#F9F9F9] rounded-md p-2 gap-2">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 px-4 py-2 text-base rounded-lg transition font-medium cursor-pointer
              ${active === tab.key ? "bg-secondary text-black font-semibold" : "bg-transparent text-black"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {active === "description" ? description : <Reviews product={product} />}
      </div>
    </div>
  );
} 