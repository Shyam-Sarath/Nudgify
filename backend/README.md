# Nudgify Backend API

Express.js backend for the Nudgify food marketplace platform.

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL 14+ (or Supabase account)
- npm or yarn package manager

### 2. Installation

```bash
# Install dependencies
npm install

# Create .env file from template
cp .env.example .env

# Update .env with your database credentials
```

### 3. Database Setup

#### Option A: Local PostgreSQL
```bash
# Create database
createdb nudgify_db

# Update .env with:
DATABASE_URL=postgresql://postgres:password@localhost:5432/nudgify_db

# Run migrations
npm run migrate
```

#### Option B: Supabase
1. Create a Supabase project at https://supabase.com
2. Copy the connection string to `DATABASE_URL` in .env
3. Run the SQL from `src/migrations/001_create_schema.sql` in Supabase SQL editor

### 4. Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Chef Routes
- `GET /api/chef/profile` - Get chef profile
- `PUT /api/chef/profile` - Update chef profile
- `GET /api/chef/dishes` - Get all dishes
- `POST /api/chef/dishes` - Create new dish
- `PUT /api/chef/dishes/:dishId` - Update dish
- `DELETE /api/chef/dishes/:dishId` - Delete dish
- `GET /api/chef/orders` - Get orders
- `PUT /api/chef/orders/:orderId/accept` - Accept order
- `PUT /api/chef/orders/:orderId/reject` - Reject order
- `PUT /api/chef/orders/:orderId/complete` - Mark order complete
- `GET /api/chef/dashboard` - Get dashboard stats

### Customer Routes
- `GET /api/customer/profile` - Get profile
- `PUT /api/customer/profile` - Update profile
- `GET /api/customer/chefs` - Browse all chefs
- `GET /api/customer/chefs/:chefId` - Get chef details
- `GET /api/customer/dishes` - Browse all dishes
- `GET /api/customer/dishes/:dishId` - Get dish details

### Dish Routes
- `GET /api/dish` - Get all dishes
- `GET /api/dish/:id` - Get dish by ID
- `GET /api/dish/search/:query` - Search dishes

### Order Routes
- `POST /api/order` - Place new order
- `GET /api/order/:orderId` - Get order details
- `GET /api/order/customer/history` - Get customer order history
- `GET /api/order/chef/all` - Get chef orders

### Admin Routes
- `GET /api/admin/dashboard` - Get admin dashboard
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:userId` - Get user details
- `PUT /api/admin/users/:userId/disable` - Disable user
- `GET /api/admin/chefs` - Get all chefs
- `GET /api/admin/chefs/:chefId` - Get chef details
- `GET /api/admin/orders` - Get all orders
- `GET /api/admin/analytics/daily` - Get daily analytics

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/dbname
JWT_SECRET=your_secret_key
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CORS_ORIGIN=*
```

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database connection
│   ├── controllers/
│   │   ├── authController.js    # Auth logic
│   │   ├── chefController.js    # Chef logic
│   │   ├── customerController.js # Customer logic
│   │   ├── dishController.js    # Dish logic
│   │   ├── orderController.js   # Order logic
│   │   └── adminController.js   # Admin logic
│   ├── middleware/
│   │   ├── auth.js              # JWT verification
│   │   └── errorHandler.js      # Error handling
│   ├── routes/
│   │   ├── auth.js
│   │   ├── chef.js
│   │   ├── customer.js
│   │   ├── dish.js
│   │   ├── order.js
│   │   └── admin.js
│   ├── migrations/
│   │   └── 001_create_schema.sql # Database schema
│   └── index.js                 # Server entry point
├── package.json
├── .env.example
└── .gitignore
```

## Testing with Postman

1. **Register a Customer**
   ```
   POST http://localhost:5000/api/auth/register
   {
     "name": "John Doe",
     "email": "john@example.com",
     "password": "password123",
     "role": "customer"
   }
   ```

2. **Register a Chef**
   ```
   POST http://localhost:5000/api/auth/register
   {
     "name": "Chef Maria",
     "email": "maria@example.com",
     "password": "password123",
     "role": "chef"
   }
   ```

3. **Login**
   ```
   POST http://localhost:5000/api/auth/login
   {
     "email": "maria@example.com",
     "password": "password123"
   }
   ```

4. **Create Dish** (Use token from login)
   ```
   POST http://localhost:5000/api/chef/dishes
   Header: Authorization: Bearer <token>
   {
     "name": "Margherita Pizza",
     "description": "Fresh mozzarella and basil",
     "price": 12.99,
     "category": "Italian",
     "availability": true
   }
   ```

## Next Steps

1. Set up the Mobile Apps (React Native + Expo)
2. Set up the Admin Dashboard (Next.js)
3. Configure authentication with Supabase
4. Deploy to production (Render/Railway)

## License
MIT
