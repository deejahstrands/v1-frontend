"use client";

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useProducts } from '@/store/use-products';
import ProductDetailPage from '@/components/products/product-details/ProductDetailPage';
import { SectionContainer } from '@/components/common/section-container';
import { Loader2, AlertCircle } from 'lucide-react';

export default function ProductClient() {
  const resolvedParams = useParams();
  const productId = resolvedParams?.id as string;
  
  const {
    currentProduct,
    productLoading,
    productError,
    fetchProduct
  } = useProducts();

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    }
  }, [productId, fetchProduct]);

  if (productLoading) {
    return (
      <SectionContainer className="py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-gray-600">Loading product details...</p>
          </div>
        </div>
      </SectionContainer>
    );
  }

  if (productError) {
    return (
      <SectionContainer className="py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Product</h3>
            <p className="text-gray-600 mb-4">{productError}</p>
            <button
              onClick={() => productId && fetchProduct(productId)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </SectionContainer>
    );
  }

  if (!currentProduct) {
    return (
      <SectionContainer className="py-16">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h3>
            <p className="text-gray-600">The product you&rsquo;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      </SectionContainer>
    );
  }

  // Transform the detailed product to match the expected format
  const transformedProduct = {
    id: currentProduct.id,
    title: currentProduct.name,
    name: currentProduct.name,
    price: `₦${currentProduct.basePrice.toLocaleString()}`,
    basePrice: currentProduct.basePrice,
    images: [
      currentProduct.thumbnail,
      ...(currentProduct.gallery || []).map(item => item.url)
    ].filter(media => media && media.trim() !== ''),
    gallery: currentProduct.gallery,
    thumbnail: currentProduct.thumbnail,
    description: currentProduct.description,
    customization: currentProduct.customization,
    customizations: currentProduct.customizations?.map(custom => ({
      ...custom,
      type: custom.typeName, // Add the missing 'type' field
      options: custom.options.map(option => ({
        ...option,
        label: option.name, // Add missing label field
      })),
    })) || [],
    privateFittings: currentProduct.privateFittings,
    processingTimes: currentProduct.processingTimes,
    productSpecifications: Object.fromEntries(
      Object.entries(currentProduct.productSpecifications || {}).filter(([, value]) => value != null)
    ) as Record<string, string>,
    category: currentProduct.category?.name || '', // Convert to string
    status: currentProduct.status,
    quantityAvailable: currentProduct.quantityAvailable,
    featured: currentProduct.featured,
    visibility: currentProduct.visibility,
    createdAt: currentProduct.createdAt,
    deletedAt: currentProduct.deletedAt,
    // Transform processing times and private fittings into delivery options
    delivery: [
      ...(currentProduct.processingTimes?.length > 0 ? [{
        type: 'Processing Time',
        options: [
          { label: 'None', price: 0 },
          ...currentProduct.processingTimes.map(pt => ({
            label: pt.label,
            price: pt.price,
            productProcessingTimeId: pt.productProcessingTimeId,
            timeRange: pt.timeRange,
          }))
        ]
      }] : []),
      ...(currentProduct.privateFittings?.length > 0 ? [{
        type: 'Private Fitting',
        options: [
          { label: 'None', price: 0 },
          ...currentProduct.privateFittings.map(pf => ({
            label: pf.name,
            price: pf.price,
            productFittingOptionId: pf.productFittingOptionId
          }))
        ]
      }] : [])
    ],
    specifications: Object.entries(currentProduct.productSpecifications || {}).map(([key, value]) => ({
      type: key,
      value: value || '',
    })),
    reviews: currentProduct.reviews || [],
    relatedProducts: currentProduct.relatedProducts || [],
  };

  return <ProductDetailPage product={transformedProduct} />;
}
