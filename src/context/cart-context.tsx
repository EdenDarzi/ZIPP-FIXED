
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
  finalPriceWithDelivery: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const FASTEST_DELIVERY_FEE = 5.00; // Example fee

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [deliveryPreference, setDeliveryPreferenceState] = useState<DeliveryPreference>('arena');
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('swiftServeCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    const storedPreference = localStorage.getItem('swiftServeDeliveryPreference') as DeliveryPreference | null;
    if (storedPreference) {
      setDeliveryPreferenceState(storedPreference);
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('swiftServeCart')) {
      localStorage.setItem('swiftServeCart', JSON.stringify(cart));
    }
    localStorage.setItem('swiftServeDeliveryPreference', deliveryPreference);
  }, [cart, deliveryPreference]);

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
      title: "Item added to cart",
      description: `${item.name} has been added to your cart.`,
      variant: "default",
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.menuItemId !== itemId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
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
    localStorage.removeItem('swiftServeCart');
    // Optionally reset delivery preference or keep it
    // setDeliveryPreferenceState('arena'); 
    // localStorage.removeItem('swiftServeDeliveryPreference');
    toast({
      title: "Cart cleared",
      description: "Your cart has been emptied.",
    });
  };

  const setDeliveryPreference = (preference: DeliveryPreference) => {
    setDeliveryPreferenceState(preference);
  };
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = deliveryPreference === 'fastest' ? FASTEST_DELIVERY_FEE : 0;
  const finalPriceWithDelivery = totalPrice + deliveryFee;

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
      finalPriceWithDelivery
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
