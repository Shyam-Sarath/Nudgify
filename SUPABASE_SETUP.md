# Supabase Setup Guide for Nudgify

## Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Create a new project named "Nudgify"
4. Choose a password for the database admin
5. Select your region
6. Wait for project to initialize

## Step 2: Get Credentials

Once project is created, navigate to:
- **Settings > API** to find:
  - `SUPABASE_URL` - Your project URL
  - `SUPABASE_ANON_KEY` - Anon public key
  - `SUPABASE_SERVICE_ROLE_KEY` - Service role key (admin)

## Step 3: Run Database Migrations

1. Go to **SQL Editor** in Supabase dashboard
2. Create a new query
3. Copy and paste the entire content of `backend/src/migrations/001_create_schema.sql`
4. Click "Run"

This will create:
- `users` table
- `chef_profile` table
- `dishes` table
- `orders` table
- `order_items` table
- All necessary indexes

## Step 4: Set Up Authentication

1. Go to **Authentication > Providers**
2. Enable "Email" provider (already enabled by default)
3. Go to **Authentication > Email Templates**
4. Customize confirmation email if needed
5. Go to **Authentication > Policies**
6. Create RLS (Row Level Security) policies

### Email Configuration (Optional)
- Go to **Authentication > Email**
- Configure SMTP settings for custom emails

## Step 5: Set Up Storage Buckets

1. Go to **Storage** in sidebar
2. Create two public buckets:
   - `chef-images` - For chef profile pictures
   - `dish-images` - For dish photos

3. Set public access for both buckets
4. Configure CORS if needed

## Step 6: Environment Variables

Create `.env.local` in backend and admin directories with:

### Backend `.env.local`
```
SUPABASE_URL=your_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_ANON_KEY=your_anon_key
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development
```

### Admin `.env.local`
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 7: Test Connection

Run backend:
```bash
cd backend
npm install
npm run dev
```

The server should connect to Supabase without errors.

## Database Schema Overview

### Users Table
- `id` - Primary key
- `full_name` - User's name
- `email` - Unique email
- `phone` - Phone number
- `role` - 'customer' | 'chef' | 'admin'
- `created_at` - Timestamp

### Chef Profiles (One-to-One with Users)
- `id` - Primary key
- `user_id` - Foreign key to users
- `bio` - Chef bio
- `cuisine_type` - Specialty cuisine
- `profile_image` - URL from storage
- `is_active` - Active status

### Dishes (One-to-Many with Chef)
- `id` - Primary key
- `chef_id` - Foreign key to users (chef)
- `name` - Dish name
- `description` - Dish description
- `price` - Dish price
- `image_url` - URL from storage
- `availability` - Available status

### Orders (One-to-Many)
- `id` - Primary key
- `customer_id` - Foreign key to users (customer)
- `chef_id` - Foreign key to users (chef)
- `total_amount` - Order total
- `status` - 'pending' | 'accepted' | 'rejected' | 'completed'
- `created_at` - Timestamp

### Order Items (One-to-Many with Orders)
- `id` - Primary key
- `order_id` - Foreign key to orders
- `dish_id` - Foreign key to dishes
- `quantity` - Item quantity
- `price` - Price at time of order

## RLS Policies (Row Level Security)

### Users Table
- Authenticated users can only read their own profile
- Public can create new users during signup

### Chef Profiles
- Public can read all active chef profiles
- Chef can only update their own profile

### Dishes
- Public can read all available dishes
- Chef can only create/update/delete their own dishes

### Orders
- Customer can only read/create their own orders
- Chef can read orders where they are the chef
- Admin can read all orders

### Order Items
- Customer can read items in their orders
- Chef can read items in their orders

## Troubleshooting

### Connection Timeout
- Check SUPABASE_URL is correct
- Verify internet connection
- Check firewall/VPN settings

### Auth Errors
- Verify SUPABASE_ANON_KEY is correct
- Check email exists in users table
- Clear browser cache and cookies

### Storage Upload Errors
- Verify bucket names are correct
- Check file size limits
- Ensure bucket is public

