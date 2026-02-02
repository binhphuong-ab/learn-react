export interface Product {
  _id: string;
  name: string;
  slug: string;
  summary: string;
  description: string;
  images: string[];
  specs: Record<string, string>;
  price?: number;
  category: string;
  featured?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface ProductCreateInput {
  name: string;
  slug: string;
  summary: string;
  description: string;
  images: string[];
  specs: Record<string, string>;
  price?: number;
  category: string;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, string>;
}
