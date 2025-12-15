# Setup Guide

## Step-by-Step Installation

### 1. Database Setup (PostgreSQL)

1. Install PostgreSQL if not already installed
2. Create a new database:
```sql
CREATE DATABASE cms_db;
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in `backend/` directory:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=cms_db

JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-chars
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

PORT=3001
NODE_ENV=development
```

Start the backend:
```bash
npm run start:dev
```

The backend will:
- Connect to PostgreSQL
- Create tables automatically (synchronize: true in development)
- Initialize 10 features (feature_1 to feature_10)
- Initialize 4 roles with their feature mappings

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Testing the System

### 1. Sign Up

1. Navigate to `http://localhost:3000/signup`
2. Fill in the form:
   - First Name: John
   - Last Name: Doe
   - Username: johndoe (must be unique)
   - Email: john@example.com (must be unique)
   - Password: Password123 (min 8 chars, uppercase, lowercase, number)
   - Confirm Password: Password123
   - Role: Select any role (super_admin, admin, employee, or user)
3. Click "Sign Up"

### 2. Login

1. Navigate to `http://localhost:3000/login`
2. Enter username/email and password
3. Click "Login"
4. You'll be redirected to the dashboard

### 3. Dashboard

The dashboard shows:
- User profile information
- Available features based on your role

### 4. Test Feature Access

Try accessing different features based on your role:
- **super_admin**: All 10 features
- **admin**: Features 1-8
- **employee**: Features 1-4
- **user**: Only feature_1

## API Testing with cURL

### Signup
```bash
curl -X POST http://localhost:3001/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "username": "johndoe",
    "email": "john@example.com",
    "password": "Password123",
    "confirmPassword": "Password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "usernameOrEmail": "johndoe",
    "password": "Password123"
  }'
```

### Get Profile (Protected)
```bash
curl -X GET http://localhost:3001/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -b cookies.txt
```

### Refresh Token
```bash
curl -X POST http://localhost:3001/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

## Troubleshooting

### Backend Issues

1. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database `cms_db` exists

2. **Port Already in Use**
   - Change `PORT` in `.env` file
   - Or stop the process using port 3001

3. **JWT Secret Error**
   - Ensure `JWT_SECRET` is at least 32 characters
   - Use a strong, random secret in production

### Frontend Issues

1. **API Connection Error**
   - Verify backend is running on port 3001
   - Check `next.config.js` proxy settings
   - Check browser console for CORS errors

2. **Token Refresh Issues**
   - Clear browser cookies
   - Check that `withCredentials: true` is set in API client
   - Verify refresh token cookie is being set

## Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Set `synchronize: false` in `app.module.ts` (use migrations instead)
3. Use a strong `JWT_SECRET`
4. Set up proper CORS origins
5. Use HTTPS for secure cookie transmission

### Frontend

1. Build the application:
```bash
npm run build
```

2. Set environment variables:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

3. Deploy to Vercel, Netlify, or your preferred hosting

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong passwords in production
- [ ] Enable HTTPS
- [ ] Set secure cookie flags in production
- [ ] Disable database synchronization in production
- [ ] Set up proper CORS origins
- [ ] Implement rate limiting
- [ ] Add input sanitization
- [ ] Set up logging and monitoring
- [ ] Regular security audits

