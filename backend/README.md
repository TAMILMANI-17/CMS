# CMS Backend

Production-ready authentication and authorization system backend built with NestJS, TypeScript, MongoDB, and Mongoose.

## Features

- User registration and authentication
- JWT access tokens and refresh tokens
- Role-based access control (RBAC)
- Feature-based access control
- Password hashing with bcrypt
- Input validation with class-validator
- Modular architecture

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
MONGODB_URI=mongodb+srv://techadmin:2oV4Gqj4egrbvdvevbevbevvo39ZtAtY@pepagora.xi1kwl.mongodb.net/?retryWrites=true&w=majority&appName=Pepagora
DB_NAME=CMS

JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

PORT=3001
NODE_ENV=development
```

4. Run the application:
```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

## API Endpoints

### Authentication
- `POST /auth/signup` - Register a new user
- `POST /auth/login` - Login with username/email and password
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout (clears refresh token)
- `GET /auth/profile` - Get current user profile (protected)

## Project Structure

```
src/
├── auth/            # Authentication module
│   ├── dto/        # Data transfer objects
│   ├── guards/     # Auth guards
│   ├── strategies/ # JWT strategies
│   └── decorators/ # Custom decorators
├── users/          # User management module
├── roles/          # Role management module
├── features/       # Feature management module
└── common/         # Shared entities and utilities
```

## Role and Feature Mapping

- `super_admin` → All 10 features (feature_1 to feature_10)
- `admin` → First 8 features (feature_1 to feature_8)
- `employee` → First 4 features (feature_1 to feature_4)
- `user` → Only feature_1

## Database Schema

The application uses Mongoose with MongoDB. On first run, it will:
1. Connect to MongoDB database (CMS)
2. Create collections automatically (users, roles, features)
3. Initialize 10 features (feature_1 to feature_10)
4. Initialize 4 roles with their feature mappings

**Collections:**
- `users` - User accounts
- `roles` - Role definitions
- `features` - Feature definitions

