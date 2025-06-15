
import type { Restaurant, MenuItem, OrderDetailsForBidding, CourierProfile, CourierBid, Order, DeliveryPreference, RestaurantTag, Location, DeliveryVehicle } from '@/types';

const mockMenuItems: Omit<MenuItem, 'restaurantId'>[] = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    description: 'Classic delight with 100% real mozzarella cheese',
    price: 12.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pizza margherita delicious',
    category: 'Pizza',
  },
  {
    id: 'item2',
    name: 'Pepperoni Pizza',
    description: 'A classic favorite with rich, savory pepperoni.',
    price: 14.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pizza pepperoni spicy',
    category: 'Pizza',
  },
  {
    id: 'item3',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce.',
    price: 9.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'burger classic beef',
    category: 'Burgers',
  },
  {
    id: 'item4',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, Parmesan cheese, croutons, and Caesar dressing.',
    price: 8.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'salad caesar fresh',
    category: 'Salads',
  },
  {
    id: 'item5',
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta, egg, and Parmesan cheese.',
    price: 13.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pasta carbonara italian',
    category: 'Pasta',
  },
  {
    id: 'item6',
    name: 'Coca-Cola',
    description: 'Classic Coca-Cola',
    price: 2.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'soda drink refreshment',
    category: 'Drinks',
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'restaurant1',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas baked to perfection with the freshest ingredients.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'pizza restaurant italian', 
    location: '123 Main St, Anytown',
    cuisineType: 'Italian',
    rating: 4.5,
    deliveryTimeEstimate: '25-35 min',
    menu: mockMenuItems.filter(item => item.category === 'Pizza' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant1' })),
    hasDeliveryArena: true,
    tags: ['Popular', 'Fast Delivery', 'Delivery Arena'],
  },
  {
    id: 'restaurant2',
    name: 'Burger Bonanza',
    description: 'The best burgers in town, grilled just right. Taste the difference!',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'burger joint american', 
    location: '456 Oak Ave, Anytown',
    cuisineType: 'American',
    rating: 4.2,
    deliveryTimeEstimate: '20-30 min',
    menu: mockMenuItems.filter(item => item.category === 'Burgers' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant2' })),
    hasDeliveryArena: false,
    tags: ['Recommended', 'Hot Now'],
  },
  {
    id: 'restaurant3',
    name: 'Pasta Perfection',
    description: 'Delicious pasta dishes made with love and traditional recipes.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'pasta place authentic', 
    location: '789 Pine Ln, Anytown',
    cuisineType: 'Italian',
    rating: 4.8,
    deliveryTimeEstimate: '30-40 min',
    menu: mockMenuItems.filter(item => item.category === 'Pasta' || item.category === 'Salads' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant3' })),
    hasDeliveryArena: true,
    tags: ['New', 'Recommended', 'Delivery Arena'],
  },
  {
    id: 'restaurant4',
    name: 'Salad Sensations',
    description: 'Fresh and healthy salads for a guilt-free and delicious meal.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'salad bar healthy', 
    location: '101 Maple Dr, Anytown',
    cuisineType: 'Healthy',
    rating: 4.0,
    deliveryTimeEstimate: '15-25 min',
    menu: mockMenuItems.filter(item => item.category === 'Salads' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant4' })),
    hasDeliveryArena: true,
    tags: ['Fast Delivery', 'Delivery Arena'],
  },
];

export const getRestaurantById = (id: string): Restaurant | undefined => {
  return mockRestaurants.find(r => r.id === id);
};

export const getItemById = (restaurantId: string, itemId: string): MenuItem | undefined => {
  const restaurant = getRestaurantById(restaurantId);
  return restaurant?.menu.find(item => item.id === itemId);
};

export const getAllItems = (): MenuItem[] => {
  return mockRestaurants.reduce((acc, curr) => acc.concat(curr.menu), [] as MenuItem[]);
};

export const mockCourierProfiles: CourierProfile[] = [
  {
    id: 'courier1',
    name: 'Speedy Sam',
    rating: 4.8,
    trustScore: 92,
    vehicleType: 'motorcycle',
    areaCoverageRadiusKm: 5,
    currentLocation: { lat: 34.0522, lng: -118.2437 }, // Downtown LA
    currentSpeedKmh: 35,
    batteryPercent: undefined, // N/A for motorcycle
    isActive: true,
    transportationModeDetails: "Yamaha NMAX 155"
  },
  {
    id: 'courier2',
    name: 'Reliable Rita',
    rating: 4.6,
    trustScore: 95,
    vehicleType: 'car',
    areaCoverageRadiusKm: 7,
    currentLocation: { lat: 34.0550, lng: -118.2500 }, // Near Downtown LA
    currentSpeedKmh: 45,
    batteryPercent: undefined,
    isActive: true,
    transportationModeDetails: "Toyota Prius"
  },
  {
    id: 'courier3',
    name: 'Eco Ethan',
    rating: 4.3,
    trustScore: 85,
    vehicleType: 'bicycle', 
    areaCoverageRadiusKm: 3,
    currentLocation: { lat: 34.0500, lng: -118.2400 }, // Close to restaurants
    currentSpeedKmh: 15,
    batteryPercent: 75, // E-bike
    isActive: true,
    transportationModeDetails: "Specialized Turbo Vado (e-bike)"
  },
  {
    id: 'courier4',
    name: 'Swift Sarah',
    rating: 4.9,
    trustScore: 90,
    vehicleType: 'scooter',
    areaCoverageRadiusKm: 4,
    currentLocation: { lat: 34.0480, lng: -118.2450 },
    currentSpeedKmh: 22,
    batteryPercent: 88,
    isActive: true,
    transportationModeDetails: "Xiaomi Mi Electric Scooter Pro 2"
  },
   {
    id: 'courier5',
    name: 'Walker Wally',
    rating: 4.1,
    trustScore: 80,
    vehicleType: 'foot',
    areaCoverageRadiusKm: 1.5,
    currentLocation: { lat: 34.0510, lng: -118.2420 },
    isActive: true,
    transportationModeDetails: "Comfortable Sneakers"
  }
];

export const mockOpenOrdersForBidding: OrderDetailsForBidding[] = [
  {
    orderId: 'orderBid1',
    restaurantName: 'Pizza Palace',
    restaurantLocation: { lat: 34.052235, lng: -118.243683 },
    deliveryAddress: '123 Customer Way, Anytown',
    deliveryLocation: { lat: 34.0600, lng: -118.2500 },
    estimatedDistanceKm: 2.5, // as the crow flies
    estimatedRouteDistanceKm: 3.1, // from mapping service
    baseCommission: 10.00,
    itemsDescription: '1 Margherita Pizza, 2 Cokes',
    expectedPickupTime: 'ASAP (~10 min prep)',
    requiredVehicleType: ['motorcycle', 'car', 'scooter', 'bicycle'],
    orderValue: 17.99,
    customerNotes: "Please ring the bell twice."
  },
  {
    orderId: 'orderBid2',
    restaurantName: 'Burger Bonanza',
    restaurantLocation: { lat: 34.050000, lng: -118.240000 },
    deliveryAddress: '456 Client Ave, Anytown',
    deliveryLocation: { lat: 34.0450, lng: -118.2350 },
    estimatedDistanceKm: 1.2,
    estimatedRouteDistanceKm: 1.5,
    baseCommission: 8.50,
    itemsDescription: '2 Classic Burgers, 1 Fries',
    expectedPickupTime: 'ASAP (~8 min prep)',
    orderValue: 22.48,
    customerNotes: "Leave at front porch if no answer."
  },
  {
    orderId: 'orderBid3',
    restaurantName: 'Pasta Perfection',
    restaurantLocation: { lat: 34.0580, lng: -118.2490 },
    deliveryAddress: '789 Gourmet St, Anytown',
    deliveryLocation: { lat: 34.0550, lng: -118.2550 },
    estimatedDistanceKm: 0.8,
    estimatedRouteDistanceKm: 1.0,
    baseCommission: 7.00,
    itemsDescription: '1 Spaghetti Carbonara',
    expectedPickupTime: 'Ready in 15 mins',
    requiredVehicleType: ['bicycle', 'foot', 'scooter'], // Suitable for short distance
    orderValue: 13.50,
  }
];

export const getOrderForBiddingById = (orderId: string): OrderDetailsForBidding | undefined => {
  return mockOpenOrdersForBidding.find(order => order.orderId === orderId);
};

export const mockBidsForOrder: (orderId: string) => CourierBid[] = (orderId) => {
  const now = Date.now();
  const allCouriers = [...mockCourierProfiles]; 
  const selectedCouriers: CourierProfile[] = [];
  
  while(selectedCouriers.length < 3 && allCouriers.length > 0) {
    const randomIndex = Math.floor(Math.random() * allCouriers.length);
    selectedCouriers.push(allCouriers.splice(randomIndex, 1)[0]);
  }

  const orderDetails = getOrderForBiddingById(orderId);
  if (!orderDetails) return [];

  const bids: CourierBid[] = [];

  selectedCouriers.forEach((courier, index) => {
    if (orderDetails.requiredVehicleType && orderDetails.requiredVehicleType.length > 0 && !orderDetails.requiredVehicleType.includes(courier.vehicleType)) {
        return; 
    }
    const bidAmountVariance = (Math.random() - 0.3) * 2; 
    const bidAmount = parseFloat((orderDetails.baseCommission + bidAmountVariance).toFixed(2));
    
    const etaVariance = Math.floor(Math.random() * 10) - 3; 
    const baseEta = (orderDetails.estimatedRouteDistanceKm || orderDetails.estimatedDistanceKm) * (courier.vehicleType === 'bicycle' ? 7 : courier.vehicleType === 'foot' ? 12 : 4);
    const proposedEtaMinutes = Math.max(5, Math.round(baseEta + etaVariance + (Math.random() * 3 + 0.5)*3));

    bids.push({
      bidId: `bid-${orderId}-${courier.id}-${index}`,
      orderId,
      courierId: courier.id,
      courierName: courier.name,
      distanceToRestaurantKm: parseFloat((Math.random() * 3 + 0.2).toFixed(1)), 
      bidAmount: Math.max(5.00, bidAmount), 
      proposedEtaMinutes,
      courierRating: courier.rating,
      courierTrustScore: courier.trustScore,
      vehicleType: courier.vehicleType,
      timestamp: new Date(now - (index + 1) * 30000).toISOString(), 
      isFastPickup: Math.random() > 0.6, 
      status: 'pending',
      courierProfileSnapshot: { ...courier }
    });
  });
  
  return bids;
};


export const getMockOrderById = (orderId: string, scheduledDeliveryTime?: string): Order | undefined => {
  // Use only the base part of orderId for matching if it's a scheduled order ID
  const baseOrderId = orderId.split('_scheduled_')[0];

  if (baseOrderId.startsWith('mockOrder_')) {
    const restaurant = mockRestaurants[0]; 
    const items = [
        { ...restaurant.menu[0], quantity: 1 }, 
        { ...restaurant.menu.find(m => m.category === 'Drinks')!, quantity: 2 } 
    ].map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        dataAiHint: item.dataAiHint
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const initialStatus = scheduledDeliveryTime ? 'SCHEDULED' : 'MATCHING_COURIER';
    const initialTimelineNote = scheduledDeliveryTime 
        ? `ההזמנה תוכננה ל: ${scheduledDeliveryTime}.`
        : "התשלום התקבל. מחפש שליח.";

    const baseOrder: Order = {
      id: orderId, // Use the full orderId which might contain schedule info
      userId: 'userTest1',
      items,
      totalAmount,
      deliveryPreference: 'arena' as DeliveryPreference,
      deliveryFee: 0,
      discountAmount: 0,
      finalAmount: totalAmount,
      status: initialStatus,
      deliveryAddress: '123 Delivery St, Foodtown, CA 90210',
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      scheduledDeliveryTime: scheduledDeliveryTime, // Store the user-friendly string
      scheduledDeliveryTimestamp: scheduledDeliveryTime ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined, // Mock: 24h from now if scheduled
      orderTimeline: [
        { status: 'PENDING_PAYMENT', timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(), notes: "מעבד תשלום..." },
        { status: initialStatus, timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), notes: initialTimelineNote }
      ]
    };
    return baseOrder;
  }
  return undefined;
};

// For Restaurant Admin Orders Page
export const mockLiveOrdersForAdmin: Order[] = [
  {
    id: 'adminOrder1', userId: 'userABC', items: [{ menuItemId: 'item1', name: 'מוצר אקספרס', price: 12.99, quantity: 1 }],
    totalAmount: 12.99, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 12.99,
    status: 'PREPARING_AT_RESTAURANT', deliveryAddress: 'רחוב ראשי 123', restaurantId: 'business1', restaurantName: 'העסק שלי',
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(), updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: '15-20 דקות',
    orderTimeline: [{ status: 'PREPARING_AT_RESTAURANT', timestamp: new Date().toISOString(), notes: "ההזמנה התקבלה במערכת."}]
  },
  {
    id: 'adminOrder2', userId: 'userDEF', items: [{ menuItemId: 'item3', name: 'שירות פרימיום', price: 9.99, quantity: 2 }, { menuItemId: 'item6', name: 'מוצר נלווה', price: 2.50, quantity: 2 }],
    totalAmount: 24.98, deliveryPreference: 'fastest', deliveryFee: 5, discountAmount: 0, finalAmount: 29.98,
    status: 'AWAITING_PICKUP', deliveryAddress: 'שדרות העצמאות 456', restaurantId: 'business1', restaurantName: 'העסק שלי',
    createdAt: new Date(Date.now() - 15 * 60000).toISOString(), updatedAt: new Date().toISOString(),
    estimatedDeliveryTime: '5-10 דקות לאיסוף',
    assignedCourier: { id: 'courier1', name: 'שליח זריז', rating: 4.8, vehicleType: 'motorcycle', currentEtaMinutes: 7 },
    orderTimeline: [
        { status: 'PREPARING_AT_RESTAURANT', timestamp: new Date(Date.now() - 10 * 60000).toISOString()},
        { status: 'AWAITING_PICKUP', timestamp: new Date().toISOString(), notes: "המוצר מוכן. השליח עודכן."}
    ]
  },
  {
    id: 'adminOrderScheduled1', userId: 'userGHI', items: [{ menuItemId: 'item4', name: 'סלט בריאות', price: 10.50, quantity: 1 }],
    totalAmount: 10.50, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 10.50,
    status: 'SCHEDULED', deliveryAddress: 'דרך העתיד 1', restaurantId: 'business1', restaurantName: 'העסק שלי',
    createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), updatedAt: new Date().toISOString(),
    scheduledDeliveryTime: 'מחר, 12:00-12:30',
    scheduledDeliveryTimestamp: new Date(Date.now() + 22 * 60 * 60000).toISOString(),
    orderTimeline: [{ status: 'SCHEDULED', timestamp: new Date().toISOString(), notes: "הזמנה מתוכננת התקבלה."}]
  },
];

export const mockOrderHistoryForAdmin: Order[] = [
 {
    id: 'adminOrderHist1', userId: 'userXYZ', items: [{ menuItemId: 'item2', name: 'מוצר פופולרי', price: 14.99, quantity: 1 }],
    totalAmount: 14.99, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 14.99,
    status: 'DELIVERED', deliveryAddress: 'סמטת האורנים 789', restaurantId: 'business1', restaurantName: 'העסק שלי',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(),
    actualDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(),
    orderTimeline: [{ status: 'DELIVERED', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString()}]
  },
   {
    id: 'adminOrderScheduledDelivered', userId: 'userJKL', items: [{ menuItemId: 'item5', name: 'פסטה מפנקת', price: 18.00, quantity: 1 }],
    totalAmount: 18.00, deliveryPreference: 'smartSaver', deliveryFee: 0, discountAmount: 3.00, finalAmount: 15.00,
    status: 'DELIVERED', deliveryAddress: 'כיכר החלומות 2', restaurantId: 'business1', restaurantName: 'העסק שלי',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60000 + 45 * 60000).toISOString(),
    scheduledDeliveryTime: 'לפני יומיים, 19:00-19:30',
    scheduledDeliveryTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60000 + 40 * 60000).toISOString(), // Simulating it was scheduled
    actualDeliveryTime: new Date(Date.now() - 3 * 24 * 60 * 60000 + 45 * 60000).toISOString(),
    orderTimeline: [{ status: 'DELIVERED', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000 + 45 * 60000).toISOString()}]
  },
];
