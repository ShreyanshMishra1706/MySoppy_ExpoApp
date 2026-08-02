import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function HomeComponent({ navigation }: { navigation?: any }) {
  
  

  return (
  <View style={styles.container}>
    <Image
      source={require('../../assets/categories/home3.png')}
      style={styles.bannerImage}
    />
  </View>

  );
}

const styles = StyleSheet.create({
bannerImage: {
    width: '100%',
    height: 500, // Use a fixed pixel height (or percentage if parent has strict bounds) for cross-platform stability
  },

  container: {
    flex: 1, // Crucial for web so the parent view expands to fill the screen
    backgroundColor: '#fff',
    
  },

});