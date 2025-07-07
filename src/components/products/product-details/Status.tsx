import React from "react";

interface StatusProps {
  inStock: boolean;
  quantity?: number;
}

const Status: React.FC<StatusProps> = ({ inStock, quantity }) => {
  return (
    <div className="flex items-center gap-2 text-sm font-medium">
      <span className={`w-2 h-2 rounded-full ${inStock ? "bg-green-500" : "bg-red-500"} inline-block`}></span>
      {inStock ? (
        <span className="text-green-600">In Stock{quantity ? <span className="italic font-normal"> (only {quantity} pieces left!)</span> : null}</span>
      ) : (
        <span className="text-red-600">Out of Stock</span>
      )}
    </div>
  );
};

export default Status; 