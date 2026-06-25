# Nudgify Mobile App — AI Context

This document serves as a high-level technical overview of the Nudgify mobile application (React Native / Expo) to help AI agents and LLMs quickly understand the codebase architecture, patterns, and state management.

## Tech Stack
- **Framework**: React Native with Expo SDK 56.
- **Routing**: React Navigation (Stack and Tab Navigators).
- **State Management**: Zustand (Global state).
- **Storage**: AsyncStorage (Persisting Zustand stores like Auth via `persist` middleware).
- **API Client**: Axios with interceptors.
- **Fonts**: `@expo-google-fonts/inter` and `@expo-google-fonts/manrope`.

---

## Core Architecture

### 1. Navigation (`src/navigation/`)
Navigation is strictly role-based and dynamically rendered in `App.js` based on the user's authentication state:
- `AuthNavigator`: For unauthenticated users — `LoginScreen`, `RegisterScreen`.
- `CustomerNavigator`: For `customer` role — Home, Search, Orders, Cart, Checkout, Profile (5-tab bottom nav).
- `ChefNavigator`: For `chef` role — Dashboard, Menu, Orders, Profile (4-tab bottom nav).

### 2. State Management (`src/store/store.js`)
Three Zustand stores:
- **`useAuthStore`**: Manages `user` (object), `token` (string), `isAuthenticated` (bool). Uses `persist` middleware with AsyncStorage so users stay logged in across app restarts. Exposes `setAuth(user, token)` and `logout()`.
- **`useCartStore`**: Manages `cart` (array of dish items), `chefId`. A customer can only order from **one chef at a time** — adding from a different chef clears the cart. Exposes `addToCart`, `removeFromCart`, `clearCart`.
- **`useDataStore`**: Lightweight caching layer for `chefs`, `dishes`, `orders` arrays. Exposes `setChefs`, `setDishes`, `setOrders`.

### 3. API Client (`src/config/api.js`) ← CRITICAL PATTERN
All HTTP requests MUST go through `apiClient` (Axios instance). **Never use raw `fetch()` or create a second axios instance.**

- **Dynamic Base URL**: Auto-resolves `localhost` → `10.0.2.2` on Android Emulator.
- **Request Interceptor**: Automatically pulls `token` from `useAuthStore.getState().token` and injects `Authorization: Bearer <token>` header. **Screens must NOT manually set this header.**
- **Response Interceptor**: Auto-catches `401 Unauthorized` and calls `useAuthStore.getState().logout()` to force re-login.
- **Timeout**: 10 seconds.

### 4. Theming System (`src/theme/`)
Centralized theme via `ThemeProvider` context. Always use:
```js
const { colors, spacing, radius, typography, icons } = useTheme();
```
- **Colors**: `colors.primary`, `colors.secondary`, `colors.background`, `colors.text`, `colors.mutedText`, `colors.error`, `colors.surface`, `colors.surfaceContainerLow`, `colors.border`
- **Typography**: `typography.fontFamilies.heading`, `.primary`, `.primaryBold`, `.primaryMedium` / `typography.sizes.sm`, `.xs`, `.lg`
- **Spacing**: `spacing.containerPaddingMobile`, `spacing.stackLg`, `spacing.stackXl`, `spacing.stackMd`, `spacing.stackSm`, `spacing.unit`
- **Radius**: `radius.full`, `radius.default`, `radius.sm`, `radius.lg`

### 5. Shared Components (`src/components/`)
- **UI** (`src/components/ui/`): `Button`, `Input`, `SearchBar`, `Card`, `Badge`, `Chip`, `Avatar`, `Modal`, `BottomSheet`, `Toast`, `Skeleton`, `EmptyState`, `Divider`, `ErrorState`, `Header`
- **Business** (`src/components/business/`): `CartItem`, `ChefCard`, `DishCard`, `MenuSection`, `NotificationCard`, `OrderCard`, `ProfileHeader`, `StatCard`

All components exported from `src/components/index.ts`.

---

## Key Features Implemented

### Customer App
- **Home Screen**: Swiggy-style discovery feed with:
  - Auto-scrolling hero banner carousel (3 banners, 3.5s interval)
  - Category filter chips (All, Veg, Non-Veg, Desserts, Fast Food, Healthy)
  - Featured Chefs horizontal scroll
  - Fresh Dishes grid (single API call to `/api/customer/dishes`)
  - **Sticky Cart Preview Bar** at bottom (shows count + total, navigates to Cart)
- **Search Screen**: Live API search with:
  - Debounced input (400ms delay)
  - Tab switch between Dishes and Chefs views
  - Category chip filtering
  - Real data from `/api/customer/dishes` and `/api/customer/chefs`
- **Cart Screen**: Full fee breakdown:
  - Subtotal + Delivery Fee ($4.50) + Tax (8%) + Grand Total
  - Clear Cart button with confirmation
  - "Repeat Last Order" placeholder button
- **Checkout Screen**: 
  - Delivery Address field
  - Delivery Instructions field (passed as `specialInstructions` to backend)
  - Payment method selector
  - "Slide to Confirm" gesture (PanResponder + Animated)
- **Chef Profile**: View chef info, dishes, add to cart
- **Orders**: History with status badges, pull-to-refresh

### Chef App
- **Dashboard**: 
  - Welcome header with chef name
  - **Pending Orders Alert Banner** (shown when pending count > 0)
  - Bento stat cards (earnings, new orders, rating)
  - Live Orders section (accept/reject/complete)
  - Weekly performance bar chart (visual only, estimated)
- **Menu (Dish Management)**: Add, toggle availability, delete dishes
- **Orders**: Full order list with status management

---

## Backend API Routes (Base URL: `http://localhost:5001`)

### Auth
- `POST /api/auth/register` — `{ name, email, password, role }`
- `POST /api/auth/login` — `{ email, password }` → `{ user, token }`
- `POST /api/auth/logout`

### Customer
- `GET /api/customer/chefs` — List active chefs
- `GET /api/customer/chefs/:chefId` — Chef detail with dishes
- `GET /api/customer/dishes` — All available dishes
- `GET /api/customer/profile` (auth)
- `PUT /api/customer/profile` (auth) — `{ name }`

### Orders
- `POST /api/order` (auth, customer) — `{ chefId, items, deliveryAddress, specialInstructions }` ← Backend validates prices
- `GET /api/order/customer` (auth, customer)
- `GET /api/order/chef` (auth, chef)

### Chef
- `GET /api/chef/profile` (auth, chef)
- `PUT /api/chef/profile` (auth, chef) — `{ bio, cuisine_type }`
- `GET/POST /api/chef/dishes` (auth, chef)
- `PUT/DELETE /api/chef/dishes/:dishId` (auth, chef)
- `GET /api/chef/dashboard` (auth, chef)
- `PUT /api/chef/orders/:orderId/accept|reject|complete` (auth, chef)

---

## Security & Business Logic

### Server-Side Price Validation (CRITICAL)
The `POST /api/order` endpoint **recalculates the total server-side** from real DB prices. The client's `totalAmount` is ignored. This prevents price tampering.

Formula: `total = subtotal + $4.50 delivery + 8% tax`

### JWT
- Expiry: `7d` (set in `backend/.env`)
- No refresh tokens — session is valid for 7 days
- Expired tokens: auto-logout via Axios response interceptor

---

## Anti-Patterns to Avoid

1. **Never manually inject Authorization headers** — `apiClient` interceptors handle it.
2. **Never loop API calls** — Use bulk endpoints like `/api/customer/dishes` instead of per-chef calls.
3. **Never put raw strings in Views** — All strings must be wrapped in `<Text>`.
4. **Never create a second axios instance** — Always import from `../../config/api`.
5. **Never calculate order totals on the client for storage** — Backend is the source of truth for pricing.
