# NUDGIFY MVP - Technology Stack

## Overview
This document outlines the complete technology stack for the Nudgify food marketplace platform, including tools, frameworks, and services selected for the MVP.

---

## Frontend Stack

### Customer Mobile App
- **Framework**: React Native
- **Runtime**: Expo
- **Language**: JavaScript/TypeScript
- **State Management**: Redux Toolkit or Zustand
- **HTTP Client**: Axios
- **Navigation**: React Navigation
- **UI Components**: React Native Paper or Native Base
- **Deployment**: Expo Go / EAS Build

### Chef Mobile App
- **Framework**: React Native
- **Runtime**: Expo
- **Language**: JavaScript/TypeScript
- **State Management**: Redux Toolkit or Zustand
- **HTTP Client**: Axios
- **Navigation**: React Navigation
- **UI Components**: React Native Paper or Native Base
- **Deployment**: Expo Go / EAS Build

### Admin Web Dashboard
- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Library**: Shadcn/ui or Material-UI
- **State Management**: Zustand or TanStack Query
- **Charts**: Recharts or Chart.js
- **Tables**: TanStack Table (React Table)
- **Form Handling**: React Hook Form
- **Deployment**: Vercel

---

## Backend Stack

### API Server
- **Runtime**: Node.js 18+
- **Framework**: Express.js 4.x
- **Language**: JavaScript/TypeScript
- **Port**: 5000 (configurable)

### Middleware & Utilities
- **Authentication**: jsonwebtoken (JWT)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors middleware
- **Request Logging**: morgan
- **Error Handling**: Custom error middleware
- **Validation**: Joi or Zod
- **API Documentation**: Swagger/OpenAPI (optional for MVP)

### Deployment
- **Platform**: Render or Railway
- **Node Version**: 18.x LTS or higher

---

## Database Stack

### Primary Database
- **Type**: PostgreSQL 14+
- **Provider**: Supabase
- **Connection Pool**: pgBouncer (Supabase managed)

### Database Features
- **Migrations**: Supabase CLI or custom migration scripts
- **ORM**: Prisma (recommended) or pg library
- **Authentication DB**: Supabase Auth (JWT-based)

---

## Authentication & Security

### JWT Authentication
- **Library**: jsonwebtoken
- **Algorithm**: HS256 or RS256
- **Token Expiry**: 
  - Access Token: 15 minutes
  - Refresh Token: 7 days

### Password Security
- **Hashing Algorithm**: bcrypt
- **Salt Rounds**: 10

### Environment Variables
- Stored in `.env` file (git-ignored)
- Managed via platform-specific environment configs

---

## Development Tools

### Package Manager
- **npm** 9+ or **yarn** 3+

### Version Control
- **Git**
- **Repository**: GitHub

### Code Quality
- **Linting**: ESLint
- **Formatting**: Prettier
- **Type Checking**: TypeScript

### Testing (Optional for MVP)
- **Unit Tests**: Jest
- **API Testing**: Postman or Insomnia
- **Mobile Testing**: Detox or Appium

---

## Deployment & DevOps

### Hosting Services
| Component | Provider | Service |
|-----------|----------|---------|
| Frontend (Mobile) | Expo | EAS Build & Submission |
| Frontend (Web) | Vercel | Next.js Deployment |
| Backend API | Render / Railway | Node.js Container |
| Database | Supabase | PostgreSQL Managed |

### CI/CD (Future Enhancement)
- GitHub Actions for automated deployments
- Automated testing on pull requests
- Staging environment for testing

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Client Layer                     │
├────────────────────┬────────────────┬───────────────┤
│ Customer App       │ Chef App       │ Admin Web     │
│ (React Native)     │ (React Native) │ (Next.js)     │
└────────────────────┴────────────────┴───────────────┘
                          │
                    ┌─────┴─────┐
                    │   API     │
                    │(Express)  │
                    └─────┬─────┘
                          │
            ┌─────────────┴──────────────┐
            │                            │
       ┌────▼─────┐            ┌────────▼──────┐
       │PostgreSQL│            │Supabase Auth  │
       │Database  │            │(JWT)          │
       └──────────┘            └───────────────┘
```

---

## API Communication

### Base URL
- **Development**: `http://localhost:5000`
- **Production**: `https://nudgify-api.render.com` (or Railway equivalent)

### Request Format
- **Content-Type**: `application/json`
- **Authentication**: Bearer Token in Authorization header

### Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Success message"
}
```

---

## File Structure

```
nudgify/
├── backend/                    # Express API
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── config/
│   ├── .env
│   └── package.json
├── mobile/                     # React Native (Expo)
│   ├── app/
│   ├── src/
│   ├── screens/
│   ├── components/
│   └── package.json
├── admin/                      # Next.js Dashboard
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── package.json
└── docs/
    ├── NUDGIFY_MVP_PRD.md
    └── TECH_STACK.md
```

---

## Environment Configuration

### Backend (.env)
```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
JWT_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
```

### Mobile (.env)
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_API_TIMEOUT=10000
```

### Admin Dashboard (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_APP_NAME=Nudgify
```

---

## Dependencies Summary

### Backend Core
- express: ^4.18.0
- jsonwebtoken: ^9.0.0
- bcryptjs: ^2.4.3
- dotenv: ^16.0.0
- cors: ^2.8.5
- pg: ^8.10.0 (or prisma: ^5.0.0)

### Mobile Core
- react-native: 0.72+
- expo: ^49.0.0
- react-navigation: ^6.0.0
- axios: ^1.4.0

### Admin Dashboard Core
- next: ^14.0.0
- react: ^18.0.0
- tailwindcss: ^3.0.0
- shadcn/ui: latest
- recharts: ^2.8.0

---

## Scalability Considerations

### Current MVP Level
- Single backend instance
- Supabase managed database
- Suitable for 100-1000 concurrent users

### Future Scaling Improvements
- Load balancing with multiple backend instances
- Redis caching layer
- CDN for static assets
- Database read replicas
- Horizontal scaling on Render/Railway

---

## Security Best Practices

✅ Implemented
- JWT-based authentication
- Password hashing with bcrypt
- Environment variable management
- CORS configuration
- HTTP-only cookies (for refresh tokens)

🔄 Recommended for Production
- Rate limiting
- SQL injection prevention (via ORM)
- XSS protection
- CSRF tokens
- API key rotation
- Audit logging
- Data encryption at rest
- SSL/TLS certificates

---

## Monitoring & Logging (Future Enhancement)

- **Error Tracking**: Sentry
- **Performance Monitoring**: New Relic or DataDog
- **Log Aggregation**: LogRocket or Papertrail
- **Uptime Monitoring**: UptimeRobot

---

## Backup & Disaster Recovery

- **Database Backups**: Supabase automated daily backups
- **Code Backups**: GitHub repository
- **Infrastructure as Code**: Docker configurations (future)

---

## License & Attribution
This tech stack is optimized for MVP development and can be adjusted based on team preferences and specific requirements.
