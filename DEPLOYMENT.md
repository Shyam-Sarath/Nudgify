# Nudgify MVP — Deployment Guide

This guide walks you through deploying the Nudgify MVP to production.

## 1. Supabase (Database & Storage)

1. Create a new project on [Supabase](https://supabase.com/).
2. Run the SQL schema script in `backend/src/migrations/001_create_schema.sql` from the Supabase SQL Editor.
3. Get your API Keys from **Project Settings → API**:
   - `Project URL`
   - `anon` public key
   - `service_role` secret key (Requires bypass RLS)
4. Update the `.env` variables for backend and admin with these keys.

### Setting Up Storage Buckets
Run the provided storage script to set up buckets:
```bash
cd backend
node scripts/setup-storage.js
```

## 2. Backend (Railway / Render / Fly.io)

We recommend using [Railway](https://railway.app/).

1. Connect your GitHub repository to Railway.
2. Select the `backend` folder as the root directory (or use the `railway.toml` config).
3. Add the following Environment Variables in Railway:
   - `NODE_ENV=production`
   - `PORT=5000`
   - `SUPABASE_URL=...`
   - `SUPABASE_ANON_KEY=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...` (Use actual service_role key)
   - `JWT_SECRET=your_production_secret`
   - `CORS_ORIGIN=https://your-admin-domain.vercel.app`
4. Deploy the backend and copy the public URL (e.g., `https://nudgify-backend.up.railway.app`).

## 3. Admin Dashboard (Vercel)

We recommend using [Vercel](https://vercel.com/).

1. Connect your GitHub repository to Vercel.
2. Select the `admin` folder as the Root Directory.
3. Add the following Environment Variables in Vercel:
   - `NEXT_PUBLIC_API_URL=https://nudgify-backend.up.railway.app`
   - `NEXT_PUBLIC_APP_URL=https://your-admin-domain.vercel.app`
   - `NEXT_PUBLIC_ENVIRONMENT=production`
   - `NEXT_PUBLIC_SUPABASE_URL=...`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY=...`
4. Deploy the admin dashboard.

## 4. Mobile App (Expo / EAS)

1. Ensure you have an Expo account and the EAS CLI installed (`npm install -g eas-cli`).
2. Run `eas login`.
3. cd into `mobile/` and run `eas init` to link the project.
4. Update `mobile/app.config.js` with the correct `eas.projectId`.
5. Run the build:
   ```bash
   eas build --platform all --profile production
   ```
   *(Note: You can override the API URL by setting the `EXPO_PUBLIC_API_URL` environment variable during the EAS build or in `eas.json`)*

## 5. Final Setup (Seed Production DB)

Once everything is deployed, seed your production database:
```bash
cd backend
npm run check-env  # Validate your env vars
npm run seed       # Will use the SUPABASE_URL in your .env
```
