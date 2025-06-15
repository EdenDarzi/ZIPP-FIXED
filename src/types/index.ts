
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
  hasDeliveryArena?: boolean; // New field for courier arena
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  dataAiHint?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  // other user fields
}

export type DeliveryVehicle = 'motorcycle' | 'car' | 'bicycle' | 'foot';

export interface CourierProfile {
  id: string;
  name: string;
  rating: number; // Average performance rating (1-5)
  trustScore: number; // AI-calculated reliability score (0-100)
  vehicleType: DeliveryVehicle;
  areaCoverageRadiusKm: number; // Max distance willing to travel for pickup
  currentLocation: { lat: number; lng: number }; // For geographical matching
}

export interface OrderDetailsForBidding {
  orderId: string;
  restaurantName: string;
  restaurantLocation: { lat: number; lng: number }; // Coordinates of the restaurant
  deliveryAddress: string; // Customer's delivery address
  deliveryLocation: { lat: number; lng: number }; // Coordinates for delivery
  estimatedDistanceKm: number; // Estimated travel distance for delivery
  baseCommission: number; // Base payment for the delivery
  itemsDescription: string; // Brief description of items (e.g., "Pizza, Drinks")
  expectedPickupTime: string; // e.g., "ASAP", "15:30"
  requiredVehicleType?: DeliveryVehicle[]; // Optional: if specific vehicle types are needed
}

export interface CourierBid {
  bidId: string;
  orderId: string;
  courierId: string;
  courierName: string; // For display
  distanceToRestaurantKm: number; // Courier's distance to the restaurant
  bidAmount: number; // Total commission courier is asking (base + bonus)
  proposedEtaMinutes: number; // Courier's estimated time to deliver (pickup + travel to customer)
  courierRating: number; // Courier's performance rating at time of bid
  courierTrustScore: number; // Courier's trust score at time of bid
  vehicleType: DeliveryVehicle;
  timestamp: string; // ISO string for when the bid was placed
  isFastPickup: boolean; // If courier committed to faster pickup
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export type DeliveryPreference = 'arena' | 'fastest';

export type OrderStatus = 
  | 'PENDING_PAYMENT' 
  | 'MATCHING_COURIER' 
  | 'COURIER_ASSIGNED' 
  | 'OUT_FOR_DELIVERY' 
  | 'DELIVERED' 
  | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  deliveryPreference: DeliveryPreference;
  deliveryFee: number;
  finalAmount: number;
  status: OrderStatus;
  deliveryAddress: string; // Should be more structured in a real app
  restaurantId: string;
  restaurantName: string;
  estimatedDeliveryTime?: string; // e.g. "10-15 minutes" (after courier assigned)
  assignedCourier?: {
    id: string;
    name: string;
    photoUrl?: string;
    rating: number;
    vehicleType: DeliveryVehicle;
    currentEtaMinutes?: number;
  };
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
