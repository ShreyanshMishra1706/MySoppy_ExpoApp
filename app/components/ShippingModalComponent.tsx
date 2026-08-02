import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCart } from '@/context/CartContext';

interface ShippingModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
}

export default function ShippingModalComponent({ visible, onClose, onSuccess }: ShippingModalProps) {
  const { clearCart } = useCart(); // Extract clearCart from global context

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const handleValidateAndContinue = () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('All fields are required');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setErrorMsg('Enter a valid email address');
      return;
    }
    if (phone.length < 10) {
      setErrorMsg('Enter a valid phone number');
      return;
    }
    if (address.trim().length < 5) {
      setErrorMsg('Enter a valid address');
      return;
    }

    setErrorMsg('');
    const randomTrx = `TRX-${Math.floor(10000000 + Math.random() * 90000000)}`;
    setTransactionId(randomTrx);

    // Close form modal and open success modal
    onClose();
    setIsSuccessModalVisible(true);
  };

  const handleFinishShopping = () => {
    clearCart(); // Clears out the cart items completely
    setIsSuccessModalVisible(false);
    onSuccess(transactionId);
  };

  return (
    <>
      {/* 1. Shipping Details Form Modal */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Shipping Details</Text>

            <TextInput 
              style={styles.input} 
              placeholder="Full Name" 
              placeholderTextColor="#95a5a6"
              value={fullName}
              onChangeText={setFullName}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              placeholderTextColor="#95a5a6"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Phone Number" 
              placeholderTextColor="#95a5a6"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Delivery Address" 
              placeholderTextColor="#95a5a6"
              multiline
              numberOfLines={3}
              value={address}
              onChangeText={setAddress}
            />

            {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueBtn} onPress={handleValidateAndContinue}>
                <Text style={styles.continueBtnText}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 2. Success Order Placed Modal */}
      <Modal visible={isSuccessModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.successModalContent}>
            <View style={styles.successIconCircle}>
              <Ionicons name="checkmark" size={40} color="#fff" />
            </View>

            <Text style={styles.successTitle}>Order Placed Successfully!</Text>
            <Text style={styles.successSubtitle}>Thank you for shopping with us.</Text>

            <Text style={styles.trxLabel}>Transaction ID</Text>
            <Text style={styles.trxIdText}>{transactionId}</Text>

            <TouchableOpacity style={styles.successActionBtn} onPress={handleFinishShopping}>
              <Text style={styles.successActionText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', width: '100%', maxWidth: 360, borderRadius: 20, padding: 24, alignItems: 'center' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  input: { width: '100%', borderWidth: 1, borderColor: '#dcdde1', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#2c3e50', marginBottom: 14, backgroundColor: '#fff' },
  textArea: { height: 80, textAlignVertical: 'top' },
  errorText: { color: '#e74c3c', fontSize: 13, marginBottom: 10, alignSelf: 'flex-start', fontWeight: '500' },
  modalBtnRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 10 },
  cancelBtn: { backgroundColor: '#dcdde1', paddingVertical: 12, borderRadius: 10, width: '48%', alignItems: 'center' },
  cancelBtnText: { color: '#2c3e50', fontSize: 15, fontWeight: 'bold' },
  continueBtn: { backgroundColor: '#34555b', paddingVertical: 12, borderRadius: 10, width: '48%', alignItems: 'center' },
  continueBtnText: { color: '#fff', fontSize: 15, fontWeight: 'bold' },

  successModalContent: { backgroundColor: '#fff', width: '100%', maxWidth: 360, borderRadius: 20, padding: 30, alignItems: 'center' },
  successIconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#2ecc71', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', textAlign: 'center', marginBottom: 6 },
  successSubtitle: { fontSize: 14, color: '#7f8c8d', marginBottom: 20, textAlign: 'center' },
  trxLabel: { fontSize: 13, color: '#7f8c8d', marginBottom: 4 },
  trxIdText: { fontSize: 16, fontWeight: 'bold', color: '#16a085', marginBottom: 24 },
  successActionBtn: { backgroundColor: '#e67e22', paddingVertical: 14, borderRadius: 12, width: '100%', alignItems: 'center' },
  successActionText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});