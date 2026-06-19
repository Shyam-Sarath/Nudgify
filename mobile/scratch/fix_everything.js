const fs = require('fs');
const path = require('path');

const projectRoot = 'c:/Users/shyam sarath s.p/OneDrive/Desktop/4D/mobile';

function modifyFile(filePath, replacements) {
  const absolutePath = path.resolve(projectRoot, filePath);
  if (!fs.existsSync(absolutePath)) {
    console.log(`File does not exist: ${absolutePath}`);
    return;
  }
  let content = fs.readFileSync(absolutePath, 'utf8');
  let original = content;
  
  for (const r of replacements) {
    content = content.replace(r.target, r.replacement);
  }
  
  if (content !== original) {
    fs.writeFileSync(absolutePath, content, 'utf8');
    console.log(`Modified: ${filePath}`);
  } else {
    console.log(`No changes for: ${filePath}`);
  }
}

// 1. Fix theme.ts TS5097 error
modifyFile('src/theme/theme.ts', [
  { target: "export * from './theme.tsx';", replacement: "export * from './theme';" }
]);

// 2. Fix SearchScreen Alert error
modifyFile('src/screens/customer/SearchScreen.js', [
  { target: "import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';", replacement: "import { StyleSheet, Text, View, SafeAreaView, FlatList, Alert } from 'react-native';" }
]);

// 3. Fix absoluteFillObject errors
const absoluteFillReplacements = [
  { target: /StyleSheet\.absoluteFillObject/g, replacement: 'StyleSheet.absoluteFill' }
];
modifyFile('src/screens/customer/CheckoutScreen.js', absoluteFillReplacements);
modifyFile('src/screens/customer/ChefProfileScreen.js', absoluteFillReplacements);
modifyFile('src/screens/customer/OrderTrackingScreen.js', absoluteFillReplacements);

// 4. Fix CustomerNavigator.js v7 ID requirements
modifyFile('src/navigation/CustomerNavigator.js', [
  { target: '<HomeStack.Navigator screenOptions={{ headerShown: false }}>', replacement: '<HomeStack.Navigator id="home-stack" screenOptions={{ headerShown: false }}>' },
  { target: '<CartStack.Navigator screenOptions={{ headerShown: false }}>', replacement: '<CartStack.Navigator id="cart-stack" screenOptions={{ headerShown: false }}>' },
  { target: '<OrdersStack.Navigator screenOptions={{ headerShown: false }}>', replacement: '<OrdersStack.Navigator id="orders-stack" screenOptions={{ headerShown: false }}>' },
  { target: '<ProfileStack.Navigator screenOptions={{ headerShown: false }}>', replacement: '<ProfileStack.Navigator id="profile-stack" screenOptions={{ headerShown: false }}>' },
]);

// 5. Fix components styles to use StyleProp
// UI Components
modifyFile('src/components/ui/Button.tsx', [
  { target: "ViewStyle, TextStyle } from 'react-native';", replacement: "StyleProp, ViewStyle, TextStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
  { target: "textStyle?: TextStyle;", replacement: "textStyle?: StyleProp<TextStyle>;" },
]);

modifyFile('src/components/ui/Input.tsx', [
  { target: "ViewStyle, TextStyle } from 'react-native';", replacement: "StyleProp, ViewStyle, TextStyle } from 'react-native';" },
  { target: "containerStyle?: ViewStyle;", replacement: "containerStyle?: StyleProp<ViewStyle>;" },
  { target: "inputStyle?: TextStyle;", replacement: "inputStyle?: StyleProp<TextStyle>;" },
  { target: "labelStyle?: TextStyle;", replacement: "labelStyle?: StyleProp<TextStyle>;" },
]);

modifyFile('src/components/ui/SearchBar.tsx', [
  { target: "TextInputProps, ViewStyle } from 'react-native';", replacement: "TextInputProps, StyleProp, ViewStyle } from 'react-native';" },
  { target: "containerStyle?: ViewStyle;", replacement: "containerStyle?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/Card.tsx', [
  { target: "View, StyleSheet, ViewStyle } from 'react-native';", replacement: "View, StyleSheet, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/Badge.tsx', [
  { target: "View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';", replacement: "View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
  { target: "textStyle?: TextStyle;", replacement: "textStyle?: StyleProp<TextStyle>;" },
]);

modifyFile('src/components/ui/Chip.tsx', [
  { target: "Text, StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native';", replacement: "Text, StyleSheet, Pressable, StyleProp, ViewStyle, TextStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
  { target: "textStyle?: TextStyle;", replacement: "textStyle?: StyleProp<TextStyle>;" },
]);

modifyFile('src/components/ui/Avatar.tsx', [
  { target: "View, Image, Text, StyleSheet, ViewStyle } from 'react-native';", replacement: "View, Image, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/Modal.tsx', [
  { target: "Modal as RNModal, StyleSheet, View, Pressable, ViewStyle } from 'react-native';", replacement: "Modal as RNModal, StyleSheet, View, Pressable, StyleProp, ViewStyle } from 'react-native';" },
  { target: "contentStyle?: ViewStyle;", replacement: "contentStyle?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/BottomSheet.tsx', [
  { target: "Modal as RNModal, StyleSheet, View, Pressable, ViewStyle, SafeAreaView } from 'react-native';", replacement: "Modal as RNModal, StyleSheet, View, Pressable, StyleProp, ViewStyle, SafeAreaView } from 'react-native';" },
  { target: "contentStyle?: ViewStyle;", replacement: "contentStyle?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/Toast.tsx', [
  { target: "StyleSheet, Text, Animated, ViewStyle } from 'react-native';", replacement: "StyleSheet, Text, Animated, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/Skeleton.tsx', [
  { target: "StyleSheet, Animated, ViewStyle } from 'react-native';", replacement: "StyleSheet, Animated, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/EmptyState.tsx', [
  { target: "View, Text, StyleSheet, ViewStyle } from 'react-native';", replacement: "View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/ui/Divider.tsx', [
  { target: "View, StyleSheet, ViewStyle } from 'react-native';", replacement: "View, StyleSheet, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

// Business Components
modifyFile('src/components/business/ChefCard.tsx', [
  { target: "Image, Pressable, ViewStyle } from 'react-native';", replacement: "Image, Pressable, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/business/DishCard.tsx', [
  { target: "Image, Pressable, ViewStyle } from 'react-native';", replacement: "Image, Pressable, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/business/OrderCard.tsx', [
  { target: "Pressable, ViewStyle } from 'react-native';", replacement: "Pressable, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/business/StatCard.tsx', [
  { target: "View, Text, StyleSheet, ViewStyle } from 'react-native';", replacement: "View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/business/ProfileHeader.tsx', [
  { target: "View, Text, StyleSheet, ViewStyle } from 'react-native';", replacement: "View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/business/MenuSection.tsx', [
  { target: "View, Text, StyleSheet, ScrollView, ViewStyle } from 'react-native';", replacement: "View, Text, StyleSheet, ScrollView, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

modifyFile('src/components/business/NotificationCard.tsx', [
  { target: "View, Text, StyleSheet, ViewStyle } from 'react-native';", replacement: "View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';" },
  { target: "style?: ViewStyle;", replacement: "style?: StyleProp<ViewStyle>;" },
]);

// 6. Fix ChefDashboardScreen bar fill height type checks and style arrays
modifyFile('src/screens/chef/ChefDashboardScreen.js', [
  { target: "style={[styles.performanceCard, { backgroundColor: colors.primary }]}", replacement: "style={StyleSheet.flatten([styles.performanceCard, { backgroundColor: colors.primary }])}" },
  { target: "style={styles.headerLeft}", replacement: "style={styles.headerLeft || {}}" },
  {
    target: `              {[
                { day: 'Mon', h: '60%' },
                { day: 'Tue', h: '45%' },
                { day: 'Wed', h: '85%' },
                { day: 'Thu', h: '70%' },
                { day: 'Fri', h: '95%' },
                { day: 'Sat', h: '100%', active: true },
                { day: 'Sun', h: '30%' },
              ].map((b, i) => (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.barTrack}>
                    <View style={[
                      styles.barFill,
                      {
                        height: b.h,
                        backgroundColor: b.active ? colors.secondary : 'rgba(255,255,255,0.2)'
                      }
                    ]} />
                  </View>`,
    replacement: `              {[
                { day: 'Mon', h: 60 },
                { day: 'Tue', h: 45 },
                { day: 'Wed', h: 85 },
                { day: 'Thu', h: 70 },
                { day: 'Fri', h: 95 },
                { day: 'Sat', h: 100, active: true },
                { day: 'Sun', h: 30 },
              ].map((b, i) => (
                <View key={i} style={styles.chartCol}>
                  <View style={styles.barTrack}>
                    <View style={[
                      styles.barFill,
                      {
                        height: (b.h / 100) * 70,
                        backgroundColor: b.active ? colors.secondary : 'rgba(255,255,255,0.2)'
                      }
                    ]} />
                  </View>`
  }
]);

// 7. Fix style arrays in ChefMenuScreen
modifyFile('src/screens/chef/ChefMenuScreen.js', [
  { target: "containerStyle={{ flex: 1, marginRight: 8 }}", replacement: "containerStyle={StyleSheet.flatten({ flex: 1, marginRight: 8 })}" },
  { target: "containerStyle={{ flex: 1, marginLeft: 8 }}", replacement: "containerStyle={StyleSheet.flatten({ flex: 1, marginLeft: 8 })}" },
]);

// 8. Fix style arrays in ChefProfileScreen and CustomerProfileScreen
modifyFile('src/screens/chef/ChefProfileScreen.js', [
  { target: "style={[styles.logoutBtn, { borderColor: colors.error, marginTop: spacing.stackLg * 2 }]}", replacement: "style={StyleSheet.flatten([styles.logoutBtn, { borderColor: colors.error, marginTop: spacing.stackLg * 2 }])}" },
]);
modifyFile('src/screens/customer/CustomerProfileScreen.js', [
  { target: "style={[styles.logoutBtn, { borderColor: colors.error, marginTop: spacing.stackLg * 2 }]}", replacement: "style={StyleSheet.flatten([styles.logoutBtn, { borderColor: colors.error, marginTop: spacing.stackLg * 2 }])}" },
]);

console.log('Fix script finished!');
