import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../theme';

// Customer screens
import CustomerHomeScreen from '../screens/customer/CustomerHomeScreen';
import CustomerCartScreen from '../screens/customer/CustomerCartScreen';
import CustomerOrdersScreen from '../screens/customer/CustomerOrdersScreen';
import CustomerProfileScreen from '../screens/customer/CustomerProfileScreen';
import ChefProfileScreen from '../screens/customer/ChefProfileScreen';
import CheckoutScreen from '../screens/customer/CheckoutScreen';
import OrderTrackingScreen from '../screens/customer/OrderTrackingScreen';
import DishDetailsScreen from '../screens/customer/DishDetailsScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import FavoritesScreen from '../screens/customer/FavoritesScreen';
import NotificationsScreen from '../screens/customer/NotificationsScreen';
import SettingsScreen from '../screens/customer/SettingsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator id="home-stack" screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={CustomerHomeScreen} />
      <HomeStack.Screen name="ChefProfile" component={ChefProfileScreen} />
      <HomeStack.Screen name="DishDetails" component={DishDetailsScreen} />
      <HomeStack.Screen name="Cart" component={CustomerCartScreen} />
      <HomeStack.Screen name="Checkout" component={CheckoutScreen} />
      <HomeStack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
    </HomeStack.Navigator>
  );
}

function CartStackScreen() {
  return (
    <CartStack.Navigator id="cart-stack" screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartMain" component={CustomerCartScreen} />
      <CartStack.Screen name="Checkout" component={CheckoutScreen} />
      <CartStack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </CartStack.Navigator>
  );
}

function OrdersStackScreen() {
  return (
    <OrdersStack.Navigator id="orders-stack" screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="OrdersMain" component={CustomerOrdersScreen} />
      <OrdersStack.Screen name="OrderTracking" component={OrderTrackingScreen} />
    </OrdersStack.Navigator>
  );
}

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator id="profile-stack" screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={CustomerProfileScreen} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
    </ProfileStack.Navigator>
  );
}

export default function CustomerNavigator() {
  const { colors, icons } = useTheme();

  return (
    <Tab.Navigator
      id="customer"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          let IconComponent;
          if (route.name === 'Home') IconComponent = icons.home;
          else if (route.name === 'Search') IconComponent = icons.search;
          else if (route.name === 'Orders') IconComponent = icons.cart;
          else if (route.name === 'Favorites') IconComponent = icons.favorite;
          else if (route.name === 'Profile') IconComponent = icons.profile;

          return IconComponent ? (
            <IconComponent size={20} color={focused ? colors.primary : colors.mutedText} />
          ) : null;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedText,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStackScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
      <Tab.Screen name="Orders" component={OrdersStackScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} options={{ title: 'Favorites' }} />
      <Tab.Screen name="Profile" component={ProfileStackScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
