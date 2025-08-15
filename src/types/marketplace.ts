export interface MarketplaceItem {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition?: 'NEW' | 'USED' | 'REFURBISHED';
  location: string;
  contactDetails: string;
  imageUrl1?: string;
  dataAiHint1?: string;
  imageUrl2?: string;
  dataAiHint2?: string;
  imageUrl3?: string;
  dataAiHint3?: string;
  sellerId: string;
  seller?: {
    id: string;
    fullName: string;
    city?: string;
  };
  isActive: boolean;
  isSold: boolean;
  publishedAt: string;
  soldAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMarketplaceItemRequest {
  title: string;
  category: string;
  price: number;
  description: string;
  location: string;
  contactDetails: string;
  imageUrl1?: string;
  dataAiHint1?: string;
  imageUrl2?: string;
  dataAiHint2?: string;
  imageUrl3?: string;
  dataAiHint3?: string;
  condition?: 'NEW' | 'USED' | 'REFURBISHED';
}

export interface MarketplaceApiResponse {
  products: MarketplaceItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateProductResponse {
  success: boolean;
  message: string;
  product: MarketplaceItem;
}