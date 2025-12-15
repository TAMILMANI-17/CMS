# CMS - Authentication & Authorization System

A production-ready full-stack authentication and authorization system built with Next.js and NestJS.

## 🏗️ Architecture

- **Frontend**: Next.js 16 (App Router) + TypeScript + Tailwind CSS + Redux Toolkit
- **Backend**: NestJS + TypeScript + MongoDB + Mongoose
- **Authentication**: JWT (Access Token + Refresh Token)
- **Password Security**: bcrypt
- **State Management**: Redux Toolkit

## 📁 Project Structure

```
.
├── backend/          # NestJS backend application
├── frontend/         # Next.js frontend application
└── README.md         # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MongoDB (or MongoDB Atlas connection)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in `backend/` directory:
```env
MONGODB_URI=mongodb+srv://techadmin:2oV4Gqj4egrbvdvevbevbevvo39ZtAtY@pepagora.xi1kwl.mongodb.net/?retryWrites=true&w=majority&appName=Pepagora
DB_NAME=CMS

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

PORT=3001
NODE_ENV=development
```

5. Run the backend:
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

**Note**: Next.js 16 requires React 19. The package.json has been updated accordingly.

**State Management**: The frontend uses Redux Toolkit with:
- Typed hooks (`useAppDispatch`, `useAppSelector`)
- Async thunks for API calls
- Middleware for token persistence
- Standard Redux patterns throughout

## 🔐 Authentication Features

### Signup
- First name, last name
- Unique username
- Unique email
- Password with validation
- Date of birth (optional)
- Phone number (optional)
- Location (country, state, city, pincode - optional)
- Role selection (super_admin, admin, employee, user)

### Login
- Login with username OR email
- Password authentication
- JWT access token (15 minutes)
- Refresh token (7 days, stored in HttpOnly cookie)

## 🎯 Authorization System

### Roles & Features

The system includes 10 features (feature_1 to feature_10) with role-based access:

- **super_admin**: All 10 features
- **admin**: First 8 features (feature_1 to feature_8)
- **employee**: First 4 features (feature_1 to feature_4)
- **user**: Only feature_1

### Guards & Decorators

**Backend:**
- `@Public()` - Make endpoint publicly accessible
- `@Roles(...roles)` - Require specific roles
- `@Features(...features)` - Require specific features
- `@CurrentUser()` - Get current authenticated user

**Frontend:**
- `<RoleGuard roles={[...]}>` - Protect components by role
- `<FeatureGuard features={[...]}>` - Protect components by feature

## 📡 API Endpoints

### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/profile` - Get current user profile (protected)

## 🛡️ Security Features

- Password hashing with bcrypt (salt rounds: 10)
- JWT tokens with expiration
- HttpOnly cookies for refresh tokens
- Input validation with class-validator
- CORS configuration
- Protected routes middleware

## 🧪 Testing

### Backend
```bash
cd backend
npm run test
npm run test:e2e
```

### Frontend
```bash
cd frontend
npm run test
```

## 📝 Environment Variables

### Backend (.env)
- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name
- `JWT_SECRET` - Secret key for JWT signing
- `JWT_ACCESS_TOKEN_EXPIRATION` - Access token expiration (default: 15m)
- `JWT_REFRESH_TOKEN_EXPIRATION` - Refresh token expiration (default: 7d)
- `PORT` - Server port (default: 3001)
- `NODE_ENV` - Environment (development/production)

## 🔧 Development

### Backend
- Uses TypeORM with automatic schema synchronization (development only)
- Features and roles are auto-initialized on first run
- Hot reload enabled in development mode

### Frontend
- Next.js App Router with TypeScript
- Tailwind CSS for styling
- Zustand for state management
- Axios for API calls with automatic token refresh

## 📚 Additional Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🎨 UI Components

Reusable components available:
- `InputField` - Text input with validation
- `SelectField` - Dropdown select
- `AuthForm` - Shared form for login/signup
- `FeatureGuard` - Feature-based access control
- `RoleGuard` - Role-based access control

## 📄 License

This project is private and proprietary.

