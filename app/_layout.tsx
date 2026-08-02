import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { CartProvider } from "../context/CartContext";

export default function RootLayout() {
  const router = useRouter();

  return (
    <CartProvider>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right', 'bottom']}>
          
          {/* Global Header visible on ALL pages */}
          <View style={styles.headerContainer}>
            <Image 
              source={require('../assets/categories/logo.png')} 
              style={styles.logo}
            />
            <TouchableOpacity 
              style={styles.cartIconContainer} 
              onPress={() => router.push('/components/CartDetailComponent' as any)}
            >
              <Ionicons name="cart-outline" size={24} color="#2c3e50" />
            </TouchableOpacity>
          </View>

          <Stack
            screenOptions={{
              headerShown: false, // Hide default headers so your custom global header shows
            }}
          />

        </SafeAreaView>
      </SafeAreaProvider>
    </CartProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerContainer: {
    height: 55,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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