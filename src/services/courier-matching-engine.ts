// Advanced Courier Matching Engine - Dynamic Assignment System
import { PrismaClient } from '@prisma/client';
import { CourierStatus, OrderStatus, WeatherCondition } from '@/types';
import { EventEmitter } from 'events';

interface CourierMatchingRequest {
  orderId: string;
  restaurantId: string;
  deliveryLocation: {
    lat: number;
    lng: number;
    address: string;
  };
  orderValue: number;
  priority: 'normal' | 'express' | 'vip';
  estimatedPreparationTime: number;
  requiredVehicleType?: string[];
  specialInstructions?: string;
  timeWindow?: {
    earliestDelivery?: Date;
    latestDelivery?: Date;
  };
}

interface CourierBid {
  courierId: string;
  estimatedArrivalTime: number;
  proposedFee: number;
  currentLoad: number;
  rating: number;
  distance: number;
  vehicleType: 'bike' | 'scooter' | 'car' | 'motorcycle' | 'electric_bike';
  trustScore: number;
  batteryLevel?: number;
  acceptedAt?: Date;
  bidAmount?: number;
  isFastPickup?: boolean;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

interface DynamicPricingFactors {
  basePrice: number;
  demandMultiplier: number; // 1.0 - 3.0
  weatherMultiplier: number; // 0.8 - 2.0
  timeMultiplier: number; // 0.9 - 1.5
  distanceMultiplier: number; // 1.0 - 2.0
  urgencyMultiplier: number; // 1.0 - 2.5
  restaurantBusyMultiplier: number; // 1.0 - 1.8
  courierAvailabilityMultiplier: number; // 0.8 - 2.5
}

interface GeofenceArea {
  id: string;
  name: string;
  center: { lat: number; lng: number };
  radius: number; // meters
  type: 'RESTAURANT_PICKUP' | 'CUSTOMER_DELIVERY' | 'ZONE_BOUNDARY';
  actions: string[];
}

interface TrafficData {
  currentCondition: 'light' | 'moderate' | 'heavy' | 'severe';
  estimatedDelay: number; // minutes
  alternativeRoutes: number;
}

interface WeatherData {
  condition: WeatherCondition;
  temperature: number;
  precipitation: number;
  windSpeed: number;
  visibility: number;
}

interface RouteOptimization {
  waypoints: Array<{
    orderId: string;
    location: { lat: number; lng: number };
    type: 'pickup' | 'delivery';
    timeWindow?: { start: Date; end: Date };
    priority: number;
  }>;
  estimatedTime: number;
  estimatedDistance: number;
  fuelCost: number;
  difficulty: number; // 1-10 scale
}

export class CourierMatchingEngine extends EventEmitter {
  private prisma: PrismaClient;
  private activeBids: Map<string, CourierBid[]> = new Map();
  private surgeAreas: Map<string, number> = new Map();
  private courierLocations: Map<string, { lat: number; lng: number; lastUpdate: Date }> = new Map();
  private geofences: Map<string, GeofenceArea[]> = new Map();
  private activeRoutes: Map<string, RouteOptimization> = new Map();
  private trafficCache: Map<string, { data: TrafficData; expires: Date }> = new Map();
  private weatherCache: { data: WeatherData; expires: Date } | null = null;

  // Real-time WebSocket connections for live bidding
  private websocketConnections: Map<string, any> = new Map();
  
  // Performance metrics
  private metrics = {
    totalMatches: 0,
    averageMatchTime: 0,
    successfulDeliveries: 0,
    cancelledOrders: 0,
    averageDeliveryTime: 0,
    courierUtilization: new Map<string, number>()
  };

  constructor() {
    super();
    this.prisma = new PrismaClient();
    this.initializeRealtimeUpdates();
    this.startPerformanceTracking();
  }

  /**
   * 🎯 Dynamic Courier Matching - Multi-algorithm approach
   */
  async findOptimalCouriers(request: CourierMatchingRequest): Promise<{
    automatedMatch?: CourierBid;
    openMarketBids: CourierBid[];
    estimatedDeliveryTime: number;
    dynamicPrice: number;
    surgePricing?: {
      isActive: boolean;
      multiplier: number;
      reason: string;
    };
    alternativeOptions?: Array<{
      type: 'express' | 'scheduled' | 'shared';
      price: number;
      eta: number;
      description: string;
    }>;
  }> {
    const startTime = Date.now();
    
    // Update real-time data
    await this.updateTrafficData(request.deliveryLocation);
    await this.updateWeatherData();
    
    const availableCouriers = await this.getAvailableCouriers(request);
    
    // Enhanced dynamic pricing with more factors
    const pricingResult = await this.calculateAdvancedDynamicPricing(request);
    
    // Get courier bids for open market
    const openMarketBids = await this.getOpenMarketBids(request, availableCouriers);
    
    // Find best automated match using ML-enhanced algorithm
    const automatedMatch = await this.calculateOptimalMatch(availableCouriers, request);
    
    // Calculate ETA with real-time factors
    const estimatedDeliveryTime = await this.calculateDynamicETA(request, automatedMatch);
    
    // Generate alternative delivery options
    const alternativeOptions = await this.generateAlternativeOptions(request, pricingResult.basePrice);
    
    // Update metrics
    this.metrics.totalMatches++;
    this.metrics.averageMatchTime = (this.metrics.averageMatchTime + (Date.now() - startTime)) / 2;
    
    // Emit real-time events
    this.emit('match_found', {
      orderId: request.orderId,
      automatedMatch,
      openMarketBids: openMarketBids.length,
      eta: estimatedDeliveryTime
    });

    return {
      automatedMatch,
      openMarketBids,
      estimatedDeliveryTime,
      dynamicPrice: pricingResult.finalPrice,
      surgePricing: pricingResult.surgePricing,
      alternativeOptions
    };
  }

  /**
   * 🌊 Real-time Bidding System
   */
  async startRealtimeBidding(request: CourierMatchingRequest): Promise<{
    biddingSessionId: string;
    expiresAt: Date;
    minimumBid: number;
  }> {
    const sessionId = `bid_${request.orderId}_${Date.now()}`;
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    const minimumBid = await this.calculateMinimumBid(request);
    
    // Store bidding session
    await this.prisma.biddingSession.create({
      data: {
        id: sessionId,
        orderId: request.orderId,
        minimumBid,
        expiresAt,
        status: 'ACTIVE'
      }
    });
    
    // Notify all eligible couriers via WebSocket
    await this.notifyEligibleCouriers(request, sessionId, minimumBid);
    
    // Start automatic bidding closure timer
    setTimeout(() => {
      this.closeBiddingSession(sessionId);
    }, 5 * 60 * 1000);
    
    return { biddingSessionId: sessionId, expiresAt, minimumBid };
  }

  /**
   * 📱 First Come First Served Market
   */
  async publishToFirstComeFirstServed(request: CourierMatchingRequest): Promise<{
    marketListingId: string;
    estimatedAcceptanceTime: number;
    courierCount: number;
  }> {
    const listingId = `fcfs_${request.orderId}_${Date.now()}`;
    const nearbyActiveCouriers = await this.getNearbyActiveCouriers(request.deliveryLocation, 5); // 5km radius
    
    const listing = {
      id: listingId,
      orderId: request.orderId,
      restaurantName: await this.getRestaurantName(request.restaurantId),
      pickupLocation: await this.getRestaurantLocation(request.restaurantId),
      deliveryLocation: request.deliveryLocation,
      orderValue: request.orderValue,
      estimatedDistance: await this.calculateDistance(
        await this.getRestaurantLocation(request.restaurantId),
        request.deliveryLocation
      ),
      proposedFee: await this.calculateDynamicPricing(request),
      priority: request.priority,
      requiredVehicleType: request.requiredVehicleType,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    };
    
    // Store in database
    await this.prisma.marketListing.create({
      data: listing
    });
    
    // Send push notifications to nearby couriers
    await this.sendPushNotificationToCouriers(nearbyActiveCouriers, listing);
    
    // Estimate acceptance time based on historical data
    const estimatedAcceptanceTime = await this.estimateAcceptanceTime(request);
    
    return {
      marketListingId: listingId,
      estimatedAcceptanceTime,
      courierCount: nearbyActiveCouriers.length
    };
  }

  /**
   * 🚀 Open Market System - "First Come, First Served" with bidding
   */
  async publishOrderToMarket(request: CourierMatchingRequest): Promise<void> {
    const notification = {
      orderId: request.orderId,
      restaurantName: await this.getRestaurantName(request.restaurantId),
      pickupLocation: await this.getRestaurantLocation(request.restaurantId),
      deliveryLocation: request.deliveryLocation,
      estimatedDistance: await this.calculateDistance(request),
      proposedFee: await this.calculateDynamicPricing(request),
      priority: request.priority,
      estimatedPreparationTime: request.estimatedPreparationTime,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes to bid
    };

    // Send push notification to all available couriers
    await this.notifyAvailableCouriers(notification);
    
    // Store in active marketplace
    await this.prisma.courierMarketplace.create({
      data: {
        orderId: request.orderId,
        status: 'OPEN',
        proposedFee: notification.proposedFee,
        expiresAt: notification.expiresAt,
        bids: []
      }
    });
  }

  /**
   * 💰 Advanced Dynamic Pricing Engine - Multi-factor surge pricing
   */
  async calculateAdvancedDynamicPricing(request: CourierMatchingRequest): Promise<{
    basePrice: number;
    finalPrice: number;
    factors: DynamicPricingFactors;
    surgePricing: {
      isActive: boolean;
      multiplier: number;
      reason: string;
    };
    breakdown: Array<{
      factor: string;
      multiplier: number;
      reason: string;
    }>;
  }> {
    const factors: DynamicPricingFactors = {
      basePrice: this.calculateBasePrice(request),
      demandMultiplier: await this.getDemandMultiplier(request.deliveryLocation),
      weatherMultiplier: await this.getWeatherMultiplier(),
      timeMultiplier: this.getTimeMultiplier(),
      distanceMultiplier: await this.getDistanceMultiplier(request),
      urgencyMultiplier: this.getUrgencyMultiplier(request.priority),
      restaurantBusyMultiplier: await this.getRestaurantLoadMultiplier(request.restaurantId),
      courierAvailabilityMultiplier: await this.getCourierAvailabilityMultiplier(request.deliveryLocation)
    };

    const breakdown = [
      { factor: 'תנועה וביקוש', multiplier: factors.demandMultiplier, reason: this.getDemandReason(factors.demandMultiplier) },
      { factor: 'מזג אויר', multiplier: factors.weatherMultiplier, reason: await this.getWeatherReason() },
      { factor: 'זמן יום', multiplier: factors.timeMultiplier, reason: this.getTimeReason() },
      { factor: 'מרחק', multiplier: factors.distanceMultiplier, reason: this.getDistanceReason(factors.distanceMultiplier) },
      { factor: 'עדיפות', multiplier: factors.urgencyMultiplier, reason: this.getUrgencyReason(request.priority) },
      { factor: 'עומס מסעדה', multiplier: factors.restaurantBusyMultiplier, reason: 'בהתבסס על כמות הזמנות פעילות' },
      { factor: 'זמינות שליחים', multiplier: factors.courierAvailabilityMultiplier, reason: 'מבוסס על מספר שליחים פעילים באזור' }
    ];

    const finalPrice = factors.basePrice * 
      factors.demandMultiplier * 
      factors.weatherMultiplier * 
      factors.timeMultiplier * 
      factors.distanceMultiplier * 
      factors.urgencyMultiplier * 
      factors.restaurantBusyMultiplier * 
      factors.courierAvailabilityMultiplier;

    // Determine if surge pricing is active
    const totalMultiplier = finalPrice / factors.basePrice;
    const surgePricing = {
      isActive: totalMultiplier > 1.3,
      multiplier: totalMultiplier,
      reason: this.getSurgePricingReason(factors)
    };

    // Store surge area if active
    if (surgePricing.isActive) {
      const areaKey = `${Math.round(request.deliveryLocation.lat * 100)}_${Math.round(request.deliveryLocation.lng * 100)}`;
      this.surgeAreas.set(areaKey, totalMultiplier);
    }

    // Log pricing decision for analytics
    await this.logPricingDecision(request.orderId, factors, finalPrice);

    return {
      basePrice: factors.basePrice,
      finalPrice: Math.round(finalPrice * 100) / 100,
      factors,
      surgePricing,
      breakdown
    };
  }

  /**
   * 🕐 Enhanced Dynamic ETA Calculation with ML predictions
   */
  async calculateAdvancedDynamicETA(
    request: CourierMatchingRequest, 
    courier?: CourierBid
  ): Promise<{
    estimatedMinutes: number;
    breakdown: {
      preparationTime: number;
      courierToRestaurant: number;
      restaurantToCustomer: number;
      waitTime: number;
      bufferTime: number;
    };
    confidence: number; // 0-100%
    factors: Array<{
      name: string;
      impact: string;
      value: number;
    }>;
  }> {
    const restaurantLocation = await this.getRestaurantLocation(request.restaurantId);
    const courierLocation = courier ? await this.getCourierLocation(courier.courierId) : restaurantLocation;
    
    // Get real-time traffic data
    const trafficData = await this.getTrafficData(courierLocation, request.deliveryLocation);
    
    // Calculate each component
    const preparationTime = await this.getRestaurantPreparationTime(request.restaurantId);
    const courierToRestaurant = courier ? 
      await this.calculateTravelTime(courierLocation, restaurantLocation, courier.vehicleType) : 0;
    const restaurantToCustomer = await this.calculateTravelTime(
      restaurantLocation, 
      request.deliveryLocation, 
      courier?.vehicleType || 'motorcycle'
    );
    
    // Additional factors
    const restaurantWaitTime = await this.getRestaurantWaitTime(request.restaurantId);
    const courierLoadDelay = courier ? this.getCourierLoadDelay(courier.currentLoad) : 0;
    const weatherDelay = await this.getWeatherDelay();
    const bufferTime = this.calculateBufferTime(request.priority);
    
    const breakdown = {
      preparationTime,
      courierToRestaurant: courierToRestaurant + courierLoadDelay,
      restaurantToCustomer: restaurantToCustomer + trafficData.estimatedDelay + weatherDelay,
      waitTime: restaurantWaitTime,
      bufferTime
    };
    
    const totalEstimate = Object.values(breakdown).reduce((sum, time) => sum + time, 0);
    
    // Calculate confidence based on data quality
    const confidence = this.calculateETAConfidence({
      hasRealtimeTraffic: trafficData.currentCondition !== undefined,
      hasWeatherData: this.weatherCache !== null,
      hasCourierLocation: courier !== undefined,
      restaurantReliability: await this.getRestaurantReliability(request.restaurantId)
    });
    
    const factors = [
      { name: 'תנועה', impact: trafficData.currentCondition, value: trafficData.estimatedDelay },
      { name: 'מזג אויר', impact: this.weatherCache?.data.condition || 'לא זמין', value: weatherDelay },
      { name: 'עומס שליח', impact: courier ? `${courier.currentLoad} משלוחים` : 'לא זמין', value: courierLoadDelay },
      { name: 'עומס מסעדה', impact: 'התבסס על הזמנות פעילות', value: restaurantWaitTime }
    ];

    return {
      estimatedMinutes: Math.round(totalEstimate),
      breakdown,
      confidence,
      factors
    };
  }

  /**
   * 🕐 Dynamic ETA Calculation - Real-time factors
   */
  async calculateDynamicETA(
    request: CourierMatchingRequest, 
    courier?: CourierBid
  ): Promise<number> {
    const baseFactors = {
      preparationTime: request.estimatedPreparationTime,
      travelTime: courier ? courier.estimatedArrivalTime : 20,
      trafficMultiplier: await this.getTrafficMultiplier(request.deliveryLocation),
      restaurantLoadMultiplier: await this.getRestaurantLoadMultiplier(request.restaurantId),
      courierLoadMultiplier: courier ? this.getCourierLoadMultiplier(courier.currentLoad) : 1.0
    };

    const totalETA = 
      baseFactors.preparationTime + 
      (baseFactors.travelTime * baseFactors.trafficMultiplier * baseFactors.courierLoadMultiplier) +
      (baseFactors.restaurantLoadMultiplier * 2); // Additional delay for busy restaurants

    return Math.round(totalETA);
  }

  /**
   * 🗺️ Advanced Multi-Drop Route Optimization with ML
   */
  async optimizeAdvancedMultiDropRoute(courierId: string, newOrderId: string): Promise<{
    optimizedRoute: RouteOptimization;
    savings: {
      timeSaved: number;
      distanceSaved: number;
      fuelSaved: number;
      co2Reduced: number;
    };
    feasible: boolean;
    alternativeRoutes?: RouteOptimization[];
  }> {
    const currentOrders = await this.getCourierActiveOrders(courierId);
    const courierData = await this.getCourierData(courierId);
    
    // Create waypoints for all orders (pickup + delivery)
    const waypoints = await this.createWaypoints([...currentOrders, newOrderId]);
    
    // Use advanced TSP solver with multiple algorithms
    const routeOptions = await this.solveAdvancedTSP(waypoints, courierData);
    
    // Select best route considering multiple factors
    const optimizedRoute = this.selectBestRoute(routeOptions, courierData);
    
    // Calculate savings compared to individual deliveries
    const savings = await this.calculateRouteSavings(optimizedRoute, [...currentOrders, newOrderId]);
    
    // Validate route feasibility
    const feasible = await this.validateAdvancedRouteFeasibility(optimizedRoute, courierData);
    
    // Store optimized route
    this.activeRoutes.set(courierId, optimizedRoute);
    
    // Update courier route in real-time
    await this.updateCourierRoute(courierId, optimizedRoute);
    
    return {
      optimizedRoute,
      savings,
      feasible,
      alternativeRoutes: feasible ? undefined : routeOptions.slice(1, 3)
    };
  }

  /**
   * 📍 Smart Geofencing with Machine Learning predictions
   */
  async setupAdvancedGeofencing(courierId: string, orderId: string): Promise<{
    geofences: GeofenceArea[];
    estimatedTriggerTimes: Array<{
      geofenceId: string;
      estimatedArrival: Date;
      confidence: number;
    }>;
  }> {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true }
    });

    if (!order) throw new Error('Order not found');

    // Create intelligent geofences with dynamic sizing
    const geofences: GeofenceArea[] = [
      {
        id: `restaurant_approach_${orderId}`,
        name: 'Restaurant Approach Zone',
        center: order.restaurant.location,
        radius: await this.calculateDynamicRadius('restaurant_approach', order.restaurant.id),
        type: 'RESTAURANT_PICKUP',
        actions: ['notify_restaurant', 'prepare_order', 'send_eta_update']
      },
      {
        id: `restaurant_arrival_${orderId}`,
        name: 'Restaurant Arrival',
        center: order.restaurant.location,
        radius: 50, // 50m for precise arrival
        type: 'RESTAURANT_PICKUP',
        actions: ['confirm_arrival', 'start_pickup_timer', 'notify_customer']
      },
      {
        id: `delivery_approach_${orderId}`,
        name: 'Customer Delivery Approach',
        center: order.deliveryLocation,
        radius: await this.calculateDynamicRadius('delivery_approach', undefined, order.deliveryLocation),
        type: 'CUSTOMER_DELIVERY',
        actions: ['notify_customer_nearby', 'prepare_delivery_proof']
      },
      {
        id: `delivery_arrival_${orderId}`,
        name: 'Customer Delivery Arrival',
        center: order.deliveryLocation,
        radius: 100,
        type: 'CUSTOMER_DELIVERY',
        actions: ['confirm_delivery', 'capture_proof', 'complete_order']
      }
    ];

    // Store geofences in database and memory
    await this.storeGeofences(courierId, orderId, geofences);
    this.geofences.set(`${courierId}_${orderId}`, geofences);

    // Predict trigger times using ML
    const estimatedTriggerTimes = await this.predictGeofenceTriggers(courierId, geofences);

    // Start real-time monitoring
    await this.startGeofenceMonitoring(courierId, orderId);

    return { geofences, estimatedTriggerTimes };
  }

  /**
   * 🚨 Advanced Delivery Problem Management with Auto-resolution
   */
  async handleAdvancedDeliveryIssue(issue: {
    courierId: string;
    orderId: string;
    type: 'customer_not_available' | 'wrong_address' | 'accident' | 'vehicle_breakdown' | 'traffic_jam' | 'weather_emergency' | 'restaurant_delay';
    location: { lat: number; lng: number };
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    autoResolve?: boolean;
  }): Promise<{
    resolution: {
      action: string;
      estimatedResolutionTime: number;
      alternativeCourier?: string;
      compensationRequired?: boolean;
    };
    notifications: Array<{
      recipient: 'customer' | 'restaurant' | 'support' | 'courier';
      message: string;
      channel: 'push' | 'sms' | 'call' | 'email';
    }>;
  }> {
    // Log the issue with enhanced details
    const issueRecord = await this.prisma.deliveryIssue.create({
      data: {
        courierId: issue.courierId,
        orderId: issue.orderId,
        type: issue.type,
        severity: issue.severity,
        location: issue.location,
        description: issue.description,
        status: 'OPEN',
        autoResolve: issue.autoResolve || false,
        createdAt: new Date()
      }
    });

    // Determine resolution strategy based on issue type and severity
    const resolution = await this.determineResolutionStrategy(issue);
    
    // Execute immediate actions
    const notifications = await this.executeIssueResolution(issue, resolution);
    
    // Update metrics and learn from issue
    await this.updateIssueMetrics(issue);
    
    // Trigger ML model update for future predictions
    this.emit('delivery_issue', {
      issueId: issueRecord.id,
      type: issue.type,
      severity: issue.severity,
      resolution: resolution.action
    });

    return { resolution, notifications };
  }

  /**
   * 📊 Advanced Marketplace Analytics with ML Insights
   */
  async getAdvancedMarketplaceAnalytics(): Promise<{
    realTimeMetrics: {
      activeCouriers: number;
      activeOrders: number;
      averageBidTime: number;
      successfulMatches: number;
      averageDeliveryTime: number;
      customerSatisfaction: number;
    };
    surgePricing: {
      activeAreas: Array<{ area: string; multiplier: number; duration: number }>;
      predictedSurgeAreas: Array<{ area: string; probability: number; estimatedStart: Date }>;
    };
    courierPerformance: {
      topPerformers: Array<{ courierId: string; rating: number; completedOrders: number; efficiency: number }>;
      underPerformers: Array<{ courierId: string; issues: string[]; recommendedActions: string[] }>;
    };
    predictiveInsights: {
      demandForecast: Array<{ hour: number; expectedOrders: number; confidence: number }>;
      hotspots: Array<{ location: { lat: number; lng: number }; orderDensity: number; growthTrend: number }>;
      efficiency: {
        averageDeliveryTime: number;
        routeOptimizationSavings: number;
        fuelEfficiency: number;
      };
    };
    marketHealth: {
      supplyDemandRatio: number;
      averageWaitTime: number;
      cancellationRate: number;
      recommendations: string[];
    };
  }> {
    const startTime = Date.now();
    
    // Real-time metrics
    const realTimeMetrics = await this.calculateRealTimeMetrics();
    
    // Surge pricing analysis
    const surgePricing = await this.analyzeSurgePricing();
    
    // Courier performance analysis
    const courierPerformance = await this.analyzeCourierPerformance();
    
    // Predictive insights using ML
    const predictiveInsights = await this.generatePredictiveInsights();
    
    // Market health assessment
    const marketHealth = await this.assessMarketHealth();
    
    // Cache results for performance
    await this.cacheAnalytics({
      realTimeMetrics,
      surgePricing,
      courierPerformance,
      predictiveInsights,
      marketHealth,
      generatedAt: new Date()
    });

    return {
      realTimeMetrics,
      surgePricing,
      courierPerformance,
      predictiveInsights,
      marketHealth
    };
  }

  /**
   * 🎯 ML-Enhanced Courier Matching Algorithm
   */
  async findMLOptimalCouriers(request: CourierMatchingRequest): Promise<{
    primaryMatch: CourierBid & { mlScore: number; reasoning: string };
    alternativeMatches: Array<CourierBid & { mlScore: number; reasoning: string }>;
    marketPrediction: {
      expectedBids: number;
      averageAcceptanceTime: number;
      priceStability: 'stable' | 'volatile' | 'surge';
    };
  }> {
    const availableCouriers = await this.getAvailableCouriers(request);
    
    // Apply ML scoring to each courier
    const scoredCouriers = await Promise.all(
      availableCouriers.map(async (courier) => {
        const mlScore = await this.calculateMLCourierScore(courier, request);
        const reasoning = await this.generateMLReasoning(courier, request, mlScore);
        
        return {
          ...courier,
          mlScore,
          reasoning
        };
      })
    );
    
    // Sort by ML score (highest first)
    scoredCouriers.sort((a, b) => b.mlScore - a.mlScore);
    
    // Market prediction
    const marketPrediction = await this.predictMarketBehavior(request);
    
    return {
      primaryMatch: scoredCouriers[0],
      alternativeMatches: scoredCouriers.slice(1, 4),
      marketPrediction
    };
  }

  /**
   * ⚡ Real-time Performance Optimization
   */
  async optimizeSystemPerformance(): Promise<{
    optimizations: Array<{
      area: string;
      action: string;
      expectedImprovement: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
    }>;
    currentBottlenecks: Array<{
      type: 'courier_shortage' | 'high_demand' | 'traffic_congestion' | 'weather_impact';
      location?: { lat: number; lng: number };
      severity: number;
      estimatedDuration: number;
    }>;
  }> {
    const optimizations: Array<{
      area: string;
      action: string;
      expectedImprovement: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
    }> = [];
    
    const currentBottlenecks = await this.identifyBottlenecks();
    
    // Analyze courier distribution
    const courierDistribution = await this.analyzeCourierDistribution();
    if (courierDistribution.imbalanced) {
      optimizations.push({
        area: 'Courier Distribution',
        action: 'Redistribute couriers to high-demand areas',
        expectedImprovement: '15-25% reduction in delivery time',
        priority: 'high'
      });
    }
    
    // Check pricing efficiency
    const pricingEfficiency = await this.analyzePricingEfficiency();
    if (pricingEfficiency.needsAdjustment) {
      optimizations.push({
        area: 'Dynamic Pricing',
        action: 'Adjust pricing algorithm parameters',
        expectedImprovement: '10-15% increase in courier acceptance',
        priority: 'medium'
      });
    }
    
    // Route optimization potential
    const routeOptimization = await this.analyzeRouteOptimization();
    if (routeOptimization.savings > 0.1) {
      optimizations.push({
        area: 'Route Optimization',
        action: 'Implement advanced batching algorithm',
        expectedImprovement: `${Math.round(routeOptimization.savings * 100)}% time savings`,
        priority: 'high'
      });
    }
    
    // Weather impact mitigation
    if (this.weatherCache?.data.condition && ['RAIN', 'STORM', 'SNOW'].includes(this.weatherCache.data.condition)) {
      optimizations.push({
        area: 'Weather Response',
        action: 'Activate weather surge pricing and increase courier incentives',
        expectedImprovement: '20-30% increase in courier availability',
        priority: 'critical'
      });
    }

    return { optimizations, currentBottlenecks };
  }

  // ===== INITIALIZATION AND REAL-TIME UPDATES =====
  
  private initializeRealtimeUpdates(): void {
    // WebSocket server for real-time bidding
    setInterval(() => {
      this.updateCourierLocations();
      this.cleanupExpiredBids();
      this.updateSurgeAreas();
    }, 30000); // Update every 30 seconds
  }

  private startPerformanceTracking(): void {
    setInterval(() => {
      this.optimizeSystemPerformance();
      this.cleanupCache();
    }, 300000); // Every 5 minutes
  }

  // ===== PRICING HELPERS =====

  private calculateBasePrice(request: CourierMatchingRequest): number {
    let basePrice = 15; // Base delivery fee in ILS
    
    // Adjust based on order value
    if (request.orderValue > 200) basePrice += 3;
    else if (request.orderValue > 100) basePrice += 1.5;
    
    // Time-based adjustments
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) basePrice += 5; // Night premium
    
    return basePrice;
  }

  private getDemandReason(multiplier: number): string {
    if (multiplier >= 2.0) return 'ביקוש גבוה מאוד - מעט שליחים זמינים';
    if (multiplier >= 1.5) return 'ביקוש גבוה באזור';
    if (multiplier >= 1.2) return 'ביקוש מתון';
    return 'ביקוש רגיל';
  }

  private async getWeatherReason(): Promise<string> {
    if (!this.weatherCache) return 'מזג אוויר רגיל';
    
    const condition = this.weatherCache.data.condition;
    switch (condition) {
      case 'RAIN': return 'גשם - תנאי נסיעה מורכבים';
      case 'STORM': return 'סופה - תנאי נסיעה קשים';
      case 'SNOW': return 'שלג - תנאי נסיעה מסוכנים';
      case 'EXTREME_HEAT': return 'חום קיצוני';
      default: return 'מזג אוויר נוח';
    }
  }

  private getTimeReason(): string {
    const hour = new Date().getHours();
    if ((hour >= 12 && hour <= 14) || (hour >= 19 && hour <= 22)) {
      return 'שעות עומס - ארוחת צהריים/ערב';
    }
    if (hour >= 23 || hour <= 6) {
      return 'שעות לילה - פחות שליחים זמינים';
    }
    return 'שעות רגילות';
  }

  private getDistanceReason(multiplier: number): string {
    if (multiplier >= 1.5) return 'מרחק רב - מעל 5 ק"מ';
    if (multiplier >= 1.2) return 'מרחק בינוני - 3-5 ק"מ';
    return 'מרחק קרוב';
  }

  private getUrgencyReason(priority: string): string {
    switch (priority) {
      case 'express': return 'משלוח מהיר - תוך 20 דקות';
      case 'vip': return 'משלוח VIP - עדיפות מקסימלית';
      default: return 'משלוח רגיל';
    }
  }

  private getSurgePricingReason(factors: DynamicPricingFactors): string {
    const reasons = [];
    
    if (factors.demandMultiplier > 1.3) reasons.push('ביקוש גבוה');
    if (factors.weatherMultiplier > 1.3) reasons.push('מזג אוויר קשה');
    if (factors.timeMultiplier > 1.2) reasons.push('שעות עומס');
    if (factors.courierAvailabilityMultiplier > 1.5) reasons.push('מחסור בשליחים');
    
    return reasons.length > 0 ? reasons.join(', ') : 'תנאי שוק רגילים';
  }

  // ===== ETA CALCULATION HELPERS =====

  private async getRestaurantPreparationTime(restaurantId: string): Promise<number> {
    const stats = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { averagePreparationTime: true }
    });
    
    return stats?.averagePreparationTime || 15;
  }

  private async calculateTravelTime(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number },
    vehicleType: string
  ): Promise<number> {
    const distance = this.calculateDistance(from, to);
    
    // Vehicle speed in km/h
    const speeds = {
      'bike': 15,
      'electric_bike': 20,
      'motorcycle': 30,
      'scooter': 25,
      'car': 35
    };
    
    const speed = speeds[vehicleType as keyof typeof speeds] || 25;
    const timeInHours = distance / speed;
    
    return Math.round(timeInHours * 60); // Convert to minutes
  }

  private async getRestaurantWaitTime(restaurantId: string): Promise<number> {
    const activeOrders = await this.prisma.order.count({
      where: {
        restaurantId,
        status: { in: ['CONFIRMED', 'PREPARING'] }
      }
    });
    
    return Math.min(activeOrders * 2, 15); // Max 15 minutes wait
  }

  private getCourierLoadDelay(currentLoad: number): number {
    return currentLoad * 3; // 3 minutes per active order
  }

  private async getWeatherDelay(): Promise<number> {
    if (!this.weatherCache) return 0;
    
    const condition = this.weatherCache.data.condition;
    switch (condition) {
      case 'RAIN': return 5;
      case 'STORM': return 10;
      case 'SNOW': return 15;
      case 'EXTREME_HEAT': return 3;
      default: return 0;
    }
  }

  private calculateBufferTime(priority: string): number {
    switch (priority) {
      case 'express': return 2;
      case 'vip': return 1;
      default: return 5;
    }
  }

  private calculateETAConfidence(factors: {
    hasRealtimeTraffic: boolean;
    hasWeatherData: boolean;
    hasCourierLocation: boolean;
    restaurantReliability: number;
  }): number {
    let confidence = 50; // Base confidence
    
    if (factors.hasRealtimeTraffic) confidence += 20;
    if (factors.hasWeatherData) confidence += 10;
    if (factors.hasCourierLocation) confidence += 15;
    confidence += factors.restaurantReliability / 10;
    
    return Math.min(confidence, 95);
  }

  private async getRestaurantReliability(restaurantId: string): Promise<number> {
    const stats = await this.prisma.restaurant.findUnique({
      where: { id: restaurantId },
      select: { 
        onTimeDeliveryRate: true,
        averagePreparationTime: true 
      }
    });
    
    return stats?.onTimeDeliveryRate || 75;
  }

  // ===== TRAFFIC AND WEATHER DATA =====

  private async updateTrafficData(location: { lat: number; lng: number }): Promise<void> {
    const cacheKey = `${location.lat}_${location.lng}`;
    const cached = this.trafficCache.get(cacheKey);
    
    if (cached && cached.expires > new Date()) return;
    
    // In production, integrate with Google Maps Traffic API
    const trafficData: TrafficData = {
      currentCondition: this.getRandomTrafficCondition(),
      estimatedDelay: Math.floor(Math.random() * 10),
      alternativeRoutes: Math.floor(Math.random() * 3) + 1
    };
    
    this.trafficCache.set(cacheKey, {
      data: trafficData,
      expires: new Date(Date.now() + 5 * 60 * 1000) // 5 minutes
    });
  }

  private async updateWeatherData(): Promise<void> {
    if (this.weatherCache && this.weatherCache.expires > new Date()) return;
    
    // In production, integrate with weather API
    const weatherData: WeatherData = {
      condition: this.getRandomWeatherCondition(),
      temperature: 20 + Math.floor(Math.random() * 20),
      precipitation: Math.floor(Math.random() * 100),
      windSpeed: Math.floor(Math.random() * 30),
      visibility: 5 + Math.floor(Math.random() * 15)
    };
    
    this.weatherCache = {
      data: weatherData,
      expires: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes
    };
  }

  private getRandomTrafficCondition(): 'light' | 'moderate' | 'heavy' | 'severe' {
    const hour = new Date().getHours();
    if ((hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)) {
      return Math.random() > 0.3 ? 'heavy' : 'moderate';
    }
    return Math.random() > 0.7 ? 'moderate' : 'light';
  }

  private getRandomWeatherCondition(): WeatherCondition {
    const conditions: WeatherCondition[] = ['CLEAR', 'CLOUDY', 'RAIN', 'STORM'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private async getTrafficData(
    from: { lat: number; lng: number },
    to: { lat: number; lng: number }
  ): Promise<TrafficData> {
    await this.updateTrafficData(from);
    const cacheKey = `${from.lat}_${from.lng}`;
    return this.trafficCache.get(cacheKey)?.data || {
      currentCondition: 'light',
      estimatedDelay: 0,
      alternativeRoutes: 1
    };
  }
