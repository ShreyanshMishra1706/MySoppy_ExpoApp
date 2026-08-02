import React, { useState } from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SearchFilterProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  maxPrice: number;
  onMaxPriceChange: (price: number) => void;
  onlyInStock: boolean;
  onToggleInStock: () => void;
}

export default function SearchFilterComponent({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  maxPrice,
  onMaxPriceChange,
  onlyInStock,
  onToggleInStock,
}: SearchFilterProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <View style={styles.container}>
      {/* Search Input Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#7f8c8d" style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search products by name..."
            placeholderTextColor="#95a5a6"
            value={searchQuery}
            onChangeText={onSearchChange}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => onSearchChange('')}>
              <Ionicons name="close-circle" size={18} color="#95a5a6" />
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity 
          style={[styles.filterToggleBtn, showFilters && styles.activeFilterBtn]} 
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons name="options-outline" size={20} color={showFilters ? '#fff' : '#2c3e50'} />
        </TouchableOpacity>
      </View>

      {/* Expandable Filters Section */}
      {showFilters && (
        <View style={styles.filtersDropdown}>
          {/* Category Chips Horizontal Scroll */}
          <Text style={styles.filterLabel}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            <TouchableOpacity 
              style={[styles.chip, selectedCategory === 'All' && styles.activeChip]}
              onPress={() => onSelectCategory('All')}
            >
              <Text style={[styles.chipText, selectedCategory === 'All' && styles.activeChipText]}>All</Text>
            </TouchableOpacity>
            {categories.map((cat, idx) => (
              <TouchableOpacity 
                key={idx}
                style={[styles.chip, selectedCategory === cat && styles.activeChip]}
                onPress={() => onSelectCategory(cat)}
              >
                <Text style={[styles.chipText, selectedCategory === cat && styles.activeChipText]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Price Range Filter */}
          <View style={styles.filterRowBetween}>
            <Text style={styles.filterLabel}>Max Price: ${maxPrice}</Text>
            <View style={styles.priceButtons}>
              {[50, 100, 200, 500].map((price) => (
                <TouchableOpacity 
                  key={price}
                  style={[styles.priceBtn, maxPrice === price && styles.activePriceBtn]}
                  onPress={() => onMaxPriceChange(price)}
                >
                  <Text style={[styles.priceBtnText, maxPrice === price && styles.activePriceBtnText]}>${price}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Availability / Stock Toggle */}
          <TouchableOpacity style={styles.stockRow} onPress={onToggleInStock}>
            <Ionicons 
              name={onlyInStock ? "checkbox" : "square-outline"} 
              size={22} 
              color="#16a085" 
            />
            <Text style={styles.stockLabel}>In Stock Only</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#dcdde1', borderRadius: 12, paddingHorizontal: 12, height: 46 },
  searchIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: '#2c3e50' },
  filterToggleBtn: { width: 46, height: 46, backgroundColor: '#fff', borderWidth: 1, borderColor: '#dcdde1', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  activeFilterBtn: { backgroundColor: '#34495e', borderColor: '#34495e' },
  
  filtersDropdown: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e0e0e0', borderRadius: 12, padding: 14, marginTop: 10 },
  filterLabel: { fontSize: 13, fontWeight: 'bold', color: '#7f8c8d', marginBottom: 8, textTransform: 'uppercase' },
  categoryScroll: { flexDirection: 'row', marginBottom: 14 },
  chip: { paddingHorizontal: 14, paddingVertical: 6, backgroundColor: '#f1f2f6', borderRadius: 20, marginRight: 8, height: 32 },
  activeChip: { backgroundColor: '#16a085' },
  chipText: { fontSize: 13, color: '#2c3e50', fontWeight: '500' },
  activeChipText: { color: '#fff' },

  filterRowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  priceButtons: { flexDirection: 'row', gap: 6 },
  priceBtn: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, backgroundColor: '#f1f2f6' },
  activePriceBtn: { backgroundColor: '#16a085' },
  priceBtnText: { fontSize: 12, color: '#2c3e50', fontWeight: 'bold' },
  activePriceBtnText: { color: '#fff' },

  stockRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 4, borderTopWidth: 1, borderTopColor: '#f1f2f6' },
  stockLabel: { fontSize: 14, fontWeight: '500', color: '#2c3e50' },
});