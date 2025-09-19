export interface Product {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  thumbnail: string;
  name: string;
  basePrice: number;
  featured: boolean;
  status: 'available' | 'sold_out';
  quantityAvailable: number;
  visibility: 'published' | 'hidden';
  customization: boolean;
  category: {
    id: string;
    name: string;
  };
}

export interface DetailedProduct extends Product {
  description: string;
  totalQuantity: number;
  quantitySold: number;
  gallery: string[];
  updatedAt: string;
  privateFittings: PrivateFitting[];
  processingTimes: ProcessingTime[];
  customizations: ProductCustomization[];
  productSpecifications: ProductSpecifications;
}

export interface PrivateFitting {
  productFittingOptionId: string;
  fittingOptionId: string;
  name: string;
  price: number;
}

export interface ProcessingTime {
  productProcessingTimeId: string;
  processingTimeId: string;
  label: string;
  price: number;
}

export interface ProductCustomization {
  typeId: string;
  typeName: string;
  description: string;
  options: CustomizationOption[];
  createdAt: string;
}

export interface CustomizationOption {
  itemCustomizationId: string;
  customizationId: string;
  name: string;
  description: string;
  price: number;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface ProductSpecifications {
  color?: string;
  length?: string;
  density?: string;
  [key: string]: string | undefined;
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  meta: {
    page: number;
    limit: number | null;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetProductsParams {
  limit?: number;
  customization?: boolean;
  status?: 'available' | 'sold_out';
  visibility?: 'hidden' | 'published';
  page?: number;
  featured?: boolean;
  priceFrom?: number;
  priceTo?: number;
  categoryId?: string; // Comma-separated category IDs
  sortBy?: 'name' | '-name' | 'price' | '-price';
  search?: string;
}

export interface ProductResponse {
  message: string;
  data: Product;
}

export interface DetailedProductResponse {
  message: string;
  data: DetailedProduct;
}
