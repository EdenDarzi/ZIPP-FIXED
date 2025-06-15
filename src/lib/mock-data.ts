
import type { Restaurant, MenuItem, OrderDetailsForBidding, CourierProfile, CourierBid, Order } from '@/types';

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
  },
  {
    id: 'courier2',
    name: 'Reliable Rita',
    rating: 4.6,
    trustScore: 95,
    vehicleType: 'car',
    areaCoverageRadiusKm: 7,
    currentLocation: { lat: 34.0550, lng: -118.2500 }, // Near Downtown LA
  },
  {
    id: 'courier3',
    name: 'Quick Quinn',
    rating: 4.3,
    trustScore: 85,
    vehicleType: 'bicycle',
    areaCoverageRadiusKm: 3,
    currentLocation: { lat: 34.0500, lng: -118.2400 }, // Close to restaurants
  },
];

export const mockOpenOrdersForBidding: OrderDetailsForBidding[] = [
  {
    orderId: 'orderBid1',
    restaurantName: 'Pizza Palace',
    restaurantLocation: { lat: 34.052235, lng: -118.243683 },
    deliveryAddress: '123 Customer Way, Anytown',
    deliveryLocation: { lat: 34.0600, lng: -118.2500 },
    estimatedDistanceKm: 2.5,
    baseCommission: 10,
    itemsDescription: '1 Margherita Pizza, 2 Cokes',
    expectedPickupTime: 'ASAP',
    requiredVehicleType: ['motorcycle', 'car', 'bicycle'],
  },
  {
    orderId: 'orderBid2',
    restaurantName: 'Burger Bonanza',
    restaurantLocation: { lat: 34.050000, lng: -118.240000 },
    deliveryAddress: '456 Client Ave, Anytown',
    deliveryLocation: { lat: 34.0450, lng: -118.2350 },
    estimatedDistanceKm: 1.2,
    baseCommission: 8,
    itemsDescription: '2 Classic Burgers, 1 Fries',
    expectedPickupTime: 'ASAP',
  },
];

export const getOrderForBiddingById = (orderId: string): OrderDetailsForBidding | undefined => {
  return mockOpenOrdersForBidding.find(order => order.orderId === orderId);
};

export const mockBidsForOrder: (orderId: string) => CourierBid[] = (orderId) => {
  if (orderId === 'orderBid1') {
    return [
      {
        bidId: 'bid1-1',
        orderId: 'orderBid1',
        courierId: 'courier1',
        courierName: 'Speedy Sam',
        distanceToRestaurantKm: 0.5,
        bidAmount: 10,
        proposedEtaMinutes: 15,
        courierRating: 4.8,
        courierTrustScore: 92,
        vehicleType: 'motorcycle',
        timestamp: new Date(Date.now() - 60000 * 2).toISOString(),
        isFastPickup: false,
        status: 'pending',
      },
      {
        bidId: 'bid1-2',
        orderId: 'orderBid1',
        courierId: 'courier2',
        courierName: 'Reliable Rita',
        distanceToRestaurantKm: 1.2,
        bidAmount: 12,
        proposedEtaMinutes: 18,
        courierRating: 4.6,
        courierTrustScore: 95,
        vehicleType: 'car',
        timestamp: new Date(Date.now() - 60000 * 1).toISOString(),
        isFastPickup: false,
        status: 'pending',
      },
    ];
  }
  return [];
};

// Mock an order for the order tracking page
export const getMockOrderById = (orderId: string): Order | undefined => {
  // Simulate finding an order. In a real app, this would fetch from a database.
  if (orderId === 'mockOrder123') {
    const baseOrder: Order = {
      id: 'mockOrder123',
      userId: 'userTest1',
      items: [
        { menuItemId: 'item1', name: 'Margherita Pizza', price: 12.99, quantity: 1, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: "pizza" },
        { menuItemId: 'item6', name: 'Coca-Cola', price: 2.50, quantity: 2, imageUrl: 'https://placehold.co/100x100.png', dataAiHint: "drink" },
      ],
      totalAmount: 12.99 + (2.50 * 2),
      deliveryPreference: 'arena', // Default or fetched from cart
      deliveryFee: 0, // Will be calculated or set based on preference
      finalAmount: 0, // Will be calculated
      status: 'MATCHING_COURIER', // Initial status for tracking page
      deliveryAddress: '123 Delivery St, Foodtown',
      restaurantId: 'restaurant1',
      restaurantName: 'Pizza Palace',
      createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
      updatedAt: new Date().toISOString(),
    };
    
    if (baseOrder.deliveryPreference === 'fastest') {
      baseOrder.deliveryFee = 5.00; // Example fee for fastest
    }
    baseOrder.finalAmount = baseOrder.totalAmount + baseOrder.deliveryFee;
    return baseOrder;
  }
  return undefined;
};
