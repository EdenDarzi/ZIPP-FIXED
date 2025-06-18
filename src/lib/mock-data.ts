
import type { Restaurant, MenuItem, OrderDetailsForBidding, CourierProfile, CourierBid, Order, DeliveryPreference, RestaurantTag, Location, DeliveryVehicle, LivePickSaleItem, SecondHandItem, SecondHandItemCategory, RestaurantSettings, OperatingHour, DayOfWeek } from '@/types';

const mockMenuItems: Omit<MenuItem, 'restaurantId'>[] = [
  {
    id: 'item1',
    name: 'Margherita Pizza',
    description: 'Classic delight with 100% real mozzarella cheese',
    price: 12.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pizza margherita',
    category: 'Pizza',
    isAvailable: true,
    addons: [
      { id: 'addon-group-pizza-size', title: 'בחר גודל', type: 'radio', required: true, options: [ {id: 's1', name: 'רגיל', price: 0, selectedByDefault: true}, {id: 's2', name: 'גדול', price: 5} ]},
      { id: 'addon-group-pizza-toppings', title: 'תוספות (עד 3)', type: 'checkbox', minSelection: 0, maxSelection: 3, options: [ {id: 't1', name: 'זיתים', price: 2}, {id: 't2', name: 'פטריות', price: 2.5}, {id: 't3', name: 'בצל', price: 1.5}, {id: 't4', name: 'פפרוני', price: 3} ]}
    ]
  },
  {
    id: 'item2',
    name: 'Pepperoni Pizza',
    description: 'A classic favorite with rich, savory pepperoni.',
    price: 14.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pizza pepperoni',
    category: 'Pizza',
    isAvailable: true,
  },
  {
    id: 'item3',
    name: 'Classic Burger',
    description: 'Juicy beef patty with lettuce, tomato, and our special sauce.',
    price: 9.99,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'burger classic',
    category: 'Burgers',
    isAvailable: false,
    addons: [
        { id: 'addon-group-burger-cheese', title: 'תוספת גבינה', type: 'radio', options: [ {id: 'c0', name: 'ללא גבינה', price: 0, selectedByDefault: true}, {id: 'c1', name: 'צ׳דר', price: 3}, {id: 'c2', name: 'אמנטל', price: 3.5} ]},
        { id: 'addon-group-burger-extras', title: 'תוספות נוספות (חובה לבחור 1-2)', type: 'checkbox', required: true, minSelection: 1, maxSelection: 2, options: [ {id: 'e1', name: 'בצל מטוגן', price: 2}, {id: 'e2', name: 'פטריות מוקפצות', price: 2.5}, {id: 'e3', name: 'ביצת עין', price: 4} ]}
    ]
  },
  {
    id: 'item4',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, Parmesan cheese, croutons, and Caesar dressing.',
    price: 8.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'salad caesar',
    category: 'Salads',
    isAvailable: true,
  },
  {
    id: 'item5',
    name: 'Spaghetti Carbonara',
    description: 'Creamy pasta with pancetta, egg, and Parmesan cheese.',
    price: 13.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'pasta carbonara',
    category: 'Pasta',
    isAvailable: true,
  },
  {
    id: 'item6',
    name: 'Coca-Cola',
    description: 'Classic Coca-Cola',
    price: 2.50,
    imageUrl: 'https://placehold.co/600x400.png',
    dataAiHint: 'soda drink',
    category: 'Drinks',
    isAvailable: true,
  },
];

export const mockRestaurants: Restaurant[] = [
  {
    id: 'restaurant1',
    name: 'פיצה פאלאס', 
    description: 'פיצות איטלקיות אותנטיות שנאפות לשלמות עם המרכיבים הטריים ביותר.', 
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'pizza italian',
    location: 'רחוב ראשי 123, אבן יהודה', 
    cuisineType: 'איטלקי', 
    rating: 4.5,
    deliveryTimeEstimate: '25-35 דקות', 
    menu: mockMenuItems.filter(item => item.category === 'Pizza' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant1' })),
    hasDeliveryArena: true,
    tags: ['Popular', 'Fast Delivery', 'Delivery Arena'],
     livePickSaleConfig: { 
        enabled: true,
        startTime: "19:00",
        bagCount: 10,
        bagPrice: 20
    },
    supportsTakeaway: true,
    supportsCurbsidePickup: true,
  },
  {
    id: 'restaurant2',
    name: 'בורגר בוננזה', 
    description: 'ההמבורגרים הטובים בעיר, צלויים בדיוק כמו שצריך. טעמו את ההבדל!', 
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'burger american',
    location: 'שדרות האלון 456, אבן יהודה', 
    cuisineType: 'אמריקאי', 
    rating: 4.2,
    deliveryTimeEstimate: '20-30 דקות', 
    menu: mockMenuItems.filter(item => item.category === 'Burgers' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant2' })),
    hasDeliveryArena: false,
    tags: ['Recommended', 'Hot Now'],
    supportsTakeaway: true,
    supportsCurbsidePickup: false,
  },
  {
    id: 'restaurant3',
    name: 'פסטה פרפקשן', 
    description: 'מנות פסטה טעימות שנעשו באהבה ומתכונים מסורתיים.', 
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'pasta authentic',
    location: 'סמטת האורן 789, אבן יהודה', 
    cuisineType: 'איטלקי', 
    rating: 4.8,
    deliveryTimeEstimate: '30-40 דקות', 
    menu: mockMenuItems.filter(item => item.category === 'Pasta' || item.category === 'Salads' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant3' })),
    hasDeliveryArena: true,
    tags: ['New', 'Recommended', 'Delivery Arena'],
    supportsTakeaway: false,
    supportsCurbsidePickup: false,
  },
  {
    id: 'restaurant4',
    name: 'סלט סנסיישנס', 
    description: 'סלטים טריים ובריאים לארוחה טעימה וללא רגשות אשם.', 
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'salad healthy',
    location: 'דרך המייפל 101, אבן יהודה', 
    cuisineType: 'בריא', 
    rating: 4.0,
    deliveryTimeEstimate: '15-25 דקות', 
    menu: mockMenuItems.filter(item => item.category === 'Salads' || item.category === 'Drinks').map(item => ({ ...item, restaurantId: 'restaurant4' })),
    hasDeliveryArena: true,
    tags: ['Fast Delivery', 'Delivery Arena'],
    supportsTakeaway: true,
    supportsCurbsidePickup: true,
  },
  {
    id: 'florist1',
    name: 'פרחי העונה',
    description: 'זרים טריים וסידורי פרחים מרהיבים לכל אירוע.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'flowers bouquets',
    location: 'שדרות הפרחים 5, עיר הגנים',
    cuisineType: 'חנות פרחים',
    rating: 4.9,
    deliveryTimeEstimate: 'שעה - שעתיים',
    menu: [
        { id: 'flower1', name: 'זר ורדים אדומים קלאסי', description: '12 ורדים אדומים טריים באריזת מתנה.', price: 120.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'red roses', category: 'זרים', restaurantId: 'florist1', isAvailable: true },
        { id: 'flower2', name: 'סידור סחלבים לבנים', description: 'סחלב לבן מרשים בכלי דקורטיבי.', price: 180.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'white orchid', category: 'עציצים', restaurantId: 'florist1', isAvailable: true },
    ],
    hasDeliveryArena: true,
    tags: ['Recommended', 'New'],
    supportsTakeaway: true,
    supportsCurbsidePickup: false,
  },
   {
    id: 'bakery1',
    name: 'מאפיית הבוקר',
    description: 'לחמים טריים, מאפים מתוקים ומלוחים, ועוגות מיוחדות.',
    imageUrl: 'https://placehold.co/800x600.png',
    dataAiHint: 'bakery bread',
    location: 'רחוב הקונדיטוריה 10, קרית מאפה',
    cuisineType: 'מאפייה',
    rating: 4.7,
    deliveryTimeEstimate: '30-45 דקות',
    menu: [
        { id: 'bake1', name: 'קרואסון חמאה', description: 'קרואסון צרפתי קלאסי, פריך ועשיר בחמאה.', price: 12.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'croissant pastry', category: 'מאפים', restaurantId: 'bakery1', isAvailable: true },
        { id: 'bake2', name: 'עוגת גבינה פירורים', description: 'עוגת גבינה קרה עם בסיס פריך וציפוי פירורים.', price: 85.00, imageUrl: 'https://placehold.co/600x400.png', dataAiHint: 'cheesecake cake', category: 'עוגות', restaurantId: 'bakery1', isAvailable: true },
    ],
    hasDeliveryArena: true,
    tags: ['Popular', 'Fast Delivery'],
    supportsTakeaway: true,
    supportsCurbsidePickup: true,
  }
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
    id: 'courier1', name: 'סמי המהיר', rating: 4.8, trustScore: 92, vehicleType: 'motorcycle', areaCoverageRadiusKm: 5, currentLocation: { lat: 34.0522, lng: -118.2437 }, currentSpeedKmh: 35, batteryPercent: undefined, isActive: true, transportationModeDetails: "Yamaha NMAX 155", currentDeliveriesCount: 1, totalDeliveriesToday: 5
  },
  {
    id: 'courier2', name: 'ריטה האמינה', rating: 4.6, trustScore: 95, vehicleType: 'car', areaCoverageRadiusKm: 7, currentLocation: { lat: 34.0550, lng: -118.2500 }, currentSpeedKmh: 45, batteryPercent: undefined, isActive: true, transportationModeDetails: "Toyota Prius", currentDeliveriesCount: 0, totalDeliveriesToday: 3
  },
  {
    id: 'courier3', name: 'איתן האקולוגי', rating: 4.3, trustScore: 85, vehicleType: 'bicycle',  areaCoverageRadiusKm: 3, currentLocation: { lat: 34.0500, lng: -118.2400 }, currentSpeedKmh: 15, batteryPercent: 75, isActive: true, transportationModeDetails: "Specialized Turbo Vado (e-bike)", currentDeliveriesCount: 2, totalDeliveriesToday: 8
  },
  {
    id: 'courier4', name: 'שרה המהירה', rating: 4.9, trustScore: 90, vehicleType: 'scooter', areaCoverageRadiusKm: 4, currentLocation: { lat: 34.0480, lng: -118.2450 }, currentSpeedKmh: 22, batteryPercent: 88, isActive: true, transportationModeDetails: "Xiaomi Mi Electric Scooter Pro 2", currentDeliveriesCount: 0, totalDeliveriesToday: 2
  },
   {
    id: 'courier5', name: 'וולי ההולך', rating: 4.1, trustScore: 80, vehicleType: 'foot', areaCoverageRadiusKm: 1.5, currentLocation: { lat: 34.0510, lng: -118.2420 }, isActive: true, transportationModeDetails: "נעלי ספורט נוחות", currentDeliveriesCount: 1, totalDeliveriesToday: 4
  }
];

export const mockOpenOrdersForBidding: OrderDetailsForBidding[] = [
  {
    orderId: 'orderBid1', restaurantName: 'פיצה פאלאס', restaurantLocation: { lat: 34.052235, lng: -118.243683 }, deliveryAddress: 'דרך הלקוח 123, אבן יהודה', deliveryLocation: { lat: 34.0600, lng: -118.2500 }, estimatedDistanceKm: 2.5, estimatedRouteDistanceKm: 3.1, baseCommission: 10.00, itemsDescription: '1 פיצה מרגריטה, 2 קולה', expectedPickupTime: 'מיידי (~10 דק\' הכנה)', requiredVehicleType: ['motorcycle', 'car', 'scooter', 'bicycle'], orderValue: 17.99, customerNotes: "נא לצלצל בפעמון פעמיים."
  },
  {
    orderId: 'orderBid2', restaurantName: 'בורגר בוננזה', restaurantLocation: { lat: 34.050000, lng: -118.240000 }, deliveryAddress: 'שדרות הלקוח 456, אבן יהודה', deliveryLocation: { lat: 34.0450, lng: -118.2350 }, estimatedDistanceKm: 1.2, estimatedRouteDistanceKm: 1.5, baseCommission: 8.50, itemsDescription: '2 המבורגרים קלאסיים, 1 צ\'יפס', expectedPickupTime: 'מיידי (~8 דק\' הכנה)', orderValue: 22.48, customerNotes: "להשאיר במרפסת הקדמית אם אין מענה."
  },
  {
    orderId: 'orderBid3', restaurantName: 'פסטה פרפקשן', restaurantLocation: { lat: 34.0580, lng: -118.2490 }, deliveryAddress: 'רחוב הגורמה 789, אבן יהודה', deliveryLocation: { lat: 34.0550, lng: -118.2550 }, estimatedDistanceKm: 0.8, estimatedRouteDistanceKm: 1.0, baseCommission: 7.00, itemsDescription: '1 ספגטי קרבונרה', expectedPickupTime: 'מוכן בעוד 15 דקות', requiredVehicleType: ['bicycle', 'foot', 'scooter'], orderValue: 13.50,
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
    if (orderDetails.requiredVehicleType && orderDetails.requiredVehicleType.length > 0 && !orderDetails.requiredVehicleType.includes(courier.vehicleType)) { return; }
    const bidAmountVariance = (Math.random() - 0.3) * 2;
    const bidAmount = parseFloat((orderDetails.baseCommission + bidAmountVariance).toFixed(2));
    const etaVariance = Math.floor(Math.random() * 10) - 3;
    const baseEta = (orderDetails.estimatedRouteDistanceKm || orderDetails.estimatedDistanceKm) * (courier.vehicleType === 'bicycle' ? 7 : courier.vehicleType === 'foot' ? 12 : 4);
    const proposedEtaMinutes = Math.max(5, Math.round(baseEta + etaVariance + (Math.random() * 3 + 0.5)*3));

    bids.push({
      bidId: `bid-${orderId}-${courier.id}-${index}`, orderId, courierId: courier.id, courierName: courier.name, distanceToRestaurantKm: parseFloat((Math.random() * 3 + 0.2).toFixed(1)), bidAmount: Math.max(5.00, bidAmount), proposedEtaMinutes, courierRating: courier.rating, courierTrustScore: courier.trustScore, vehicleType: courier.vehicleType, timestamp: new Date(now - (index + 1) * 30000).toISOString(), isFastPickup: Math.random() > 0.6, status: 'pending', courierProfileSnapshot: { ...courier }
    });
  });
  return bids;
};

export const getMockOrderById = (orderId: string, scheduledDeliveryTime?: string): Order | undefined => {
  const baseOrderId = orderId.split('_scheduled_')[0];
  if (baseOrderId.startsWith('mockOrder_')) {
    const restaurant = mockRestaurants[0]; // Default to first restaurant for simplicity
    const items: CartItem[] = [ 
        { 
            id: `cartItem_${restaurant.menu[0].id}_${Date.now()}`, 
            menuItemId: restaurant.menu[0].id, 
            name: restaurant.menu[0].name, 
            price: restaurant.menu[0].price, 
            quantity: 1, 
            imageUrl: restaurant.menu[0].imageUrl, 
            dataAiHint: restaurant.menu[0].dataAiHint, 
            selectedAddons: restaurant.menu[0].addons?.[0].options.filter(o => o.selectedByDefault).map(o => ({groupId: restaurant.menu[0].addons![0].id!, groupTitle: restaurant.menu[0].addons![0].title, optionId: o.id!, optionName: o.name, optionPrice: o.price })) || [],
            restaurantId: restaurant.id,
        }, 
        { 
            id: `cartItem_drink_${Date.now()}`,
            menuItemId: mockMenuItems.find(m => m.category === 'Drinks')!.id, 
            name: mockMenuItems.find(m => m.category === 'Drinks')!.name, 
            price: mockMenuItems.find(m => m.category === 'Drinks')!.price, 
            quantity: 2, 
            imageUrl: mockMenuItems.find(m => m.category === 'Drinks')!.imageUrl, 
            dataAiHint: mockMenuItems.find(m => m.category === 'Drinks')!.dataAiHint, 
            selectedAddons: [],
            restaurantId: restaurant.id,
        }
    ];
    
    let totalAmount = 0;
    items.forEach(item => {
        let itemPrice = item.price;
        item.selectedAddons?.forEach(addon => {
            itemPrice += addon.optionPrice;
        });
        totalAmount += itemPrice * item.quantity;
    });

    const initialStatus = scheduledDeliveryTime ? 'SCHEDULED' : 'MATCHING_COURIER';
    const initialTimelineNote = scheduledDeliveryTime ? `ההזמנה תוכננה ל: ${scheduledDeliveryTime}.` : "התשלום התקבל. מחפש שליח.";

    const baseOrder: Order = {
      id: orderId, userId: 'userTest1', items, totalAmount, deliveryPreference: 'arena' as DeliveryPreference, deliveryFee: 0, discountAmount: 0, finalAmount: totalAmount, status: initialStatus, deliveryAddress: 'רחוב המשלוחים 123, עיר האוכל, 90210', restaurantId: restaurant.id, restaurantName: restaurant.name, createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), updatedAt: new Date().toISOString(), scheduledDeliveryTime: scheduledDeliveryTime, scheduledDeliveryTimestamp: scheduledDeliveryTime ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : undefined, orderTimeline: [ { status: 'PENDING_PAYMENT', timestamp: new Date(Date.now() - 6 * 60 * 1000).toISOString(), notes: "מעבד תשלום..." }, { status: initialStatus, timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), notes: initialTimelineNote } ]
    };
    return baseOrder;
  }
  return undefined;
};

export const mockLiveOrdersForAdmin: Order[] = [
  {
    id: 'adminOrder1', userId: 'userABC', items: [{ id: 'cartItem1', menuItemId: 'item1', name: 'מוצר אקספרס', price: 12.99, quantity: 1, selectedAddons: [] }], totalAmount: 12.99, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 12.99, status: 'PREPARING_AT_RESTAURANT', deliveryAddress: 'רחוב ראשי 123', restaurantId: 'business1', restaurantName: 'העסק שלי', createdAt: new Date(Date.now() - 5 * 60000).toISOString(), updatedAt: new Date().toISOString(), estimatedDeliveryTime: '15-20 דקות', orderTimeline: [{ status: 'PREPARING_AT_RESTAURANT', timestamp: new Date().toISOString(), notes: "ההזמנה התקבלה במערכת."}]
  },
  {
    id: 'adminOrder2', userId: 'userDEF', items: [{ id: 'cartItem2', menuItemId: 'item3', name: 'שירות פרימיום', price: 9.99, quantity: 2, selectedAddons: [] }, { id: 'cartItem3', menuItemId: 'item6', name: 'מוצר נלווה', price: 2.50, quantity: 2, selectedAddons: [] }], totalAmount: 24.98, deliveryPreference: 'fastest', deliveryFee: 5, discountAmount: 0, finalAmount: 29.98, status: 'AWAITING_PICKUP', deliveryAddress: 'שדרות העצמאות 456', restaurantId: 'business1', restaurantName: 'העסק שלי', createdAt: new Date(Date.now() - 15 * 60000).toISOString(), updatedAt: new Date().toISOString(), estimatedDeliveryTime: '5-10 דקות לאיסוף', assignedCourier: { id: 'courier1', name: 'שליח זריז', rating: 4.8, vehicleType: 'motorcycle', currentEtaMinutes: 7 }, orderTimeline: [ { status: 'PREPARING_AT_RESTAURANT', timestamp: new Date(Date.now() - 10 * 60000).toISOString()}, { status: 'AWAITING_PICKUP', timestamp: new Date().toISOString(), notes: "המוצר מוכן. השליח עודכן."} ]
  },
  {
    id: 'adminOrderScheduled1', userId: 'userGHI', items: [{ id: 'cartItem4', menuItemId: 'item4', name: 'סלט בריאות', price: 10.50, quantity: 1, selectedAddons: [] }], totalAmount: 10.50, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 10.50, status: 'SCHEDULED', deliveryAddress: 'דרך העתיד 1', restaurantId: 'business1', restaurantName: 'העסק שלי', createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), updatedAt: new Date().toISOString(), scheduledDeliveryTime: 'מחר, 12:00-12:30', scheduledDeliveryTimestamp: new Date(Date.now() + 22 * 60 * 60000).toISOString(), orderTimeline: [{ status: 'SCHEDULED', timestamp: new Date().toISOString(), notes: "הזמנה מתוכננת התקבלה."}]
  },
];

export const mockOrderHistoryForAdmin: Order[] = [
 {
    id: 'adminOrderHist1', userId: 'userXYZ', items: [{ id: 'cartItem5', menuItemId: 'item2', name: 'מוצר פופולרי', price: 14.99, quantity: 1, selectedAddons: [] }], totalAmount: 14.99, deliveryPreference: 'arena', deliveryFee: 0, discountAmount: 0, finalAmount: 14.99, status: 'DELIVERED', deliveryAddress: 'סמטת האורנים 789', restaurantId: 'business1', restaurantName: 'העסק שלי', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(), updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(), actualDeliveryTime: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString(), orderTimeline: [{ status: 'DELIVERED', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60000 + 30 * 60000).toISOString()}]
  },
   {
    id: 'adminOrderScheduledDelivered', userId: 'userJKL', items: [{ id: 'cartItem6', menuItemId: 'item5', name: 'פסטה מפנקת', price: 18.00, quantity: 1, selectedAddons: [] }], totalAmount: 18.00, deliveryPreference: 'smartSaver', deliveryFee: 0, discountAmount: 3.00, finalAmount: 15.00, status: 'DELIVERED', deliveryAddress: 'כיכר החלומות 2', restaurantId: 'business1', restaurantName: 'העסק שלי', createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60000 + 45 * 60000).toISOString(), scheduledDeliveryTime: 'לפני יומיים, 19:00-19:30', scheduledDeliveryTimestamp: new Date(Date.now() - 3 * 24 * 60 * 60000 + 40 * 60000).toISOString(), actualDeliveryTime: new Date(Date.now() - 3 * 24 * 60 * 60000 + 45 * 60000).toISOString(), orderTimeline: [{ status: 'DELIVERED', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60000 + 45 * 60000).toISOString()}]
  },
];


export const mockLivePickSaleItems: LivePickSaleItem[] = [
    {
        id: 'livepick-sale-item1',
        restaurantId: 'bakery1',
        restaurantName: 'מאפיית הבוקר',
        name: 'שקית מאפים מסוף יום',
        description: 'מבחר מאפים טריים שנשארו מסוף היום - קרואסונים, בורקסים ועוד הפתעות!',
        price: 15.00,
        originalPrice: 45.00,
        quantityAvailable: 5,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'bakery surprise pastries',
        isActive: true,
    },
    {
        id: 'livepick-sale-item2',
        restaurantId: 'restaurant4',
        restaurantName: 'סלט סנסיישנס',
        name: 'שקית סלטים טריים',
        description: 'סלטים טריים שהוכנו היום ולא נמכרו. הזדמנות לבריאות במחיר מנצח!',
        price: 12.00,
        originalPrice: 38.00,
        quantityAvailable: 3,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'fresh salads healthy',
        isActive: true,
    },
    {
        id: 'livepick-sale-item3',
        restaurantId: 'florist1',
        restaurantName: 'פרחי העונה',
        name: 'זר הפתעה מסוף שבוע',
        description: 'פרחים יפים שאולי לא נמכרו במהלך סוף השבוע, אבל עדיין יכולים להאיר למישהו את היום!',
        price: 25.00,
        originalPrice: 70.00,
        quantityAvailable: 2,
        imageUrl: 'https://placehold.co/600x400.png',
        dataAiHint: 'flowers surprise bouquet',
        isActive: true,
    }
];

export const getLivePickSaleItemById = (id: string): LivePickSaleItem | undefined => {
    return mockLivePickSaleItems.find(item => item.id === id);
};

export const mockSecondHandItems: SecondHandItem[] = [
  {
    id: 'sh1',
    userId: 'userJaneDoe',
    sellerName: 'ג׳יין דואו',
    title: 'iPhone 12 - שמור כמו חדש, 128GB',
    category: 'טלפונים',
    price: 900,
    description: 'אייפון 12 במצב מעולה, ללא שריטות. מגיע עם קופסה מקורית וכבל טעינה. סוללה 88%.',
    images: [
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'iphone used' },
      { url: 'https://placehold.co/600x400.png', dataAiHint: 'iphone back' },
    ],
    location: 'אשדוד',
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), 
    isSold: false,
    sellerRating: 4.8,
    contactMethod: 'whatsapp',
    contactDetails: '+972501234567'
  },
  {
    id: 'sh2',
    userId: 'userJohnSmith',
    sellerName: 'יוחנן סמית',
    title: 'אוזניות Sony WH-1000XM4 במצב חדש',
    category: 'אוזניות',
    price: 650,
    description: 'אוזניות סוני מעולות עם ביטול רעשים אקטיבי. שימוש מועט מאוד, נמכרות עקב שדרוג.',
    images: [{ url: 'https://placehold.co/600x400.png', dataAiHint: 'sony headphones' }],
    location: 'תל אביב',
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), 
    isSold: false,
    sellerRating: 4.9,
    contactMethod: 'app-chat'
  },
  {
    id: 'sh3',
    userId: 'userSarahL',
    sellerName: 'שרה לוי',
    title: 'שמלת קיץ פרחונית - מידה M',
    category: 'בגדים',
    price: 80,
    description: 'שמלת קיץ קלילה ונוחה, נלבשה פעם אחת בלבד. מצב כמו חדש. בד נעים ונושם.',
    images: [{ url: 'https://placehold.co/600x400.png', dataAiHint: 'summer dress' }],
    location: 'חיפה',
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), 
    isSold: true,
    sellerRating: 4.5
  },
    {
    id: 'sh4',
    userId: 'userMikeB',
    sellerName: 'מייק בראון',
    title: 'מחשב נייד Dell XPS 13 (2020)',
    category: 'מחשבים',
    price: 2200,
    description: 'דל XPS 13, מעבד i7 דור 10, 16GB RAM, 512GB SSD. מצב מצוין, סוללה טובה. שימש בעיקר ללימודים.',
    images: [{ url: 'https://placehold.co/600x400.png', dataAiHint: 'dell laptop' }],
    location: 'ירושלים',
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), 
    isSold: false,
    sellerRating: 5.0,
    contactMethod: 'phone',
    contactDetails: '054-9876543'
  },
];

export const getSecondHandItems = (): SecondHandItem[] => {
  return mockSecondHandItems.filter(item => !item.isSold); 
};

export const getSecondHandItemById = (id: string): SecondHandItem | undefined => {
  return mockSecondHandItems.find(item => item.id === id);
};

export const secondHandCategories: SecondHandItemCategory[] = ['טלפונים', 'מחשבים', 'בגדים', 'אוזניות', 'אחר'];

const daysOfWeek: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const mockExistingSettings: RestaurantSettings = {
  id: 'restaurant1', 
  businessName: 'פיצה פאלאס',
  logoUrl: 'https://placehold.co/200x100.png?text=Pizza+Palace+Logo',
  coverImageUrl: 'https://placehold.co/1200x300.png?text=Pizza+Palace+Cover',
  category: 'איטלקי',
  address: 'רחוב ראשי 123, אבן יהודה',
  operatingHours: daysOfWeek.map(day => ({
    day,
    openTime: (day === 'Friday' || day === 'Saturday') ? '12:00' : '10:00',
    closeTime: (day === 'Friday' || day === 'Saturday') ? '23:00' : '22:00',
    isClosed: day === 'Saturday', 
  })),
  isOpenNow: true,
  specialsStatus: 'מבצע: 2 מגשים משפחתיים ב-100₪!',
  primaryColor: '#E53935', 
  accentColor: '#FFB300', 
  dishDisplayStlye: 'grid',
  storeFont: 'sans',
  bannerLayout: 'textOverImage',
  showRatingsOnStore: true,
  showDeliveryTimeOnStore: true,
  supportsTakeaway: true,
  supportsCurbsidePickup: false,
};

