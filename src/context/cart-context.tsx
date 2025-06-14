'use client';

import type { CartItem, MenuItem } from '@/types';
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
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const storedCart = localStorage.getItem('swiftServeCart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0 || localStorage.getItem('swiftServeCart')) {
      localStorage.setItem('swiftServeCart', JSON.stringify(cart));
    }
  }, [cart]);

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
    toast({
      title: "Cart cleared",
      description: "Your cart has been emptied.",
    });
  };
  
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice }}>
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
