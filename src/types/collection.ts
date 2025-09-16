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
  products: CollectionProduct[];
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
