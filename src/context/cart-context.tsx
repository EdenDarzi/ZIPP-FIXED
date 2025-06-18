
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
    const storedCart = localStorage.getItem('zippCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    const storedPreference = localStorage.getItem('zippDeliveryPreference') as DeliveryPreference | null;
    if (storedPreference) {
      setDeliveryPreferenceState(storedPreference);
    }
    const storedScheduledTime = localStorage.getItem('zippScheduledTime');
    if (storedScheduledTime) {
      setScheduledDeliveryTimeState(storedScheduledTime);
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('zippCart')) {
      localStorage.setItem('zippCart', JSON.stringify(cart));
    } else if (cart.length === 0) {
      localStorage.removeItem('zippCart');
    }
    localStorage.setItem('zippDeliveryPreference', deliveryPreference);
    if (scheduledDeliveryTime) {
      localStorage.setItem('zippScheduledTime', scheduledDeliveryTime);
    } else {
      localStorage.removeItem('zippScheduledTime');
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
    localStorage.removeItem('zippCart');
    localStorage.removeItem('zippScheduledTime');
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
  }

  // Smart coupon applies if not takeaway/curbside and not already smartSaver
  const smartCouponApplicable = totalPrice >= SMART_COUPON_THRESHOLD && 
                                deliveryPreference !== 'takeaway' && 
                                deliveryPreference !== 'curbside' && 
                                deliveryPreference !== 'smartSaver';

  if (smartCouponApplicable) {
    currentDiscount += totalPrice * SMART_COUPON_DISCOUNT_PERCENTAGE;
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
      finalPriceWithDelivery: Math.max(0, finalPriceWithDelivery), // Ensure final price is not negative
      smartCouponApplied: smartCouponApplicable,
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
