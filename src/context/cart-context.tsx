
'use client';

import type { CartItem, MenuItem, DeliveryPreference, SelectedAddon } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number, selectedAddons?: SelectedAddon[]) => void;
  removeFromCart: (cartEntryId: string) => void;
  updateQuantity: (cartEntryId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  deliveryPreference: DeliveryPreference;
  setDeliveryPreference: (preference: DeliveryPreference) => void;
  deliveryFee: number;
  discountAmount: number;
  finalPriceWithDelivery: number;
  smartCouponApplied: boolean;
  scheduledDeliveryTime: string | null;
  setScheduledDeliveryTime: (time: string | null) => void;
  getItemPriceWithAddons: (cartItem: CartItem) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FASTEST_DELIVERY_FEE = 5.00;
const SMART_SAVER_DISCOUNT = 3.00;
const SMART_COUPON_THRESHOLD = 70.00;
const SMART_COUPON_DISCOUNT_PERCENTAGE = 0.05; // 5%

// Helper to generate a simple unique ID for cart items
const generateCartEntryId = () => `cartEntry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// Helper to compare selected addons arrays
const compareSelectedAddons = (addons1?: SelectedAddon[], addons2?: SelectedAddon[]): boolean => {
  if (!addons1 && !addons2) return true;
  if (!addons1 || !addons2 || addons1.length !== addons2.length) return false;

  const sortedAddons1 = [...addons1].sort((a, b) => a.optionId.localeCompare(b.optionId));
  const sortedAddons2 = [...addons2].sort((a, b) => a.optionId.localeCompare(b.optionId));

  for (let i = 0; i < sortedAddons1.length; i++) {
    if (
      sortedAddons1[i].groupId !== sortedAddons2[i].groupId ||
      sortedAddons1[i].optionId !== sortedAddons2[i].optionId
    ) {
      return false;
    }
  }
  return true;
};


export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryPreference, setDeliveryPreferenceState] = useState<DeliveryPreference>('arena');
  const [scheduledDeliveryTime, setScheduledDeliveryTimeState] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('livePickCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    const storedPreference = localStorage.getItem('livePickDeliveryPreference') as DeliveryPreference | null;
    if (storedPreference) {
      setDeliveryPreferenceState(storedPreference);
    }
    const storedScheduledTime = localStorage.getItem('livePickScheduledTime');
    if (storedScheduledTime) {
      setScheduledDeliveryTimeState(storedScheduledTime);
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('livePickCart')) {
      localStorage.setItem('livePickCart', JSON.stringify(cart));
    } else if (cart.length === 0) {
      localStorage.removeItem('livePickCart');
    }
    localStorage.setItem('livePickDeliveryPreference', deliveryPreference);
    if (scheduledDeliveryTime) {
      localStorage.setItem('livePickScheduledTime', scheduledDeliveryTime);
    } else {
      localStorage.removeItem('livePickScheduledTime');
    }
  }, [cart, deliveryPreference, scheduledDeliveryTime]);

  const getItemPriceWithAddons = (cartItem: CartItem): number => {
    const addonsPrice = cartItem.selectedAddons?.reduce((sum, addon) => sum + addon.optionPrice, 0) || 0;
    return cartItem.price + addonsPrice;
  };


  const addToCart = (item: MenuItem, quantity: number = 1, selectedAddons?: SelectedAddon[]) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        cartItem => cartItem.menuItemId === item.id && compareSelectedAddons(cartItem.selectedAddons, selectedAddons)
      );

      if (existingItemIndex > -1) {
        // Item with the same addons configuration exists, update quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + quantity,
        };
        return updatedCart;
      } else {
        // New item or item with different addons configuration
        const newCartItem: CartItem = {
          id: generateCartEntryId(),
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity,
          imageUrl: item.imageUrl,
          dataAiHint: item.dataAiHint,
          selectedAddons: selectedAddons || [],
          restaurantId: item.restaurantId, 
        };
        return [...prevCart, newCartItem];
      }
    });
    toast({
      title: "פריט נוסף לעגלה",
      description: `${item.name} התווסף לסל שלך.`,
      variant: "default",
    });
  };

  const removeFromCart = (cartEntryId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== cartEntryId));
    toast({
      title: "פריט הוסר",
      description: "הפריט הוסר מהסל שלך.",
    });
  };

  const updateQuantity = (cartEntryId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartEntryId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === cartEntryId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setScheduledDeliveryTimeState(null); 
    localStorage.removeItem('livePickCart');
    localStorage.removeItem('livePickScheduledTime');
    toast({
      title: "הסל נוקה",
      description: "הסל שלך רוקן.",
    });
  };

  const setDeliveryPreference = (preference: DeliveryPreference) => {
    setDeliveryPreferenceState(preference);
  };

  const setScheduledDeliveryTime = (time: string | null) => {
    setScheduledDeliveryTimeState(time);
     if (time) {
      toast({ title: "משלוח תוכנן", description: `המשלוח שלך תוכנן ל: ${time}` });
    } else {
      toast({ title: "תכנון משלוח בוטל" });
    }
  };

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = cart.reduce((sum, item) => {
    const itemTotalAddonsPrice = item.selectedAddons?.reduce((addonSum, addon) => addonSum + addon.optionPrice, 0) || 0;
    return sum + (item.price + itemTotalAddonsPrice) * item.quantity;
  }, 0);


  let deliveryFee = 0;
  let currentDiscount = 0;

  if (deliveryPreference === 'fastest') {
    deliveryFee = FASTEST_DELIVERY_FEE;
  } else if (deliveryPreference === 'smartSaver') {
    currentDiscount += SMART_SAVER_DISCOUNT;
  } else if (deliveryPreference === 'takeaway' || deliveryPreference === 'curbside') {
    deliveryFee = 0; 
    // Smart coupon should not apply if it's a pickup method
    const isSmartCouponDeliveryApplicable = totalPrice >= SMART_COUPON_THRESHOLD && (deliveryPreference !== 'takeaway' && deliveryPreference !== 'curbside' && deliveryPreference !== 'smartSaver');
    if (isSmartCouponDeliveryApplicable) {
        currentDiscount += totalPrice * SMART_COUPON_DISCOUNT_PERCENTAGE;
    }
  }


  const smartCouponApplied = totalPrice >= SMART_COUPON_THRESHOLD && deliveryPreference !== 'smartSaver' && deliveryPreference !== 'takeaway' && deliveryPreference !== 'curbside';
  if (smartCouponApplied && deliveryPreference !== 'takeaway' && deliveryPreference !== 'curbside') { // ensure smart coupon is not applied if already handled or is pickup
    currentDiscount += totalPrice * SMART_COUPON_DISCOUNT_PERCENTAGE;
  }
  // Ensure discount is not double-counted if smartSaver and smartCoupon threshold met
  if (deliveryPreference === 'smartSaver' && totalPrice >= SMART_COUPON_THRESHOLD) {
      currentDiscount = SMART_SAVER_DISCOUNT; // Prioritize smart saver, or define combined logic
  }


  const finalPriceWithDelivery = totalPrice + deliveryFee - currentDiscount;

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice,
      deliveryPreference,
      setDeliveryPreference,
      deliveryFee,
      discountAmount: currentDiscount,
      finalPriceWithDelivery,
      smartCouponApplied,
      scheduledDeliveryTime,
      setScheduledDeliveryTime,
      getItemPriceWithAddons,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
