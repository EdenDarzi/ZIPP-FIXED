// Types for delivery-related functionality

export const deliveryVehicleTypes = ['motorcycle', 'car', 'bicycle', 'foot', 'scooter'] as const;
export type DeliveryVehicle = typeof deliveryVehicleTypes[number];

export interface DeliveryStatus {
  id: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'in_transit' | 'delivered' | 'failed' | 'cancelled';
  timestamp: Date;
  notes?: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export interface DeliveryRequest {
  id: string;
  pickupLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoffLocation: {
    address: string;
    lat: number;
    lng: number;
  };
  packageSize: 'small' | 'medium' | 'large';
  packageWeight: number; // in kg
  fragile: boolean;
  urgent: boolean;
  scheduledPickup?: Date;
  price: number;
  distance: number; // in km
  estimatedDuration: number; // in minutes
  notes?: string;
  status: DeliveryStatus[];
  courierId?: string;
  customerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliverySummary {
  totalDeliveries: number;
  completedDeliveries: number;
  cancelledDeliveries: number;
  averageTime: number; // in minutes
  totalDistance: number; // in km
  totalEarnings: number;
}
