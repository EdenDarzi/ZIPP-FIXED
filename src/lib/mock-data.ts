
import type { Restaurant, MenuItem, OrderDetailsForBidding, CourierProfile, CourierBid, Order, DeliveryPreference } from '@/types';

const mockMenuItems: Omit<MenuItem, 'restaurantId'>[] = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    description: 'Classic delight with 100% real mozzarella cheese',
    price: 12.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pizza margherita',
    category: 'Pizza',
  },
  {
    id: 'item2',
    name: 'Pepperoni Pizza',
    description: 'A classic favorite with rich, savory pepperoni.',
    price: 14.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pizza pepperoni',
    category: 'Pizza',
  },
  {
    id: 'item3',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce.',
    price: 9.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'burger classic',
    category: 'Burgers',
  },
  {
    id: 'item4',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, Parmesan cheese, croutons, and Caesar dressing.',
    price: 8.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'salad caesar',
    category: 'Salads',
  },
  {
    id: 'item5',
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta, egg, and Parmesan cheese.',
    price: 13.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pasta carbonara',
    category: 'Pasta',
  },
  {
    id: 'item6',
    name: 'Coca-Cola',
    description: 'Classic Coca-Cola',
    price: 2.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'soda drink',
    category: 'Drinks',
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'restaurant1',
    name: 'Pizza Palace',
    description: 'Authentic Italian pizzas baked to perfection.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'restaurant pizza',
    location: '123 Main St, Anytown',
    cuisineType: 'Italian',
    rating: 4.5,
    deliveryTimeEstimate: '25-35 min',
    menu: mockMenuItems.filter(item => item.category === 'Pizza' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant1' })),
    hasDeliveryArena: true,
  },
  {
    id: 'restaurant2',
    name: 'Burger Bonanza',
    description: 'The best burgers in town, grilled just right.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'restaurant burger',
    location: '456 Oak Ave, Anytown',
    cuisineType: 'American',
    rating: 4.2,
    deliveryTimeEstimate: '20-30 min',
    menu: mockMenuItems.filter(item => item.category === 'Burgers' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant2' })),
    hasDeliveryArena: false,
  },
  {
    id: 'restaurant3',
    name: 'Pasta Perfection',
    description: 'Delicious pasta dishes made with fresh ingredients.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'restaurant pasta',
    location: '789 Pine Ln, Anytown',
    cuisineType: 'Italian',
    rating: 4.8,
    deliveryTimeEstimate: '30-40 min',
    menu: mockMenuItems.filter(item => item.category === 'Pasta' || item.category === 'Salads' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant3' })),
    hasDeliveryArena: true,
  },
  {
    id: 'restaurant4',
    name: 'Salad Sensations',
    description: 'Fresh and healthy salads for a guilt-free meal.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'restaurant salad',
    location: '101 Maple Dr, Anytown',
    cuisineType: 'Healthy',
    rating: 4.0,
    deliveryTimeEstimate: '15-25 min',
    menu: mockMenuItems.filter(item => item.category === 'Salads' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant4' })),
    hasDeliveryArena: true,
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
    vehicleType: 'bicycle', // Changed from Quick Quinn
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
    baseCommission: 10,
    itemsDescription: '1 Margherita Pizza, 2 Cokes',
    expectedPickupTime: 'ASAP (~10 min prep)',
    requiredVehicleType: ['motorcycle', 'car', 'bicycle', 'scooter'],
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
    baseCommission: 8,
    itemsDescription: '2 Classic Burgers, 1 Fries',
    expectedPickupTime: 'ASAP (~8 min prep)',
    orderValue: 22.48,
  },
];

export const getOrderForBiddingById = (orderId: string): OrderDetailsForBidding | undefined => {
  return mockOpenOrdersForBidding.find(order => order.orderId === orderId);
};

// More diverse bids for orderBid1
export const mockBidsForOrder: (orderId: string) => CourierBid[] = (orderId) => {
  const now = Date.now();
  const courier1Profile = mockCourierProfiles.find(c => c.id === 'courier1');
  const courier2Profile = mockCourierProfiles.find(c => c.id === 'courier2');
  const courier3Profile = mockCourierProfiles.find(c => c.id === 'courier3');
  const courier4Profile = mockCourierProfiles.find(c => c.id === 'courier4');

  if (orderId === 'orderBid1') {
    const bids: CourierBid[] = [];
    if (courier1Profile) {
      bids.push({
        bidId: 'bid1-1', orderId, courierId: courier1Profile.id, courierName: courier1Profile.name,
        distanceToRestaurantKm: 0.5, bidAmount: 10, proposedEtaMinutes: 15,
        courierRating: courier1Profile.rating, courierTrustScore: courier1Profile.trustScore, vehicleType: courier1Profile.vehicleType,
        timestamp: new Date(now - 120000).toISOString(), isFastPickup: false, status: 'pending', courierProfileSnapshot: courier1Profile
      });
    }
    if (courier2Profile) {
      bids.push({
        bidId: 'bid1-2', orderId, courierId: courier2Profile.id, courierName: courier2Profile.name,
        distanceToRestaurantKm: 1.2, bidAmount: 12, proposedEtaMinutes: 18,
        courierRating: courier2Profile.rating, courierTrustScore: courier2Profile.trustScore, vehicleType: courier2Profile.vehicleType,
        timestamp: new Date(now - 60000).toISOString(), isFastPickup: false, status: 'pending', courierProfileSnapshot: courier2Profile
      });
    }
    if (courier4Profile) { // Swift Sarah (scooter)
      bids.push({
        bidId: 'bid1-3', orderId, courierId: courier4Profile.id, courierName: courier4Profile.name,
        distanceToRestaurantKm: 0.8, bidAmount: 9.5, proposedEtaMinutes: 12, // Faster ETA, slightly lower bid
        courierRating: courier4Profile.rating, courierTrustScore: courier4Profile.trustScore, vehicleType: courier4Profile.vehicleType,
        timestamp: new Date(now - 90000).toISOString(), isFastPickup: true, status: 'pending', courierProfileSnapshot: courier4Profile
      });
    }
     if (courier3Profile) { // Eco Ethan (bicycle) - might be slower but cheaper or greener
      bids.push({
        bidId: 'bid1-4', orderId, courierId: courier3Profile.id, courierName: courier3Profile.name,
        distanceToRestaurantKm: 1.0, bidAmount: 8.5, proposedEtaMinutes: 22, // Higher ETA, lowest bid
        courierRating: courier3Profile.rating, courierTrustScore: courier3Profile.trustScore, vehicleType: courier3Profile.vehicleType,
        timestamp: new Date(now - 30000).toISOString(), isFastPickup: false, status: 'pending', courierProfileSnapshot: courier3Profile
      });
    }
    return bids;
  }
  return [];
};

export const getMockOrderById = (orderId: string): Order | undefined => {
  if (orderId.startsWith('mockOrder_')) {
    const restaurant = mockRestaurants[0]; // Pizza Palace
    const items = [
        { ...restaurant.menu[0], quantity: 1 }, // Margherita
        { ...restaurant.menu.find(m => m.category === 'Drinks')!, quantity: 2 } // Coke
    ].map(item => ({
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
        dataAiHint: item.dataAiHint
    }));
    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const baseOrder: Order = {
      id: orderId,
      userId: 'userTest1',
      items,
      totalAmount,
      deliveryPreference: 'arena' as DeliveryPreference,
      deliveryFee: 0,
      discountAmount: 0,
      finalAmount: totalAmount,
      status: 'MATCHING_COURIER',
      deliveryAddress: '123 Delivery St, Foodtown, CA 90210',
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      orderTimeline: [
        { status: 'PENDING_PAYMENT', timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(), notes: "Payment processing initiated." },
        { status: 'MATCHING_COURIER', timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), notes: "Payment successful. Finding a courier." }
      ]
    };
    return baseOrder;
  }
  return undefined;
};
