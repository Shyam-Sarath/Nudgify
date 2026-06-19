import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Image, Pressable, Alert, SafeAreaView } from 'react-native';
import apiClient from '../../config/api';
import { useAuthStore, useDataStore } from '../../store/store';
import { useTheme } from '../../theme';
import { Card, Button, Input, Modal, Skeleton, EmptyState, Badge, Divider } from '../../components';

const DISH_PRESETS = [
  { name: 'Pizza', url: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=150&q=80', base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQGAb6eGQQAAAABJRU5ErkJggg==' },
  { name: 'Pasta', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=150&q=80', base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' },
  { name: 'Salad', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=150&q=80', base64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPjPUAwADoYBgFV562kAAAAASUVORK5CYII==' }
];

export default function ChefMenuScreen() {
  const { token } = useAuthStore();
  const { colors, spacing, typography, radius } = useTheme();
  const { dishes, setDishes } = useDataStore();
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [selectedPresetIdx, setSelectedPresetIdx] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchDishes();
  }, []);

  const fetchDishes = async () => {
    setLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const res = await apiClient.get('/api/chef/dishes', { headers });
      setDishes(res.data.data || []);
    } catch (error) {
      console.error('Fetch dishes error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to fetch dishes');
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

      const res = await apiClient.post('/api/chef/dishes', dishPayload, { headers });
      const newDish = res.data.data;

      // Upload image preset if selected
      if (selectedPresetIdx !== null) {
        const base64 = DISH_PRESETS[selectedPresetIdx].base64;
        await apiClient.post(`/api/chef/dishes/${newDish.id}/image`, { imageBase64: base64 }, { headers });
      }

      Alert.alert('Success', 'Dish added to your menu!');
      setModalVisible(false);
      setName('');
      setDescription('');
      setPrice('');
      setCategory('');
      setSelectedPresetIdx(0);
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
              await apiClient.delete(`/api/chef/dishes/${dishId}`, { headers });
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
      await apiClient.put(`/api/chef/dishes/${item.id}`, updatedPayload, { headers });
      fetchDishes();
    } catch (error) {
      console.error('Toggle availability error:', error);
      Alert.alert('Error', error.response?.data?.message || 'Failed to update availability');
    }
  };

  const renderDishItem = ({ item }) => (
    <Card variant="outlined" style={styles.dishCard}>
      <View style={styles.dishHeader}>
        <Image
          source={{ uri: item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=150&q=80' }}
          style={[styles.dishImage, { borderRadius: radius.default }]}
        />
        <View style={styles.dishInfo}>
          <Text style={[styles.dishName, { color: colors.text, fontFamily: typography.fontFamilies.heading }]}>
            {item.name}
          </Text>
          <Text style={[styles.dishDesc, { color: colors.mutedText, fontFamily: typography.fontFamilies.primary }]} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={[styles.dishPrice, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
            ${parseFloat(item.price).toFixed(2)}
          </Text>
        </View>

        <Pressable
          style={[
            styles.statusToggle,
            { borderRadius: radius.full },
            item.availability
              ? { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
              : { borderColor: colors.error, backgroundColor: colors.error + '10' }
          ]}
          onPress={() => handleToggleAvailability(item)}
        >
          <Text style={[styles.statusToggleText, { color: item.availability ? colors.primary : colors.error, fontFamily: typography.fontFamilies.primaryBold }]}>
            {item.availability ? 'Active' : 'Hidden'}
          </Text>
        </Pressable>
      </View>
      <Divider />
      <Pressable style={styles.deleteBtn} onPress={() => handleDeleteDish(item.id)}>
        <Text style={[styles.deleteText, { color: colors.error, fontFamily: typography.fontFamilies.primaryBold }]}>
          Remove Dish
        </Text>
      </Pressable>
    </Card>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.topBar, { paddingHorizontal: spacing.containerPaddingMobile, borderBottomColor: colors.border + '50' }]}>
        <Text style={[styles.title, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Menu Directory
        </Text>
        <Button title="+ Add Dish" onPress={() => setModalVisible(true)} style={styles.addBtn} />
      </View>

      {loading ? (
        <View style={[styles.skeletonContainer, { paddingHorizontal: spacing.containerPaddingMobile }]}>
          <Skeleton height={120} style={{ marginBottom: 12 }} />
          <Skeleton height={120} style={{ marginBottom: 12 }} />
        </View>
      ) : dishes.length === 0 ? (
        <EmptyState
          iconName="chef"
          title="Empty Menu"
          description="You haven't added any culinary creations to your menu directory yet."
          actionTitle="Create Dish"
          onAction={() => setModalVisible(true)}
        />
      ) : (
        <FlatList
          data={dishes}
          renderItem={renderDishItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={[styles.listContent, { paddingHorizontal: spacing.containerPaddingMobile }]}
          onRefresh={fetchDishes}
          refreshing={loading}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Dish Modal */}
      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <Text style={[styles.modalTitle, { color: colors.primary, fontFamily: typography.fontFamilies.heading }]}>
          Add New Dish
        </Text>

        <Input
          label="Dish Name"
          value={name}
          onChangeText={setName}
          placeholder="Heritage Seafood Paella"
        />

        <Input
          label="Description"
          value={description}
          onChangeText={setDescription}
          placeholder="Bomba saffron rice with tiger prawns and local mussels..."
          multiline
        />

        <View style={styles.row}>
          <Input
            label="Price ($)"
            value={price}
            onChangeText={setPrice}
            placeholder="24.00"
            keyboardType="numeric"
            containerStyle={StyleSheet.flatten({ flex: 1, marginRight: 8 })}
          />

          <Input
            label="Category"
            value={category}
            onChangeText={setCategory}
            placeholder="Seafood"
            containerStyle={StyleSheet.flatten({ flex: 1, marginLeft: 8 })}
          />
        </View>

        <Text style={[styles.label, { color: colors.text, fontFamily: typography.fontFamilies.primaryBold, fontSize: typography.sizes.sm }]}>
          Select Photo Preset
        </Text>
        <View style={styles.presetContainer}>
          {DISH_PRESETS.map((preset, idx) => (
            <Pressable
              key={idx}
              style={[
                styles.presetBtn,
                { borderRadius: radius.default },
                selectedPresetIdx === idx && { borderColor: colors.primary, borderWidth: 2 }
              ]}
              onPress={() => setSelectedPresetIdx(idx)}
            >
              <Image source={{ uri: preset.url }} style={[styles.presetThumb, { borderRadius: radius.sm }]} />
              <Text style={[
                styles.presetName,
                { color: colors.mutedText, fontFamily: typography.fontFamilies.primary },
                selectedPresetIdx === idx && { color: colors.primary, fontFamily: typography.fontFamilies.primaryBold }
              ]}>
                {preset.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.modalActions}>
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => setModalVisible(false)}
            style={[styles.modalBtn, { marginRight: 8 }]}
          />
          <Button
            title="Add Dish"
            onPress={handleAddDish}
            loading={submitLoading}
            disabled={submitLoading}
            style={[styles.modalBtn, { marginLeft: 8 }]}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  addBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skeletonContainer: {
    paddingTop: 16,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  dishCard: {
    padding: 16,
    marginBottom: 16,
  },
  dishHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dishImage: {
    width: 64,
    height: 64,
    objectFit: 'cover',
  },
  dishInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  dishName: {
    fontSize: 15,
    fontWeight: '700',
  },
  dishDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 16,
  },
  dishPrice: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 4,
  },
  statusToggle: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
  },
  statusToggleText: {
    fontSize: 11,
  },
  deleteBtn: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 13,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    marginBottom: 8,
    marginTop: 12,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
  },
  presetContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
    marginBottom: 16,
  },
  presetBtn: {
    alignItems: 'center',
    padding: 4,
    flex: 1,
  },
  presetThumb: {
    width: 50,
    height: 50,
    objectFit: 'cover',
  },
  presetName: {
    fontSize: 11,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
  },
});
