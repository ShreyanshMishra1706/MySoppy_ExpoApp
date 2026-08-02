import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '../../context/CartContext'; // Import the global cart hook

export default function ProductDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addToCart } = useCart(); // Extract addToCart from context
  
  // Extract image along with other product parameters
  const { name, price, category, description, image } = params;
  const [quantity, setQuantity] = useState<number>(1);
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  const increment = () => setQuantity(prev => prev + 1);
  const decrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    // Save the item globally into the cart state array
    addToCart({
      name: (name as string) || 'Product',
      price: Number(price) || 0,
      quantity: quantity,
      image: image as string
    });

    // Show sleek success banner feedback and return back after 1 second
    setShowSuccessBanner(true);
    setTimeout(() => {
      setShowSuccessBanner(false);
      router.back(); // Go back to the previous screen cleanly
    }, 1000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Success Notification Banner */}
      {showSuccessBanner && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={20} color="#fff" />
          <Text style={styles.successText}>Added to cart successfully!</Text>
        </View>
      )}

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
      </TouchableOpacity>

      {/* Render actual product image if available, else show placeholder */}
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image as string }} style={styles.productImage} />
        ) : (
          <Ionicons name="image-outline" size={64} color="#bdc3c7" />
        )}
      </View>

      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{name || 'Product Name'}</Text>
        <Text style={styles.category}>{category || 'Category'}</Text>
        <Text style={styles.price}>${Number(price || 0).toFixed(2)}</Text>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>
          {description || 'High quality product for everyday use.'}
        </Text>

        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.counterRow}>
          <TouchableOpacity onPress={decrement} style={styles.counterBtn}>
            <Text style={styles.counterBtnText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.counterValue}>{quantity}</Text>
          <TouchableOpacity onPress={increment} style={styles.counterBtn}>
            <Text style={styles.counterBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.addToCartBtn, showSuccessBanner && { backgroundColor: '#27ae60' }]} 
          onPress={handleAddToCart}
          disabled={showSuccessBanner}
        >
          <Text style={styles.addToCartText}>
            {showSuccessBanner ? 'Added!' : 'Add to Cart'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  successBanner: {
    flexDirection: 'row',
    backgroundColor: '#27ae60',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 10,
  },
  successText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  backButton: { marginBottom: 16, marginTop: 10 },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#f1f2f6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    overflow: 'hidden', // Ensures image respects border radius
  },
  productImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  detailsContainer: { paddingHorizontal: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50', marginBottom: 4 },
  category: { fontSize: 14, color: '#7f8c8d', marginBottom: 8 },
  price: { fontSize: 20, fontWeight: 'bold', color: '#16a085', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8, marginTop: 12 },
  description: { fontSize: 14, color: '#7f8c8d', lineHeight: 20, marginBottom: 12 },
  counterRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  counterBtn: { width: 36, height: 36, borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8f9fa' },
  counterBtnText: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  counterValue: { marginHorizontal: 16, fontSize: 18, fontWeight: 'bold', color: '#2c3e50' },
  addToCartBtn: { backgroundColor: '#34495e', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 30 },
  addToCartText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});