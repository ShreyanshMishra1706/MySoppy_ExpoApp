import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext'; // Import your global cart context
import ShippingModalComponent from '@/app/components/ShippingModalComponent';

export default function CartDetailComponent() {
  const router = useRouter();
  const { cartItems, updateQuantity, removeItem } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);

  // Calculate grand total of all items in cart
  const grandTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const handleOrderSuccess = (transactionId: string) => {
    router.replace('/');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Back Button Header */}
      <TouchableOpacity 
        onPress={() => router.back()} 
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="#2c3e50" />
      </TouchableOpacity>

      <Text style={styles.mainHeader}>Review Item And Shipping</Text>

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#bdc3c7" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        cartItems.map((item, index) => (
          <View key={index} style={styles.card}>
            {/* Display Item Image if available, else placeholder */}
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.itemImage} />
            ) : (
              <View style={styles.imageBox}>
                <Ionicons name="image-outline" size={32} color="#bdc3c7" />
              </View>
            )}

            <View style={styles.itemDetails}>
              <View style={styles.rowBetween}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
              </View>
              <Text style={styles.itemColor}>Unit: ${item.price.toFixed(2)}</Text>

              <View style={styles.cardBottomRow}>
                <View style={styles.miniCounter}>
                  <TouchableOpacity 
                    onPress={() => {
                      if (item.quantity > 1) {
                        updateQuantity(item.name, item.quantity - 1);
                      } else {
                        removeItem(item.name);
                      }
                    }} 
                    style={styles.miniBtn}
                  >
                    <Text style={styles.miniBtnText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.miniValue}>{item.quantity}</Text>
                  <TouchableOpacity 
                    onPress={() => updateQuantity(item.name, item.quantity + 1)} 
                    style={styles.miniBtn}
                  >
                    <Text style={styles.miniBtnText}>+</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => removeItem(item.name)}>
                  <Ionicons name="trash-outline" size={18} color="#e74c3c" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))
      )}

      {cartItems.length > 0 && (
        <>
          <Text style={styles.sectionHeader}>Total Price</Text>
          
          {cartItems.map((item, idx) => (
            <View key={idx} style={styles.breakdownRow}>
              <Text style={styles.breakdownText}>{item.name}</Text>
              <Text style={styles.breakdownText}>x{item.quantity}</Text>
              <Text style={styles.breakdownText}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total :</Text>
            <Text style={styles.totalAmount}>${grandTotal.toFixed(2)}</Text>
          </View>

          <TouchableOpacity 
            style={styles.orderBtn} 
            onPress={() => setIsCheckoutOpen(true)}
          >
            <Text style={styles.orderBtnText}>Place Order</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Render the Separate Shipping Modal Component */}
      <ShippingModalComponent 
        visible={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onSuccess={handleOrderSuccess}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 16, paddingTop: 40 },
  backButton: { marginBottom: 12, padding: 4, alignSelf: 'flex-start' },
  mainHeader: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 80 },
  emptyText: { fontSize: 16, color: '#7f8c8d', marginTop: 12 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 12, flexDirection: 'row', borderWidth: 1, borderColor: '#e0e0e0', marginBottom: 16 },
  imageBox: { width: 70, height: 70, backgroundColor: '#f1f2f6', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  itemImage: { width: 70, height: 70, borderRadius: 8, marginRight: 12, resizeMode: 'cover' },
  itemDetails: { flex: 1, justifyContent: 'space-between' },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemName: { fontSize: 15, fontWeight: 'bold', color: '#2c3e50' },
  itemPrice: { fontSize: 15, fontWeight: 'bold', color: '#2c3e50' },
  itemColor: { fontSize: 13, color: '#7f8c8d' },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  miniCounter: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#bdc3c7', borderRadius: 6, backgroundColor: '#f8f9fa' },
  miniBtn: { paddingHorizontal: 10, paddingVertical: 2 },
  miniBtnText: { fontSize: 14, fontWeight: 'bold', color: '#2c3e50' },
  miniValue: { paddingHorizontal: 8, fontSize: 13, fontWeight: 'bold', color: '#2c3e50' },
  sectionHeader: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12, marginTop: 10 },
  breakdownRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  breakdownText: { fontSize: 14, color: '#2c3e50', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 12 },
  totalRow: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 24 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginRight: 12 },
  totalAmount: { fontSize: 20, fontWeight: 'bold', color: '#16a085' },
  orderBtn: { backgroundColor: '#34495e', paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginBottom: 90 },
  orderBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});