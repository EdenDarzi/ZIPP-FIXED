
export interface MenuItemOption {
  name: string;
  priceModifier: number; // e.g., +1.00 for extra cheese
}

// New types for Menu Item Add-ons
export interface MenuItemAddonChoice {
  id: string;
  name: string;
  price: number; // Can be 0 for free options
  selectedByDefault?: boolean;
}

export interface MenuItemAddonGroup {
  id: string;
  title: string; // e.g., "Choose your side", "Extra Toppings"
  type: 'radio' | 'checkbox'; // Single or multiple selection
  minSelection?: number;
  maxSelection?: number;
  options: MenuItemAddonChoice[];
  required?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dataAiHint?: string;
  category: string;
  options?: MenuItemOption[]; // e.g., size, toppings - Original simple options
  addons?: MenuItemAddonGroup[]; // New advanced add-ons
  restaurantId: string;
  isAvailable?: boolean; // For real-time availability
}

export type RestaurantTag = 'Recommended' | 'Hot Now' | 'Fast Delivery' | 'New' | 'Popular' | 'Delivery Arena';

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
  hasDeliveryArena?: boolean;
  tags?: RestaurantTag[];
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  dataAiHint?: string;
  // Note: Selected addons and their prices would also be stored here in a real cart
}

export interface User {
  id:string;
  email: string;
  name?: string;
  // other user fields
}

export type DeliveryVehicle = 'motorcycle' | 'car' | 'bicycle' | 'foot' | 'scooter';

export interface CourierProfile {
  id: string;
  name: string;
  rating: number; // Average performance rating (1-5)
  trustScore: number; // AI-calculated reliability score (0-100)
  vehicleType: DeliveryVehicle;
  areaCoverageRadiusKm: number; // Max distance willing to travel for pickup
  currentLocation: { lat: number; lng: number }; // For geographical matching
  currentSpeedKmh?: number; // Real-time speed
  batteryPercent?: number; // For electric vehicles, e.g., e-bikes, scooters
  isActive: boolean; // Is courier currently working/accepting offers
  transportationModeDetails?: string; // e.g. "Honda PCX 150", "Trek FX 2"
}

export interface OrderDetailsForBidding {
  orderId: string;
  restaurantName: string;
  restaurantLocation: { lat: number; lng: number }; // Coordinates of the restaurant
  deliveryAddress: string; // Customer's delivery address
  deliveryLocation: { lat: number; lng: number }; // Coordinates for delivery
  estimatedDistanceKm: number; // Estimated travel distance for delivery // "as the crow flies" for initial estimate
  estimatedRouteDistanceKm?: number; // More accurate route distance from a mapping service
  baseCommission: number; // Base payment for the delivery
  itemsDescription: string; // Brief description of items (e.g., "Pizza, Drinks")
  expectedPickupTime: string; // e.g., "ASAP", "15:30"
  requiredVehicleType?: DeliveryVehicle[]; // Optional: if specific vehicle types are needed
  orderValue?: number; // To help couriers prioritize or for dynamic commission adjustments
  customerNotes?: string; // Any special instructions from the customer
}

export interface CourierBid {
  bidId: string;
  orderId: string;
  courierId: string;
  courierName: string; // For display
  distanceToRestaurantKm: number; // Courier's current distance to the restaurant
  bidAmount: number; // Total commission courier is asking (base + bonus)
  proposedEtaMinutes: number; // Courier's estimated time to deliver (pickup + travel to customer)
  courierRating: number; // Courier's performance rating at time of bid
  courierTrustScore: number; // Courier's trust score at time of bid
  vehicleType: DeliveryVehicle;
  timestamp: string; // ISO string for when the bid was placed
  isFastPickup: boolean; // If courier committed to faster pickup (e.g., pickup within X minutes)
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  courierProfileSnapshot?: Partial<CourierProfile>; // Snapshot of courier profile at time of bid for logging/analysis
}

export type DeliveryPreference = 'arena' | 'fastest' | 'smartSaver';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'MATCHING_COURIER' // Actively in the courier arena/bidding process
  | 'COURIER_ASSIGNED' // A courier has accepted/won the bid
  | 'PREPARING_AT_RESTAURANT' // Courier assigned, restaurant is preparing
  | 'AWAITING_PICKUP' // Food ready, courier en-route to restaurant or at restaurant
  | 'OUT_FOR_DELIVERY' // Courier has picked up and is on the way to customer
  | 'DELIVERED'
  | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number; // Subtotal of items
  deliveryPreference: DeliveryPreference;
  deliveryFee: number;
  discountAmount: number; // For Smart Saver or coupons
  finalAmount: number; // totalAmount + deliveryFee - discountAmount
  status: OrderStatus;
  deliveryAddress: string; // Should be more structured in a real app
  restaurantId: string;
  restaurantName: string;
  estimatedDeliveryTime?: string; // e.g. "10-15 minutes" (after courier assigned)
  actualDeliveryTime?: string; // When it was actually delivered
  assignedCourier?: { // This structure is used once a courier is confirmed
    id: string;
    name: string;
    photoUrl?: string;
    dataAiHint?: string; // Added for placeholder consistency
    rating: number;
    vehicleType: DeliveryVehicle;
    currentEtaMinutes?: number; // Dynamic ETA shown to customer
    vehicleDetails?: string; // e.g., "Blue Toyota Camry - XYZ123"
    liveLocation?: { lat: number; lng: number };
  };
  orderTimeline?: { status: OrderStatus, timestamp: string, notes?: string }[]; // For tracking history
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// Restaurant Admin Panel Specific Types
export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface OperatingHour {
  day: DayOfWeek;
  openTime: string; // e.g., "09:00"
  closeTime: string; // e.g., "22:00"
  isClosed: boolean;
}

export interface RestaurantSettings {
  id: string; // Typically same as restaurantId
  businessName: string;
  logoUrl?: string;
  coverImageUrl?: string;
  category: string; // e.g., Pizza, Asian
  address: string;
  // mapLocation: { lat: number; lng: number }; // For future map integration
  operatingHours: OperatingHour[];
  isOpenNow: boolean; // Manual override or calculated
  specialsStatus?: string; // e.g., "SUMMER20 for 20% off" or simple checkbox text
  primaryColor?: string; // For store design
  accentColor?: string; // For store design
  dishDisplayStlye?: 'grid' | 'list';
}

// P2P / Custom Errand Delivery Types
export interface P2PDeliveryRequestDetails {
  pickupAddress: string;
  destinationAddress: string;
  packageDescription: string;
  pickupContactName?: string;
  pickupContactPhone?: string;
  destinationContactName?: string;
  destinationContactPhone?: string;
  isPurchaseRequired: boolean;
  shoppingList?: string;
  estimatedBudget?: number; // For purchases
  specialInstructions?: string;
  requestedPickupTime?: string; // e.g., 'ASAP', '2024-07-26T14:00:00Z'
}

export type P2POrderStatus =
  | 'REQUESTED'
  | 'MATCHING_COURIER'
  | 'COURIER_ASSIGNED'
  | 'PICKUP_IN_PROGRESS'
  | 'EN_ROUTE_TO_DESTINATION'
  | 'DELIVERED'
  | 'CANCELLED';

export interface P2POrder {
  id: string;
  userId: string;
  requestDetails: P2PDeliveryRequestDetails;
  status: P2POrderStatus;
  assignedCourier?: {
    id: string;
    name: string;
    vehicleType: DeliveryVehicle;
    currentEtaMinutes?: number;
    liveLocation?: { lat: number; lng: number };
  };
  estimatedCost?: number;
  actualCost?: number; // Includes item purchase if applicable
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  orderTimeline?: { status: P2POrderStatus, timestamp: string, notes?: string }[];
}

// Nutritional Advisor Types
export type NutritionalGoal = 'TONING' | 'WEIGHT_LOSS' | 'ENERGY_BOOST' | 'GENERAL_HEALTHY';

export interface DishRecommendation {
  dishName: string;
  restaurantName: string; // Fictional or type like "Healthy Eats Cafe"
  description: string; // Short description of the dish
  estimatedCalories?: number;
  estimatedProteinGrams?: number;
  reasoning: string; // Why this dish fits the goal/preferences
}
