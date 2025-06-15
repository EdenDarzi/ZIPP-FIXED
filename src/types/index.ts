
export interface MenuItemOption {
  name: string;
  priceModifier: number; // e.g., +1.00 for extra cheese
}

export interface MenuItemAddonChoice {
  id: string;
  name: string;
  price: number; 
  selectedByDefault?: boolean;
}

export interface MenuItemAddonGroup {
  id: string;
  title: string; 
  type: 'radio' | 'checkbox'; 
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
  options?: MenuItemOption[]; 
  addons?: MenuItemAddonGroup[]; 
  restaurantId: string;
  isAvailable?: boolean; 
}

export type RestaurantTag = 'Recommended' | 'Hot Now' | 'Fast Delivery' | 'New' | 'Popular' | 'Delivery Arena';

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dataAiHint?: string;
  location: string; 
  cuisineType: string; // Can be used as business type for non-restaurants
  rating: number; 
  deliveryTimeEstimate: string; 
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
}

export interface User {
  id:string;
  email: string;
  name?: string;
}

export type DeliveryVehicle = 'motorcycle' | 'car' | 'bicycle' | 'foot' | 'scooter';

export interface CourierProfile {
  id: string;
  name: string;
  rating: number; 
  trustScore: number; 
  vehicleType: DeliveryVehicle;
  areaCoverageRadiusKm: number; 
  currentLocation: { lat: number; lng: number }; 
  currentSpeedKmh?: number; 
  batteryPercent?: number; 
  isActive: boolean; 
  transportationModeDetails?: string; 
}

export interface Location { 
    lat: number;
    lng: number;
}

export interface OrderDetailsForBidding {
  orderId: string;
  restaurantName: string;
  restaurantLocation: Location; 
  deliveryAddress: string; 
  deliveryLocation: Location; 
  estimatedDistanceKm: number; 
  estimatedRouteDistanceKm?: number; 
  baseCommission: number; 
  itemsDescription: string; 
  expectedPickupTime: string; 
  requiredVehicleType?: DeliveryVehicle[]; 
  orderValue?: number; 
  customerNotes?: string; 
}

export interface CourierBid {
  bidId: string;
  orderId: string;
  courierId: string;
  courierName: string; 
  distanceToRestaurantKm: number; 
  bidAmount: number; 
  proposedEtaMinutes: number; 
  courierRating: number; 
  courierTrustScore: number; 
  vehicleType: DeliveryVehicle;
  timestamp: string; 
  isFastPickup: boolean; 
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  courierProfileSnapshot?: Partial<CourierProfile>; 
}

export type DeliveryPreference = 'arena' | 'fastest' | 'smartSaver';

export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'SCHEDULED' 
  | 'MATCHING_COURIER' 
  | 'COURIER_ASSIGNED' 
  | 'PREPARING_AT_RESTAURANT' 
  | 'AWAITING_PICKUP' 
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
  discountAmount: number; 
  finalAmount: number; 
  status: OrderStatus;
  deliveryAddress: string; 
  restaurantId: string;
  restaurantName: string;
  estimatedDeliveryTime?: string; 
  actualDeliveryTime?: string; 
  scheduledDeliveryTime?: string; 
  scheduledDeliveryTimestamp?: string; 
  assignedCourier?: { 
    id: string;
    name: string;
    photoUrl?: string;
    dataAiHint?: string; 
    rating: number;
    vehicleType: DeliveryVehicle;
    currentEtaMinutes?: number; 
    vehicleDetails?: string; 
    liveLocation?: { lat: number; lng: number };
  };
  orderTimeline?: { status: OrderStatus, timestamp: string, notes?: string }[]; 
  createdAt: string; 
  updatedAt: string; 
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface OperatingHour {
  day: DayOfWeek;
  openTime: string; 
  closeTime: string; 
  isClosed: boolean;
}

export interface RestaurantSettings { 
  id: string;
  businessName: string;
  logoUrl?: string;
  coverImageUrl?: string;
  category: string;
  address: string;
  operatingHours: OperatingHour[];
  isOpenNow: boolean;
  specialsStatus?: string;
  primaryColor?: string;
  accentColor?: string;
  dishDisplayStlye?: 'grid' | 'list'; 
  storeFont?: 'sans' | 'serif' | 'mono';
  bannerLayout?: 'textOverImage' | 'textBelowImage';
  showRatingsOnStore?: boolean;
  showDeliveryTimeOnStore?: boolean;
}

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
  estimatedBudget?: number; 
  specialInstructions?: string;
  requestedPickupTime?: string; 
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
  actualCost?: number; 
  createdAt: string; 
  updatedAt: string; 
  orderTimeline?: { status: P2POrderStatus, timestamp: string, notes?: string }[];
}

export type NutritionalGoal = 'TONING' | 'WEIGHT_LOSS' | 'ENERGY_BOOST' | 'GENERAL_HEALTHY';

export interface DishRecommendation {
  dishName: string;
  restaurantName: string; 
  description: string; 
  estimatedCalories?: number;
  estimatedProteinGrams?: number;
  reasoning: string; 
}

export interface Meal {
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  dishName: string;
  estimatedCalories: number;
}

export interface DailyMealPlan {
  day: string; 
  meals: Meal[];
  totalEstimatedCalories: number;
}

export interface WeeklyMenu {
  plan: DailyMealPlan[];
  summaryNotes?: string; 
}

// New Type for SwiftSale (End-of-Day Surprise Bags)
export interface SwiftSaleItem {
    id: string;
    restaurantId: string;
    restaurantName: string; // For display on SwiftSale page
    name: string; // e.g., "שקית מאפים מסוף יום"
    description?: string; // Optional description of typical contents
    price: number; // Discounted price
    originalPrice?: number; // Original value of contents (optional)
    quantityAvailable: number;
    imageUrl?: string; // Generic image for "surprise bag" or specific if known
    dataAiHint?: string;
    isActive: boolean; // If currently offered by the restaurant
}
