import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import HomeComponent from '../components/home/HomeComponent';
import CategoriesComponent from '../components/categories/CategoriesComponent';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import CartScreen from '@/components/cart/CartScreen';
import { useRouter } from 'expo-router';

const Tab = createBottomTabNavigator();

export default function IndexScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />
      

      
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: string = 'home';

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Categories') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name === 'Cart') {
              iconName = focused ? 'cart' : 'cart-outline';
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#ffffff',
          tabBarInactiveTintColor: '#bdc3c7',
          tabBarStyle: {
            backgroundColor: '#34495e',
            borderTopWidth: 0,
            height: 80,
            paddingBottom: 5,
            paddingTop: 10,
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            position: 'absolute',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeComponent} />
        <Tab.Screen name="Categories" component={CategoriesComponent} />
        <Tab.Screen name="Cart" component={CartScreen} />
      </Tab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 55,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Pushes logo left and cart icon right
    paddingVertical: 30,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  logo: {
    width: 150,
    height: 50,
    resizeMode: 'contain',
  },
  cartIconContainer: {
    padding: 8,
  },
});