export type SecondHandItemCategory = 'טלפונים' | 'מחשבים' | 'בגדים' | 'אוזניות' | 'אחר' | 'delivery_bags' | 'clothing' | 'equipment' | 'other';

export interface SecondHandItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  category: SecondHandItemCategory;
  sellerId: string;
  sellerName: string;
  imageUrl: string;
  postedAt: string; // ISO 8601 date string
  location: string; // e.g., "Tel Aviv"
  isSold?: boolean;
  publishedAt?: string;
  images?: { url: string; dataAiHint?: string }[];
  sellerRating?: number;
  contactDetails?: string;
  contactMethod?: 'whatsapp' | 'app-chat' | 'phone';
}

export {};
