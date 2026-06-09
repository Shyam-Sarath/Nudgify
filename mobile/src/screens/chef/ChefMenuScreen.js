import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity, Alert, ActivityIndicator, SafeAreaView, Modal } from 'react-native';
import axios from 'axios';
import { useAuthStore, useDataStore } from '../../store/store';

const API_URL = 'http://10.0.2.2:5000';
const API_URL_WEB = 'http://localhost:5000';

export default function ChefMenuScreen() {
  const { token } = useAuthStore();
  const { dishes, setDishes } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      let res;
      try {
        res = await axios.get(`${API_URL}/api/chef/dishes`, { headers });
      } catch {
        res = await axios.get(`${API_URL_WEB}/api/chef/dishes`, { headers });
      }
      setDishes(res.data.data || []);
    } catch (error) {
      console.error('Fetch dishes error:', error);
      Alert.alert('Error', 'Failed to fetch your menu');
    } finally {
      setLoading(false);
    }
  };

  const handleAddDish = async () => {
    if (!name || !price) {
      Alert.alert('Error', 'Name and Price are required');
      return;
    }

    setSubmitLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const dishPayload = {
        name,
        description,
        price: parseFloat(price),
        category,
        availability: true,
      };

      let res;
      try {
        res = await axios.post(`${API_URL}/api/chef/dishes`, dishPayload, { headers });
      } catch {
        res = await axios.post(`${API_URL_WEB}/api/chef/dishes`, dishPayload, { headers });
      }

      Alert.alert('Success', 'Dish added to your menu!');
      setModalVisible(false);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      fetchDishes();
    } catch (error) {
      console.error('Add dish error:', error);
      Alert.alert('Failed', error.response?.data?.message || 'Failed to add dish.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeleteDish = async (dishId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this dish?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const headers = { Authorization: `Bearer ${token}` };
              try {
                await axios.delete(`${API_URL}/api/chef/dishes/${dishId}`, { headers });
              } catch {
                await axios.delete(`${API_URL_WEB}/api/chef/dishes/${dishId}`, { headers });
              }
              Alert.alert('Success', 'Dish deleted');
              fetchDishes();
            } catch (error) {
              console.error('Delete dish error:', error);
              Alert.alert('Error', 'Failed to delete dish');
            }
          },
        },
      ]
    );
  };

  const handleToggleAvailability = async (item) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const updatedPayload = { ...item, availability: !item.availability };
      try {
        await axios.put(`${API_URL}/api/chef/dishes/${item.id}`, updatedPayload, { headers });
      } catch {
        await axios.put(`${API_URL_WEB}/api/chef/dishes/${item.id}`, updatedPayload, { headers });
      }
      fetchDishes();
    } catch (error) {
      console.error('Toggle availability error:', error);
      Alert.alert('Error', 'Failed to update availability status');
    }
  };

  const renderDishItem = ({ item }) => (
    <View style={styles.dishCard}>
      <View style={styles.dishHeader}>
        <View style={styles.dishInfo}>
          <Text style={styles.dishName}>{item.name}</Text>
          <Text style={styles.dishDesc} numberOfLines={2}>{item.description}</Text>
          <Text style={styles.dishPrice}>${parseFloat(item.price).toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.statusToggle, item.availability ? styles.statusActive : styles.statusInactive]}
          onPress={() => handleToggleAvailability(item)}
        >
          <Text style={[styles.statusToggleText, { color: item.availability ? '#10b981' : '#ef4444' }]}>
            {item.availability ? 'Available' : 'Unavailable'}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeleteDish(item.id)}>
        <Text style={styles.deleteText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Menu Directory</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={styles.addBtnText}>+ Add Dish</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#ff6b35" />
          <Text style={styles.loadingText}>Fetching menu list...</Text>
        </View>
      ) : dishes.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>You haven't added any dishes yet.</Text>
        </View>
      ) : (
        <FlatList
          data={dishes}
          renderItem={renderDishItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Dish Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Dish</Text>

            <Text style={styles.label}>Dish Name</Text>
            <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Spaghetti Carbonara" />

            <Text style={styles.label}>Description</Text>
            <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder="Classic Italian pasta with pancetta..." multiline />

            <Text style={styles.label}>Price ($)</Text>
            <TextInput style={styles.input} value={price} onChangeText={setPrice} placeholder="12.50" keyboardType="numeric" />

            <Text style={styles.label}>Category</Text>
            <TextInput style={styles.input} value={category} onChangeText={setCategory} placeholder="Pasta" />

            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.modalBtn, styles.cancelBtn]} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, styles.submitBtn]} onPress={handleAddDish} disabled={submitLoading}>
                {submitLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Add</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f5f7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  addBtn: {
    backgroundColor: '#ff6b35',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#fff',
    fontSize: 13,
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
  dishCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1f2687',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.02,
    shadowRadius: 8,
    elevation: 2,
  },
  dishHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  dishInfo: {
    flex: 1,
    paddingRight: 16,
  },
  dishName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e1e24',
  },
  dishDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  dishPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ff6b35',
    marginTop: 6,
  },
  statusToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.2,
  },
  statusActive: {
    borderColor: '#10b981',
    backgroundColor: '#ecfdf5',
  },
  statusInactive: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2',
  },
  statusToggleText: {
    fontSize: 12,
    fontWeight: '700',
  },
  deleteBtn: {
    alignSelf: 'flex-end',
    marginTop: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fef2f2',
    borderRadius: 6,
  },
  deleteText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e1e24',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1e1e24',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    width: '100%',
    height: 46,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#1e1e24',
    backgroundColor: '#f8fafc',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },
  modalBtn: {
    flex: 1,
    height: 46,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
  },
  cancelBtnText: {
    color: '#666',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#ff6b35',
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
