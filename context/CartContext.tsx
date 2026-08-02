import React, { createContext, useContext, useState } from 'react';

interface CartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (name: string, quantity: number) => void;
  removeItem: (name: string) => void;
  clearCart: () => void; // <-- Add clearCart
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.name === newItem.name);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prevItems, newItem];
    });
  };

  const updateQuantity = (name: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => (item.name === name ? { ...item, quantity } : item))
    );
  };

  const removeItem = (name: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.name !== name));
  };

  const clearCart = () => {
    setCartItems([]); // <-- Clears out all items
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}