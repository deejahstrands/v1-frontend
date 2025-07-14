/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import Reviews from "./Reviews";
import { users } from "@/data/users";

interface ProductTabsProps {
  description: React.ReactNode;
  product: any;
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
            className={`flex-1 px-4 py-2 text-base rounded-lg transition font-medium
              ${active === tab.key ? "bg-secondary text-black font-semibold" : "bg-transparent text-black"}
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-6">
        {active === "description" ? description : <Reviews product={product} users={users} />}
      </div>
    </div>
  );
} 