import type { Location } from './restaurant';
import type { DeliveryVehicle } from './delivery';

export type CourierProfile = {
  id: string;
  name: string;
  rating: number;
  trustScore: number; // AI-calculated reliability score
  vehicleType: DeliveryVehicle;
  areaCoverageRadiusKm: number;
  currentLocation: Location;
  currentSpeedKmh?: number;
  batteryPercent?: number; // For electric vehicles
  isActive: boolean;
  transportationModeDetails?: string; // e.g. "Honda PCX 150"
  currentDeliveriesCount?: number;
  totalDeliveriesToday?: number;
};

export type CourierBid = {
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
  timestamp: string; // ISO 8601
  isFastPickup: boolean;
  status?: 'pending' | 'accepted' | 'rejected' | 'expired';
  courierProfileSnapshot?: Partial<CourierProfile>;
};

export type AssignedCourierInfo = {
  id: string;
  name: string;
  rating: number;
  vehicleType: DeliveryVehicle;
  currentEtaMinutes?: number;
};

export {};
