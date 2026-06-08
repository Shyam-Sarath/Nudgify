# NUDGIFY MVP - Product Requirements Document (PRD)

## Project Overview
Nudgify is a food marketplace platform connecting home chefs with customers through a mobile application while providing administrators with a centralized web dashboard for monitoring operations, orders, chefs, and customer activity.

This MVP is focused on demonstrating a complete full-stack software ecosystem rather than building a production-ready startup platform.

---

# Objectives

## Primary Goal
Build a multi-role platform consisting of:

1. Customer Mobile App
2. Chef Mobile App
3. Admin Web Dashboard
4. Backend API
5. Database

The platform should allow customers to discover food from home chefs, place orders, and track order history while chefs manage menus and incoming orders.

---

# User Roles

## Customer
A user who browses food and places orders.

### Capabilities

- Register/Login
- Browse chefs
- Browse menus
- View dish details
- Place orders
- View order history
- Manage profile

---

## Chef
A home chef who sells food through the platform.

### Capabilities

- Register/Login
- Create chef profile
- Add dishes
- Edit dishes
- Delete dishes
- Manage menu
- View incoming orders
- Accept/Reject orders
- Mark orders completed
- View earnings summary

---

## Admin
Platform owner.

### Capabilities

- View all users
- View all chefs
- View all orders
- View analytics
- Manage platform data

---

# Core Features

## Authentication Module

### Customer Authentication

- Sign Up
- Login
- Logout

### Chef Authentication

- Sign Up
- Login
- Logout

### Security

- JWT Authentication
- Password Hashing

---

# Customer Module

## Chef Discovery
Customer can:

- Browse available chefs
- Search chefs
- View chef profiles

### Chef Profile Information

- Name
- Description
- Cuisine Type
- Rating (Static MVP)
- Menu Items

---

## Food Browsing
Customer can:

- View menu
- View food details
- View pricing

### Food Details

- Dish Name
- Description
- Price
- Category
- Availability Status

---

## Order Placement
Customer can:

- Select dish
- Specify quantity
- Place order

### Order Status

- Pending
- Accepted
- Rejected
- Completed

---

## Order History
Customer can:

- View previous orders
- View order status

---

# Chef Module

## Chef Profile
Chef can manage:

- Profile Picture
- Bio
- Cuisine Type
- Contact Information

---

## Menu Management
Chef can:

- Add dishes
- Edit dishes
- Delete dishes
- Mark dish unavailable

---

## Order Management
Chef can:

- View orders
- Accept orders
- Reject orders
- Mark completed

---

## Earnings Dashboard
Chef can view:

- Total Orders
- Total Revenue
- Completed Orders

---

# Admin Dashboard

## Overview Dashboard
Display:

- Total Customers
- Total Chefs
- Total Orders
- Revenue Generated

---

## Chef Management
Admin can:

- View chefs
- View chef performance
- Disable chef account

---

## Customer Management
Admin can:

- View customers
- View order activity

---

## Order Analytics
Admin can view:

- Orders per day
- Orders per chef
- Most popular dishes

---

# Database Entities

## User

- id
- name
- email
- password
- role

---

## Chef

- id
- user_id
- bio
- cuisine_type
- profile_image

---

## Dish

- id
- chef_id
- name
- description
- price
- availability

---

## Order

- id
- customer_id
- chef_id
- total_amount
- status
- created_at

---

## Order Item

- id
- order_id
- dish_id
- quantity

---

# Technology Stack

## Mobile App
React Native + Expo

---

## Admin Dashboard
Next.js

---

## Backend
Node.js
Express.js

---

## Database
PostgreSQL

---

## Authentication
JWT

---

## Deployment
Frontend:

- Vercel

Backend:

- Render / Railway

Database:

- Supabase PostgreSQL

---

# Non-MVP Features (Future Scope)
These features are intentionally excluded:

- Live Delivery Tracking
- Google Maps Integration
- Real-Time Chat
- Payment Gateway
- Corporate Partnerships
- Employee Discounts
- AI Recommendations
- Subscription Plans
- Loyalty Programs
- Push Notifications

---

# Success Criteria
The project will be considered successful if:

1. Customer can register and place orders.
2. Chef can manage menus and orders.
3. Admin can monitor platform activity.
4. Data persists in PostgreSQL.
5. Mobile application functions end-to-end.
6. Admin dashboard displays analytics.
7. Application is deployed and accessible online.

---

# Target Outcome
A fully functional full-stack marketplace platform demonstrating:

- Mobile Development
- Backend Development
- Database Design
- Authentication
- Role-Based Access Control
- Dashboard Analytics
- Real-World Software Architecture

Suitable for internship evaluation, portfolio presentation, and technical interviews.
