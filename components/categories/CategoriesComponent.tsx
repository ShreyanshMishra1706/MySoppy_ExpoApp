import React from 'react';
import { StyleSheet, Text, View, FlatList, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { CATEGORIES } from '../../constant/mockData';

export default function CategoriesComponent() {
  const router = useRouter();

  const renderCategoryItem = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <Pressable
      style={({ pressed }) => [styles.card, { opacity: pressed ? 0.8 : 1 }]}
      onPress={() => 
        router.push({
          pathname: '/components/category-products',
          params: { categoryName: item.name },
        })
      }
    >
      <Image source={item.image} style={styles.image} resizeMode="cover" />
      <View style={styles.overlay}>
        <Text style={styles.categoryText}>{item.name}</Text>
      </View>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categories</Text>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '48%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#eaf2f1',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
});