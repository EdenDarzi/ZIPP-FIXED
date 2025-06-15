
'use client';

import type { CartItem, MenuItem, DeliveryPreference } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FASTEST_DELIVERY_FEE = 5.00;
const SMART_SAVER_DISCOUNT = 3.00;
const SMART_COUPON_THRESHOLD = 70.00;
const SMART_COUPON_DISCOUNT_PERCENTAGE = 0.05; // 5%

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

  const addToCart = (item: MenuItem, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.menuItemId === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.menuItemId === item.id
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        );
      }
      return [...prevCart, {
        menuItemId: item.id,
        name: item.name,
        price: item.price,
        quantity,
        imageUrl: item.imageUrl,
        dataAiHint: item.dataAiHint
      }];
    });
    toast({
      title: "פריט נוסף לעגלה",
      description: `${item.name} התווסף לסל שלך.`,
      variant: "default",
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItemId !== itemId));
    toast({
      title: "פריט הוסר",
      description: "הפריט הוסר מהסל שלך.",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.menuItemId === itemId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCart([]);
    setScheduledDeliveryTimeState(null); // Also clear scheduled time when cart is cleared
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
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  let deliveryFee = 0;
  let currentDiscount = 0;

  if (deliveryPreference === 'fastest') {
    deliveryFee = FASTEST_DELIVERY_FEE;
  } else if (deliveryPreference === 'smartSaver') {
    currentDiscount += SMART_SAVER_DISCOUNT;
  }

  const smartCouponApplied = totalPrice >= SMART_COUPON_THRESHOLD && deliveryPreference !== 'smartSaver';
  if (smartCouponApplied) {
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
      finalPriceWithDelivery,
      smartCouponApplied,
      scheduledDeliveryTime,
      setScheduledDeliveryTime,
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
