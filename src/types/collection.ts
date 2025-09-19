export interface Collection {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  thumbnail: string;
  video?: string;
  name: string;
  status: 'active' | 'inactive';
  description: string;
  featured: boolean;
}

export interface CollectionProduct {
  id: string;
  thumbnail: string;
  name: string;
  basePrice: number;
  visibility: 'published' | 'unpublished';
  customization: boolean;
}

export interface FeaturedCollection extends Collection {
  products: {
    data: CollectionProduct[];
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
  };
}

export interface CollectionResponse {
  message: string;
  data: Collection;
}

export interface FeaturedCollectionResponse {
  message: string;
  data: FeaturedCollection;
}

export interface CollectionsResponse {
  message: string;
  data: Collection[];
  meta?: {
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

export interface GetCollectionsParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  featured?: boolean;
  search?: string;
}

export interface GetFeaturedCollectionParams {
  limit?: number;
  customization?: boolean;
  status?: 'available' | 'sold_out';
  featured?: boolean;
  priceFrom?: number;
  priceTo?: number;
  categoryId?: string; // Comma-separated category IDs
  sortBy?: 'name' | '-name' | 'price' | '-price';
  page?: number;
}
