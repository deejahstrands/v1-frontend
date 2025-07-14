import React from 'react';
import { products } from '@/data/products';
import { ProductCard } from '@/components/common/product-card';
import { SectionContainer } from '@/components/common/section-container';

const RelatedProductsSection: React.FC = () => {
  // For now, just use the first 4 products
  const related = products.slice(0, 4);

  return (
    <SectionContainer>
      <section className="mt-12 lg:mt-20
      ">
        <h2 className="text-2xl md:text-3xl font-ethereal font-semibold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {related.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              images={product.images}
              title={product.title}
              price={product.price}
              customization={product.customization}
              // Add-to-cart and wishlist handlers can be implemented as needed
            />
          ))}
        </div>
      </section>
    </SectionContainer>
  );
};

export default RelatedProductsSection; 