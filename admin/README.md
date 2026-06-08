# Nudgify Admin Dashboard

Next.js admin dashboard for the Nudgify food marketplace platform.

## Features

✅ **Dashboard Overview**
- Real-time platform statistics
- Daily analytics with charts
- Revenue tracking

✅ **Customer Management**
- View all customers
- Search and filter
- Customer activity tracking

✅ **Chef Management**
- View all chefs
- Disable/manage chef accounts
- Performance metrics

✅ **Order Management**
- Real-time order tracking
- Filter by status
- Order details and history

✅ **Analytics**
- Daily orders chart
- Revenue trends
- Performance metrics
- 30-day analytics

## Setup Instructions

### 1. Prerequisites
- Node.js 18+ installed
- npm or yarn
- Running backend API (see backend README)

### 2. Installation

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.local.example .env.local

# Update .env.local with your backend URL
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 3. Running the Dashboard

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

The dashboard will run on `http://localhost:3000`

## Project Structure

```
admin/
├── app/
│   ├── layout.js                 # Root layout
│   ├── page.js                   # Home page
│   ├── globals.css               # Global styles
│   ├── login/
│   │   └── page.js               # Login page
│   ├── dashboard/
│   │   └── page.js               # Dashboard overview
│   ├── customers/
│   │   └── page.js               # Customers list
│   ├── chefs/
│   │   └── page.js               # Chefs management
│   ├── orders/
│   │   └── page.js               # Orders tracking
│   └── analytics/
│       └── page.js               # Analytics & reports
├── components/
│   ├── Sidebar.js                # Navigation sidebar
│   ├── StatCard.js               # Statistics card component
│   └── Table.js                  # Data table component
├── lib/
│   ├── api.js                    # Axios API client
│   └── store.js                  # Zustand state management
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
└── .gitignore
```

## Pages

### Login (`/login`)
- Admin authentication
- JWT token management
- Session handling

### Dashboard (`/dashboard`)
- Platform overview
- Real-time statistics
- Revenue tracking
- Daily analytics chart

### Customers (`/customers`)
- List all customers
- Search by name or email
- View customer details

### Chefs (`/chefs`)
- List all chefs
- Cuisine type information
- Ratings and performance
- Disable chef accounts

### Orders (`/orders`)
- View all orders
- Filter by status (pending, accepted, rejected, completed)
- Customer and chef information
- Order amounts and dates

### Analytics (`/analytics`)
- 30-day daily orders chart
- Revenue trend analysis
- Summary statistics
- Average revenue per day

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Nudgify Admin Dashboard
```

## Key Components

### Sidebar Component
Navigation with all main sections and user info.

### StatCard Component
Displays statistics with icons and trends.

### Table Component
Reusable data table with search and filtering capabilities.

## State Management

Uses Zustand for lightweight state management:
- `useAuthStore` - User authentication and session
- `useDashboardStore` - Dashboard statistics

## API Integration

All API calls go through `lib/api.js` which handles:
- JWT token injection
- Automatic redirect on 401
- Request/response interceptors
- Error handling

## Styling

- **Tailwind CSS** for utility-first styling
- **Lucide React** for icons
- **Recharts** for data visualization

## Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Manual Deployment
```bash
npm run build
# Deploy the .next folder to your hosting provider
```

## Testing

1. Register an admin account via backend:
```bash
POST http://localhost:5000/api/auth/register
{
  "name": "Admin",
  "email": "admin@nudgify.com",
  "password": "admin123",
  "role": "admin"
}
```

2. Login to dashboard with admin credentials

## Features in Development

- [ ] Real-time notifications
- [ ] Export reports to PDF
- [ ] Advanced filtering options
- [ ] User activity logs
- [ ] Platform settings configuration

## License
MIT

## Support

For issues or feature requests, contact the development team.
