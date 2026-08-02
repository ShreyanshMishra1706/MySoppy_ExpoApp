import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator, TextInput, Image } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { fetchProductsFromAPI, Product } from '@/services/api';

export default function CategoryProductsScreen() {
  const router = useRouter();
  const { categoryName } = useLocalSearchParams();
  
  // States for products data loading
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // States for Search & Filter functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [maxPrice, setMaxPrice] = useState<number>(500);
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false); // Toggles filter dropdown visibility

  // Fetch products from API when the screen loads
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const data = await fetchProductsFromAPI();
    setProducts(data);
    setLoading(false);
  };

  // Combined Filtering Logic: filters by category, search text, max price, and stock availability
  const filteredProducts = products.filter((product) => {
    const matchesCategory = product.category.toLowerCase() === String(categoryName).toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price <= maxPrice;
    const matchesStock = !onlyInStock || (product as any).stockStatus === 'In Stock';

    return matchesCategory && matchesSearch && matchesPrice && matchesStock;
  });

  return (
    <View style={styles.container}>
      {/* Top Header Row with Back Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => {
          if (router.canGoBack()) {
            router.back();
          } else {
            router.replace('/');
          }
        }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Categories / {categoryName}</Text>
      </View>

      <Text style={styles.sectionHeading}>{categoryName} For You!</Text>

      {/* Search Bar and Filter Toggle Icon Row */}
      <View style={styles.filterContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={18} color="#7f8c8d" style={{ marginRight: 6 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={16} color="#95a5a6" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity 
          style={[styles.filterToggleBtn, showFilters && styles.activeFilterToggle]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color={showFilters ? '#fff' : '#2c3e50'} />
        </TouchableOpacity>
      </View>

      {/* Expandable Filter Options Box (Price Chips & Stock Checkbox) */}
      {showFilters && (
        <View style={styles.dropdownFilters}>
          <View style={styles.filterRowBetween}>
            <Text style={styles.filterLabel}>Max Price: ${maxPrice}</Text>
            <View style={{ flexDirection: 'row', gap: 4 }}>
              {[50, 100, 200, 500].map((price) => (
                <TouchableOpacity 
                  key={price} 
                  style={[styles.chip, maxPrice === price && styles.activeChip]}
                  onPress={() => setMaxPrice(price)}
                >
                  <Text style={[styles.chipText, maxPrice === price && styles.activeChipText]}>${price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.stockRow} onPress={() => setOnlyInStock(!onlyInStock)}>
            <Ionicons name={onlyInStock ? "checkbox" : "square-outline"} size={20} color="#16a085" />
            <Text style={styles.stockTextLabel}>In Stock Only</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading Spinner or Grid Product List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#16a085" />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.productCard}
              activeOpacity={0.8}
              onPress={() => 
                router.push({
                  pathname: '/components/product-details',
                  params: { 
                    id: item.id, 
                    name: item.name, 
                    price: item.price, 
                    category: item.category, 
                    description: item.description,
                    image: item.image // Pass the image parameter here
                  }
                })
              }
            >
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.productImage} />
              ) : (
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="image-outline" size={28} color="#bdc3c7" />
                </View>
              )}

              <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
              <View style={styles.cartBtn}>
                <Text style={styles.cartBtnText}>View Details</Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No products found matching your filters.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerTitle: {
    fontSize: 16,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  sectionHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 12,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2c3e50',
  },
  filterToggleBtn: {
    width: 42,
    height: 42,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterToggle: {
    backgroundColor: '#34495e',
    borderColor: '#34495e',
  },
  dropdownFilters: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  filterRowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: '#f1f2f6',
    marginLeft: 4,
  },
  activeChip: {
    backgroundColor: '#16a085',
  },
  chipText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  activeChipText: {
    color: '#fff',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#f1f2f6',
  },
  stockTextLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  imagePlaceholder: {
    width: '100%',
    height: 100,
    backgroundColor: '#f1f2f6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  productName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a085',
    marginBottom: 8,
  },
  cartBtn: {
    borderWidth: 1,
    borderColor: '#2c3e50',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
  },
  cartBtnText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2c3e50',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
});