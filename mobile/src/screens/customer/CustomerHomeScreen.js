import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import axios from 'axios';
import { useDataStore, useCartStore, useAuthStore } from '../../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function CustomerHomeScreen() {
  const { token } = useAuthStore();
  const { chefs, setChefs } = useDataStore();
  const { addToCart, cart } = useCartStore();
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedChef, setSelectedChef] = useState(null);
  const [chefDishes, setChefDishes] = useState([]);
  const [dishesLoading, setDishesLoading] = useState(false);

  useEffect(() => {
    fetchChefs();
  }, []);

  const fetchChefs = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.get(`${API_URL}/api/customer/chefs`, { headers });
      } catch {
        res = await axios.get(`${API_URL_WEB}/api/customer/chefs`, { headers });
      }
      setChefs(res.data.data || []);
    } catch (error) {
      console.error('Fetch chefs error:', error);
      Alert.alert('Error', 'Failed to fetch chefs list');
    } finally {
      setLoading(false);
    }
  };

  const fetchChefDetails = async (chefId) => {
    setDishesLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.get(`${API_URL}/api/customer/chefs/${chefId}`, { headers });
      } catch {
        res = await axios.get(`${API_URL_WEB}/api/customer/chefs/${chefId}`, { headers });
      }
      setChefDishes(res.data.data.dishes || []);
    } catch (error) {
      console.error('Fetch chef details error:', error);
      Alert.alert('Error', 'Failed to fetch chef menu');
    } finally {
      setDishesLoading(false);
    }
  };

  const handleSelectChef = (chef) => {
    if (selectedChef?.user_id === chef.user_id) {
      setSelectedChef(null);
      setChefDishes([]);
    } else {
      setSelectedChef(chef);
      fetchChefDetails(chef.user_id);
    }
  };

  const filteredChefs = chefs.filter(
    (c) =>
      c.users?.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.cuisine_type?.toLowerCase().includes(search.toLowerCase())
  );

  const getCartCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  };

  const renderChefItem = ({ item }) => {
    const isExpanded = selectedChef?.user_id === item.user_id;

    return (
      <View style={styles.chefCard}>
        <TouchableOpacity style={styles.chefHeader} onPress={() => handleSelectChef(item)}>
          <Image
            source={{ uri: item.profile_image || 'https://placehold.co/150' }}
            style={styles.chefImage}
          />
          <View style={styles.chefInfo}>
            <Text style={styles.chefName}>{item.users?.name || 'Chef Alice'}</Text>
            <Text style={styles.cuisineBadge}>{item.cuisine_type || 'Specialty'}</Text>
            <Text style={styles.chefBio} numberOfLines={2}>{item.bio || 'Home chef cooks with love.'}</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingStar}>★</Text>
            <Text style={styles.ratingText}>{item.rating?.toFixed(1) || '5.0'}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.dishesContainer}>
            <Text style={styles.sectionTitle}>Menu</Text>
            {dishesLoading ? (
              <ActivityIndicator color="#ff6b35" style={{ margin: 20 }} />
            ) : chefDishes.length === 0 ? (
              <Text style={styles.emptyMenu}>No dishes available</Text>
            ) : (
              chefDishes.map((dish) => (
                <View key={dish.id} style={styles.dishRow}>
                  <View style={styles.dishLeft}>
                    <Text style={styles.dishName}>{dish.name}</Text>
                    <Text style={styles.dishDesc} numberOfLines={2}>{dish.description}</Text>
                    <Text style={styles.dishPrice}>${parseFloat(dish.price).toFixed(2)}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.addToCartBtn}
                    onPress={() => {
                      addToCart(dish, item.user_id);
                      Alert.alert('Success', `${dish.name} added to cart!`);
                    }}
                  >
                    <Text style={styles.addToCartText}>Add +</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Search chefs or cuisines..."
          value={search}
          onChangeText={setSearch}
        />
        {getCartCount() > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartBadgeText}>{getCartCount()}</Text>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={styles.loadingText}>Finding local home chefs...</Text>
        </View>
      ) : filteredChefs.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No chefs found matching "{search}"</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChefs}
          renderItem={renderChefItem}
          keyExtractor={(item) => String(item.user_id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  searchBar: {
    flex: 1,
    height: 46,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1e1e24',
  },
  cartBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff6b35',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
  },
  emptyText: {
    color: '#888',
    fontSize: 15,
  },
  listContent: {
    padding: 16,
  },
  chefCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#1f2687',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  chefHeader: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  chefImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#e2e8f0',
  },
  chefInfo: {
    flex: 1,
    marginLeft: 16,
  },
  chefName: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  cuisineBadge: {
    fontSize: 11,
    color: '#ff6b35',
    backgroundColor: '#fff8f5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
    fontWeight: '600',
  },
  chefBio: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingStar: {
    color: '#d97706',
    fontSize: 12,
    marginRight: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#d97706',
  },
  dishesContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
    padding: 16,
    backgroundColor: '#fafbfc',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e1e24',
    marginBottom: 12,
  },
  emptyMenu: {
    textAlign: 'center',
    color: '#888',
    paddingVertical: 12,
  },
  dishRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  dishLeft: {
    flex: 1,
    paddingRight: 16,
  },
  dishName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  dishDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginTop: 4,
  },
  addToCartBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addToCartText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
