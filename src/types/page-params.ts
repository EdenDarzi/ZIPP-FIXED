// Types for page parameters in the Next.js app router

// Generic page props type to satisfy Next.js page requirements
export interface PageProps<T = any, U = any> {
  params: T;
  searchParams: U;
}

// Restaurant page parameters
export interface RestaurantPageParams extends PageProps {
  params: {
    restaurantId: string;
  };
}

// Restaurant item page parameters
export interface ItemPageParams extends PageProps<{
  restaurantId: string;
  itemId: string;
}> {}

// Order tracking page parameters
export interface OrderTrackingPageParams extends PageProps {
  params: {
    orderId: string;
  };
}

// Marketplace item page parameters
export interface MarketplaceItemParams {
  params: {
    itemId: string;
  };
}

export default {};
