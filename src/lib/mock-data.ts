import type { Restaurant, MenuItem } from '@/types';

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
