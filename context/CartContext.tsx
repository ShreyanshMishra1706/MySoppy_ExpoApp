import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define the structure of an individual cart item
interface CartItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// Define the context API interface for all available cart actions
interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (name: string, quantity: number) => void;
  removeItem: (name: string) => void;
  clearCart: () => void;
}

// Create the Cart Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Unique storage key used for saving items locally via AsyncStorage
const CART_STORAGE_KEY = '@myshoppy_cart_items';

export function CartProvider({ children }: { children: React.ReactNode }) {
  // State to hold the list of items currently in the cart
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load stored cart from local storage when the provider mounts
  useEffect(() => {
    loadStoredCart();
  }, []);

  // Asynchronously fetch saved cart items from AsyncStorage
  const loadStoredCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from storage', error);
    }
  };

  // Helper function to persist updated cart items to AsyncStorage
  const saveCartToStorage = async (updatedItems: CartItem[]) => {
    try {
      await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updatedItems));
    } catch (error) {
      console.error('Failed to save cart to storage', error);
    }
  };

  // Add an item to the cart or increment its quantity if it already exists
  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      const existingIndex = prevItems.findIndex(item => item.name === newItem.name);
      let updated: CartItem[];
      
      if (existingIndex > -1) {
        // If item exists, update its quantity
        updated = [...prevItems];
        updated[existingIndex].quantity += newItem.quantity;
      } else {
        // Otherwise, add the new item to the array
        updated = [...prevItems, newItem];
      }
      
      // Save changes to local storage
      saveCartToStorage(updated);
      return updated;
    });
  };

  // Update the quantity of a specific item in the cart by name
  const updateQuantity = (name: string, quantity: number) => {
    setCartItems(prevItems => {
      const updated = prevItems.map(item => (item.name === name ? { ...item, quantity } : item));
      saveCartToStorage(updated);
      return updated;
    });
  };

  // Remove a specific item from the cart completely by name
  const removeItem = (name: string) => {
    setCartItems(prevItems => {
      const updated = prevItems.filter(item => item.name !== name);
      saveCartToStorage(updated);
      return updated;
    });
  };

  // Clear all items from the cart and remove them from local storage
  const clearCart = () => {
    setCartItems([]);
    AsyncStorage.removeItem(CART_STORAGE_KEY);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to easily consume cart context across components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}