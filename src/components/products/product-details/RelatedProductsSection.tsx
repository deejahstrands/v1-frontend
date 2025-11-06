import React from 'react';
import { ProductCard } from '@/components/common/product-card';
import { SectionContainer } from '@/components/common/section-container';

interface RelatedProductsSectionProps {
  relatedProducts?: Array<{
    id: string;
    name: string;
    thumbnail: string;
    description: string;
    status: string;
    visibility: string;
    basePrice: number;
    customization: boolean;
  }>;
}

const RelatedProductsSection: React.FC<RelatedProductsSectionProps> = ({ relatedProducts = [] }) => {
  // If no related products, don't render the section
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }

  return (
    <SectionContainer>
      <section className="mt-12 lg:mt-20
      ">
        <h2 className="text-2xl md:text-3xl font-ethereal font-semibold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              images={[product.thumbnail]} // Use thumbnail as single image
              title={product.name}
              price={`₦${product.basePrice.toLocaleString()}`}
              customization={product.customization}
              status={product.status}

            // Add-to-cart and wishlist handlers can be implemented as needed
            />
          ))}
        </div>
      </section>
    </SectionContainer>
  );
};

export default RelatedProductsSection; 