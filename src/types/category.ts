export interface Category {
  id: string;
  name: string;
  coverImage: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  noOfProducts: number;
}

export interface CategoryProduct {
  id: string;
  createdAt: string;
  deletedAt: string | null;
  thumbnail: string;
  name: string;
  basePrice: number;
  status: 'available' | 'unavailable';
  quantityAvailable: number;
  visibility: 'published' | 'unpublished';
  customization?: boolean;
}

export interface CategoryWithProducts extends Category {
  products: {
    data: CategoryProduct[];
    meta: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
      nextPage: number | null;
      prevPage: number | null;
    };
  };
}

export interface CategoryResponse {
  message: string;
  data: Category;
}

export interface CategoryWithProductsResponse {
  message: string;
  data: CategoryWithProducts;
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
  meta: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
    nextPage: number | null;
    prevPage: number | null;
  };
}

export interface GetCategoriesParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'Active' | 'Inactive';
  search?: string;
}

export interface GetCategoryWithProductsParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive' | 'Active' | 'Inactive';
  search?: string;
}
