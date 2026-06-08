# NUDGIFY MVP - FINAL PRD & TECH STACK

## Project Vision
Nudgify is a home-chef marketplace platform that connects customers with independent chefs through a mobile application while providing administrators with a web dashboard to monitor platform activity, chefs, customers, dishes, and orders.

The goal of this project is to demonstrate a complete software ecosystem involving mobile development, authentication, database design, role-based access control, analytics, and administration.

---

# User Roles

## Customer
Customers use the mobile application to discover chefs and order food.

### Features

- Register
- Login
- Logout
- Browse chefs
- View chef profiles
- Browse dishes
- View dish details
- Place orders
- View order history
- Manage profile

---

## Chef
Chefs use the same mobile application but access chef-specific functionality.

### Features

- Register as Chef
- Login
- Logout
- Manage Profile
- Add Dishes
- Edit Dishes
- Delete Dishes
- Manage Menu
- View Orders
- Accept Orders
- Reject Orders
- Mark Orders Completed
- View Earnings Summary

---

## Admin
Admins use a web dashboard.

### Features

- View Customers
- View Chefs
- View Orders
- View Analytics
- Monitor Platform Activity
- Disable Chef Accounts
- Manage Platform Data

---

# Core Modules

## Authentication Module

### Customer Authentication

- Sign Up
- Login
- Logout

### Chef Authentication

- Sign Up
- Login
- Logout

### Admin Authentication

- Secure Login

---

## Customer Module

### Browse Chefs
Customer can:

- View available chefs
- Search chefs
- View chef profile

### Chef Profile Information

- Name
- Bio
- Cuisine Type
- Profile Image

---

### Browse Food
Customer can:

- View menu
- View food details
- View pricing

Food Details:

- Dish Name
- Description
- Price
- Availability Status
- Dish Image

---

### Place Orders
Customer can:

- Select dishes
- Select quantity
- Confirm order

Order Status:

- Pending
- Accepted
- Rejected
- Completed

---

### Order History
Customer can:

- View previous orders
- Track order status

---

## Chef Module

### Profile Management
Chef can update:

- Name
- Profile Picture
- Bio
- Cuisine Type

---

### Menu Management
Chef can:

- Add Dish
- Edit Dish
- Delete Dish
- Mark Dish Available/Unavailable

---

### Order Management
Chef can:

- View Incoming Orders
- Accept Orders
- Reject Orders
- Complete Orders

---

### Earnings Dashboard
Chef can view:

- Total Orders
- Revenue
- Completed Orders

---

## Admin Dashboard

### Dashboard Overview
Display:

- Total Customers
- Total Chefs
- Total Orders
- Revenue

---

### Customer Management
Admin can:

- View Customers
- View Activity

---

### Chef Management
Admin can:

- View Chefs
- View Performance
- Disable Accounts

---

### Order Analytics
Admin can view:

- Orders Per Day
- Orders Per Chef
- Popular Dishes
- Platform Statistics

---

# Database Design

## Users
Fields:

- id
- full_name
- email
- phone
- role
- created_at

Roles:

- customer
- chef
- admin

---

## Chef Profiles
Fields:

- id
- user_id
- bio
- cuisine_type
- profile_image
- is_active

Relationship:

User → Chef Profile

One-to-One

---

## Dishes
Fields:

- id
- chef_id
- name
- description
- price
- image_url
- availability

Relationship:

Chef → Dishes

One-to-Many

One Chef can have many Dishes.

---

## Orders
Fields:

- id
- customer_id
- chef_id
- total_amount
- status
- created_at

Relationship:

Customer → Orders

One-to-Many

Chef → Orders

One-to-Many

---

## Order Items
Fields:

- id
- order_id
- dish_id
- quantity
- price

Relationship:

Order → Order Items

One-to-Many

---

# Final Technology Stack

## Mobile Application
Framework:

- React Native

Tooling:

- Expo

Navigation:

- Expo Router

State Management:

- Zustand

Purpose:

- Customer Portal
- Chef Portal

Single Application

Role-based UI

---

## Admin Dashboard
Framework:

- Next.js

Purpose:

- Analytics
- Customer Management
- Chef Management
- Order Monitoring

Charts:

- Recharts

Deployment:

- Vercel

---

## Backend Services
Platform:

- Supabase

Services Used:

### Authentication
Supabase Auth

Handles:

- Registration
- Login
- Sessions

---

### Database
PostgreSQL (Supabase)

Stores:

- Users
- Chefs
- Dishes
- Orders
- Order Items

---

### File Storage
Supabase Storage

Stores:

- Chef Images
- Dish Images

---

## Database Engine
PostgreSQL

Reason:

- Relational Data
- Strong Relationships
- Industry Standard

---

## Deployment

### Mobile App
Expo

### Admin Dashboard
Vercel

### Backend Services
Supabase

---

# Features Removed From MVP
The following are intentionally excluded:

- Real Payment Gateway
- Live Delivery Tracking
- Maps Integration
- Real-time Chat
- Push Notifications
- AI Recommendations
- Corporate Partnerships
- Employee Discounts
- Loyalty Programs
- Subscription Plans

---

# Success Criteria
Project is successful when:

1. Customer can register and login.
2. Chef can register and manage dishes.
3. Customer can place orders.
4. Chef can manage orders.
5. Admin dashboard displays analytics.
6. Data persists in PostgreSQL.
7. Images upload successfully.
8. Application is deployed online.
9. End-to-end flow works without manual intervention.

---

# Resume Description
Built a full-stack food marketplace platform connecting customers and home chefs using React Native, Next.js, Supabase, PostgreSQL, authentication, role-based access control, analytics dashboards, and cloud storage.
