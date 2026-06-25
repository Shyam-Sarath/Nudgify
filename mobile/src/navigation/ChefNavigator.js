import React, { useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, Platform, TouchableOpacity, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BarChart2, ClipboardList, Package, TrendingUp, User } from 'lucide-react-native';
import ChefDashboardScreen from '../screens/chef/ChefDashboardScreen';
import ChefMenuScreen from '../screens/chef/ChefMenuScreen';
import ChefOrdersScreen from '../screens/chef/ChefOrdersScreen';
import ChefAnalyticsScreen from '../screens/chef/ChefAnalyticsScreen';
import ChefProfileScreen from '../screens/chef/ChefProfileScreen';
import ChefChatListScreen from '../screens/chef/ChefChatListScreen';
import ChefChatScreen from '../screens/chef/ChefChatScreen';
import PrivacyPolicyScreen from '../screens/common/PrivacyPolicyScreen';
import { useTheme } from '../theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();
const ProfileStack = createNativeStackNavigator();

function ProfileStackScreen() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ChefProfileScreen} />
      <ProfileStack.Screen name="ChefChatList" component={ChefChatListScreen} />
      <ProfileStack.Screen name="ChefChat" component={ChefChatScreen} />
      <ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </ProfileStack.Navigator>
  );
}

// Custom Tab Button to handle animations
const TabButton = ({ item, onPress, accessibilityState, colors, typography }) => {
  const focused = accessibilityState?.selected ?? false;
  const scale = useRef(new Animated.Value(focused ? 1.1 : 1)).current;
  const opacity = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.15 : 1,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start();
  }, [focused]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.tabButton}
    >
      <Animated.View style={[styles.iconContainer, { transform: [{ scale }] }]}>
        {item.icon(focused ? colors.primary : colors.mutedText, focused ? 24 : 22)}
        {focused && (
          <Animated.View 
            style={[
              styles.indicator, 
              { backgroundColor: colors.primary, opacity }
            ]} 
          />
        )}
      </Animated.View>
      <Text 
        style={[
          styles.tabLabel, 
          { 
            color: focused ? colors.primary : colors.mutedText,
            fontWeight: focused ? 'bold' : 'normal',
            fontFamily: focused ? typography.fontFamilies.primaryBold : typography.fontFamilies.primary,
          }
        ]}
      >
        {item.label}
      </Text>
    </TouchableOpacity>
  );
};

export default function ChefNavigator() {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const tabs = [
    { name: 'Dashboard', label: 'Analytics', component: ChefDashboardScreen, icon: (color, size) => <BarChart2 color={color} size={size} /> },
    { name: 'Orders', label: 'Orders', component: ChefOrdersScreen, icon: (color, size) => <ClipboardList color={color} size={size} /> },
    { name: 'Menu', label: 'Inventory', component: ChefMenuScreen, icon: (color, size) => <Package color={color} size={size} /> },
    { name: 'Analytics', label: 'Detailed', component: ChefAnalyticsScreen, icon: (color, size) => <TrendingUp color={color} size={size} /> },
    { name: 'Profile', label: 'Profile', component: ProfileStackScreen, icon: (color, size) => <User color={color} size={size} /> },
  ];

  return (
    <Tab.Navigator
      id="chef"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.surface,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          color: colors.text,
          fontFamily: typography.fontFamilies.heading,
        },
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: colors.surface,
            paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 15,
            height: Platform.OS === 'ios' ? 85 + insets.bottom : 75,
            borderColor: colors.border,
          }
        ],
      }}
    >
      {tabs.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.name}
          component={item.component}
          options={{
            title: item.name === 'Menu' ? 'Menu Directory' : (item.name === 'Analytics' ? 'Detailed Analytics' : (item.name === 'Dashboard' ? 'Chef Analytics' : item.name)),
            tabBarButton: (props) => <TabButton {...props} item={item} colors={colors} typography={typography} />
          }}
        />
      ))}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 20 : 15,
    left: 20,
    right: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    borderRadius: 24,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 2,
  },
  indicator: {
    position: 'absolute',
    bottom: -15,
    width: 4,
    height: 4,
    borderRadius: 2,
  }
});
