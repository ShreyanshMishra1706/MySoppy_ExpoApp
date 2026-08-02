import axios from 'axios';
import { Platform } from 'react-native';

// Update this to match your testing environment (localhost for web, local IP for physical phone)
// const API_BASE_URL = Platform.OS === 'web' ? 'http://localhost:3000' : 'http://192.168.1.100:3000'; 
// Dynamically set the base URL depending on the platform
const API_BASE_URL = Platform.select({
  web: 'http://localhost:3000',
  android: 'http://10.0.2.2:3000', // Standard localhost alias for Android Emulator
  ios: 'http://localhost:3000',     // iOS Simulator
  default: 'http://192.168.1.X:3000', // Replace with your computer's local Wi-Fi IP if testing on a physical device
});

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviewsCount: number;
  description: string;
  stockStatus: string;
  image: string;
}

export const fetchProductsFromAPI = async (): Promise<Product[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products from JSON server:', error);
    return [];
  }
};