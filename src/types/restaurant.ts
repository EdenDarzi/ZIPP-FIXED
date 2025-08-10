import type { DeliveryVehicle } from "./delivery";
import type { AssignedCourierInfo } from "./courier";

export type Location = { lat: number; lng: number };
export type RestaurantTag = 'Popular' | 'New' | 'Recommended' | 'Fast Delivery' | 'Delivery Arena' | 'Hot Now';
export type DeliveryPreference = 'fastest' | 'smartSaver' | 'arena' | 'takeaway' | 'curbside';
export type DayOfWeek = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type OperatingHour = {
  day: DayOfWeek;
  open: string; // "HH:MM"
  close: string; // "HH:MM"
};

export type RestaurantSettings = {
  operatingHours: OperatingHour[];
  isTemporarilyClosed: boolean;
  noticeMessage?: string;
};

export type Restaurant = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  dataAiHint: string;
  location: string;
  cuisineType: string;
  rating: number;
  deliveryTimeEstimate: string;
  menu: MenuItem[];
  hasDeliveryArena: boolean;
  tags: RestaurantTag[];
  livePickSaleConfig?: {
    enabled: boolean;
    startTime: string; // "HH:MM"
    bagCount: number;
    bagPrice: number;
  };
  supportsTakeaway: boolean;
  supportsCurbsidePickup: boolean;
  settings?: RestaurantSettings;
};

export type AddonOption = {
  id: string;
  name: string;
  price: number;
  selectedByDefault?: boolean;
};

export type AddonGroup = {
  id: string;
  title: string;
  type: 'radio' | 'checkbox';
  required?: boolean;
  minSelection?: number;
  maxSelection?: number;
  options: AddonOption[];
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  dataAiHint: string;
  category: string;
  isAvailable: boolean;
  restaurantId: string;
  addons?: AddonGroup[];
};

export type SelectedAddon = {
  groupId: string;
  groupTitle: string;
  optionId: string;
  optionName: string;
  optionPrice: number;
};

export type CartItem = {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  dataAiHint?: string;
  selectedAddons?: SelectedAddon[];
  restaurantId: string;
};

export type OrderStatus = 'PENDING_PAYMENT' | 'MATCHING_COURIER' | 'PREPARING_AT_RESTAURANT' | 'AWAITING_PICKUP' | 'IN_TRANSIT' | 'DELIVERED' | 'CANCELLED' | 'FAILED_DELIVERY' | 'SCHEDULED';

export type OrderTimelineEvent = {
  status: OrderStatus;
  timestamp: string; // ISO 8601
  notes?: string;
};

export type Order = {
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
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
  estimatedDeliveryTime?: string;
  actualDeliveryTime?: string; // ISO 8601
  assignedCourier?: AssignedCourierInfo;
  orderTimeline: OrderTimelineEvent[];
  scheduledDeliveryTime?: string;
  scheduledDeliveryTimestamp?: string; // ISO 8601
};

export type OrderDetailsForBidding = {
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
};

export type LivePickSaleItem = {
  id: string;
  restaurantId: string;
  restaurantName: string;
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  quantityAvailable: number;
  imageUrl: string;
  dataAiHint: string;
  isActive: boolean;
};

export {};
