export interface MenuItemOption {
  name: string;
  priceModifier: number; // e.g., +1.00 for extra cheese
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dataAiHint?: string;
  category: string;
  options?: MenuItemOption[]; // e.g., size, toppings
  restaurantId: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  location: string; // Simple string for now, could be more complex
  cuisineType: string;
  rating: number; // e.g., 4.5
  deliveryTimeEstimate: string; // e.g., "25-35 min"
  menu: MenuItem[];
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  dataAiHint?: string;
  // Potentially add selected options here if they affect price/display
}

export interface User {
  id: string;
  email: string;
  name?: string;
  // other user fields
}
