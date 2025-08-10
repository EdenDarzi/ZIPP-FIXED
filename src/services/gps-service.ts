'use client';

/**
 * GPS Service - Advanced location and courier matching service
 * מערכת GPS מתקדמת לחיפוש שליחים ומעקב מיקומים בזמן אמת
 * עודכן לעבודה עם Prisma ומסד נתונים אמיתי
 */

import { DeliveryVehicle } from '@/types';
import { prisma } from '@/lib/db';

export interface GPSLocation {
  lat: number;
  lng: number;
  accuracy?: number; // מטרים
  timestamp?: Date;
  heading?: number; // כיוון בדרגות
  speed?: number; // מהירות בקמ"ש
}

export interface CourierGPSData {
  id: string;
  name: string;
  location: GPSLocation;
  vehicleType: DeliveryVehicle;
  status: 'available' | 'busy' | 'on_delivery' | 'offline';
  rating: number;
  trustScore: number;
  currentLoad: number;
  maxCapacity: number;
  batteryLevel?: number;
  estimatedRange?: number; // ק"מ
  isOnline: boolean;
  lastSeen: Date;
  distance?: number; // מרחק בק"מ - מתווסף דינמית בחיפוש
  bearing?: number; // כיוון בדרגות - מתווסף דינמית בחיפוש
  score?: number; // ציון אלגוריתם - מתווסף דינמית בחיפוש
  estimatedArrival?: number; // זמן הגעה משוער בדקות - מתווסף דינמית בחיפוש
}

export interface SearchRadius {
  center: GPSLocation;
  radiusKm: number;
}

export interface CourierSearchFilters {
  vehicleTypes?: DeliveryVehicle[];
  minRating?: number;
  maxDistance?: number;
  statusFilter?: ('available' | 'busy')[];
  loadCapacity?: number;
}

export interface NearestCouriersResult {
  couriers: CourierGPSData[];
  searchRadius: number;
  totalFound: number;
  averageDistance: number;
  recommendedCourier?: CourierGPSData;
}

export class GPSService {
  private static instance: GPSService;
  private watchId: number | null = null;
  private currentLocation: GPSLocation | null = null;
  private locationCallbacks: ((location: GPSLocation) => void)[] = [];

  static getInstance(): GPSService {
    if (!GPSService.instance) {
      GPSService.instance = new GPSService();
    }
    return GPSService.instance;
  }

  /**
   * חישוב מרחק בין שתי נקודות GPS (Haversine formula)
   */
  static calculateDistance(point1: GPSLocation, point2: GPSLocation): number {
    const R = 6371; // רדיוס כדור הארץ בק"מ
    const dLat = this.toRadians(point2.lat - point1.lat);
    const dLng = this.toRadians(point2.lng - point1.lng);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.lat)) * Math.cos(this.toRadians(point2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * חישוב כיוון/זווית בין שתי נקודות
   */
  static calculateBearing(point1: GPSLocation, point2: GPSLocation): number {
    const dLng = this.toRadians(point2.lng - point1.lng);
    const lat1 = this.toRadians(point1.lat);
    const lat2 = this.toRadians(point2.lat);

    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

    let bearing = Math.atan2(y, x);
    bearing = (bearing * 180) / Math.PI;
    return (bearing + 360) % 360;
  }

  /**
   * בדיקה אם נקודה נמצאת בתוך רדיוס מסוים
   */
  static isWithinRadius(center: GPSLocation, point: GPSLocation, radiusKm: number): boolean {
    const distance = this.calculateDistance(center, point);
    return distance <= radiusKm;
  }

  /**
   * חיפוש שליחים קרובים עם אלגוריתם חכם - מחובר למסד הנתונים
   */
  static async findNearestCouriers(
    location: GPSLocation,
    filters: CourierSearchFilters = {},
    maxResults: number = 10
  ): Promise<NearestCouriersResult> {
    try {
      // שליפת שליחים מהמסד הנתונים
      const couriers = await prisma.courierProfile.findMany({
        where: {
          isActive: true,
          courierLocation: {
            status: 'AVAILABLE'
          },
          ...(filters.vehicleTypes && {
            vehicleType: { in: filters.vehicleTypes as any[] }
          }),
          ...(filters.minRating && {
            rating: { gte: filters.minRating }
          })
        },
        include: {
          courierLocation: true
        }
      });

      // המרה לפורמט CourierGPSData עם מיקומים אחרונים
      const couriersWithLocations = couriers
        .filter((courier: any) => courier.locations.length > 0)
        .map((courier: any) => {
          const lastLocation = courier.locations[0];
          return {
            id: courier.id,
            name: courier.fullName,
            location: {
              lat: lastLocation.lat,
              lng: lastLocation.lng,
              accuracy: lastLocation.accuracy || undefined,
              heading: lastLocation.heading || undefined,
              speed: lastLocation.speed || undefined,
              timestamp: lastLocation.timestamp
            },
            vehicleType: courier.vehicleType.toLowerCase() as DeliveryVehicle,
            status: lastLocation.status.toLowerCase() as 'available' | 'busy' | 'on_delivery' | 'offline',
            rating: courier.rating,
            trustScore: courier.trustScore,
            currentLoad: courier.currentLoad,
            maxCapacity: courier.maxCapacity,
            batteryLevel: courier.batteryLevel || undefined,
            estimatedRange: courier.estimatedRange || undefined,
            isOnline: courier.isOnline,
            lastSeen: courier.lastSeen
          } as CourierGPSData;
        });

      // סינון שליחים לפי קריטריונים נוספים
      let filteredCouriers = couriersWithLocations.filter((courier: CourierGPSData) => {
        // סטטוס זמינות
        if (filters.statusFilter && !filters.statusFilter.includes(courier.status as any)) {
          return false;
        }
        
        // קיבולת עומס
        if (filters.loadCapacity && courier.currentLoad >= courier.maxCapacity) {
          return false;
        }

        return true;
      });

      // חישוב מרחק וסינון לפי מרחק מקסימלי
      const couriersWithDistance = filteredCouriers.map((courier: CourierGPSData) => {
        const distance = this.calculateDistance(location, courier.location);
        const estimatedArrival = GPSUtils.estimateArrivalTime(distance, courier.vehicleType);
        
        return {
          ...courier,
          distance,
          bearing: this.calculateBearing(location, courier.location),
          estimatedArrival
        };
      }).filter((courier: any) => {
        if (filters.maxDistance) {
          return courier.distance <= filters.maxDistance;
        }
        return true;
      });

      // מיון לפי אלגוריתם חכם (מרחק + דירוג + זמינות)
      const scoredCouriers = couriersWithDistance.map((courier: any) => {
        const distanceScore = Math.max(0, 10 - courier.distance); // ככל שקרוב יותר, ציון גבוה יותר
        const ratingScore = courier.rating * 2; // דירוג מ-1-5 לציון מ-2-10
        const trustScore = courier.trustScore / 10; // טראסט מ-0-100 לציון מ-0-10
        const loadScore = Math.max(0, 5 - courier.currentLoad); // ככל שפחות עומס, ציון גבוה יותר
        
        // משקלים: מרחק 35%, דירוג 25%, אמון 20%, עומס 15%, סוללה 5%
        const batteryScore = courier.batteryLevel ? courier.batteryLevel / 20 : 5; // ציון סוללה
        const totalScore = (distanceScore * 0.35) + (ratingScore * 0.25) + (trustScore * 0.20) + (loadScore * 0.15) + (batteryScore * 0.05);
        
        return {
          ...courier,
          score: totalScore
        };
      });

      // מיון לפי ציון
      scoredCouriers.sort((a: any, b: any) => b.score - a.score);
      
      // החזרת תוצאות
      const results = scoredCouriers.slice(0, maxResults);
      const averageDistance = results.length > 0 
        ? results.reduce((sum: number, c: any) => sum + c.distance, 0) / results.length 
        : 0;

      return {
        couriers: results,
        searchRadius: filters.maxDistance || 10, // ברירת מחדל 10 ק"מ
        totalFound: results.length,
        averageDistance,
        recommendedCourier: results[0] || undefined
      };

    } catch (error) {
      console.error('Error finding nearest couriers:', error);
      throw new Error('שגיאה בחיפוש שליחים');
    }
  }

  /**
   * התחלת מעקב GPS
   */
  startTracking(callback: (location: GPSLocation) => void, options?: PositionOptions): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('GPS לא נתמך בדפדפן זה'));
        return;
      }

      this.locationCallbacks.push(callback);

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
        ...options
      };

      // קבלת מיקום ראשוני
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: GPSLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed ? position.coords.speed * 3.6 : undefined, // המרה מ-m/s ל-km/h
            timestamp: new Date()
          };
          
          this.currentLocation = location;
          this.notifyCallbacks(location);
          resolve();
        },
        (error) => {
          reject(new Error(`שגיאה בקבלת מיקום: ${error.message}`));
        },
        defaultOptions
      );

      // התחלת מעקב רציף
      this.watchId = navigator.geolocation.watchPosition(
        (position) => {
          const location: GPSLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            heading: position.coords.heading || undefined,
            speed: position.coords.speed ? position.coords.speed * 3.6 : undefined,
            timestamp: new Date()
          };
          
          this.currentLocation = location;
          this.notifyCallbacks(location);
        },
        (error) => {
          console.error('GPS tracking error:', error);
        },
        defaultOptions
      );
    });
  }

  /**
   * עצירת מעקב GPS
   */
  stopTracking(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.locationCallbacks = [];
  }

  /**
   * קבלת מיקום נוכחי
   */
  getCurrentLocation(): GPSLocation | null {
    return this.currentLocation;
  }

  /**
   * עדכון מיקום שליח למסד הנתונים
   */
  async updateCourierLocation(
    courierId: string, 
    location: GPSLocation, 
    status: 'available' | 'busy' | 'on_delivery' | 'offline' = 'available'
  ): Promise<void> {
    try {
      await prisma.courierLocation.create({
        data: {
          courierId,
          lat: location.lat,
          lng: location.lng,
          accuracy: location.accuracy,
          heading: location.heading,
          speed: location.speed,
          status: status.toUpperCase() as any,
        }
      });

      // עדכון הסטטוס האחרון של השליח
      await prisma.courierProfile.update({
        where: { id: courierId },
        data: { 
          // Note: lastSeen and isOnline fields don't exist in schema
          // Using updatedAt which is automatically updated
        }
      });

    } catch (error) {
      console.error('Error updating courier location:', error);
      throw error;
    }
  }

  private notifyCallbacks(location: GPSLocation): void {
    this.locationCallbacks.forEach(callback => callback(location));
  }
}

// Export singleton instance
export const gpsService = GPSService.getInstance();

// Helper functions for common GPS operations
export const GPSUtils = {
  /**
   * פורמט מיקום לתצוגה
   */
  formatLocation(location: GPSLocation, precision: number = 4): string {
    return `${location.lat.toFixed(precision)}, ${location.lng.toFixed(precision)}`;
  },

  /**
   * בדיקה אם מיקום בתל אביב
   */
  isInTelAviv(location: GPSLocation): boolean {
    const TEL_AVIV_BOUNDS = {
      north: 32.1500,
      south: 32.0000,
      east: 34.8500,
      west: 34.7000
    };

    return location.lat >= TEL_AVIV_BOUNDS.south && 
           location.lat <= TEL_AVIV_BOUNDS.north &&
           location.lng >= TEL_AVIV_BOUNDS.west && 
           location.lng <= TEL_AVIV_BOUNDS.east;
  },

  /**
   * חישוב זמן הגעה משוער
   */
  estimateArrivalTime(distance: number, vehicleType: DeliveryVehicle): number {
    const speeds = {
      foot: 5,
      bicycle: 15,
      scooter: 25,
      motorcycle: 35,
      car: 30
    };

    const avgSpeed = speeds[vehicleType] || 20;
    return Math.round((distance / avgSpeed) * 60); // דקות
  },

  /**
   * המרת מרחק לתצוגה
   */
  formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}מ'`;
    }
    return `${distanceKm.toFixed(1)}ק"מ`;
  }
};

export default GPSService;
