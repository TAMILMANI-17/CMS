# Environment Variables Setup

## Required: Create `.env` file

Create a `.env` file in the `backend/` directory with the following variables:

```env
# MongoDB Connection (REQUIRED)
MONGODB_URI=mongodb+srv://techadmin:2oV4Gqj4egrbvdvevbevbevvo39ZtAtY@pepagora.xi1kwl.mongodb.net/?retryWrites=true&w=majority&appName=Pepagora
DB_NAME=CMS

# JWT Configuration (REQUIRED)
JWT_SECRET=your-super-secret-jwt-key-change-in-production-min-32-characters
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Important Notes

1. **MONGODB_URI is now REQUIRED** - The application will throw an error if it's not set
2. **Never commit `.env` file** - It's already in `.gitignore`
3. **Use different values for production** - Never use development credentials in production

## Quick Setup

1. Copy the content above
2. Create `.env` file in `backend/` directory
3. Paste and save
4. Start the application: `npm run start:dev`

## Error Handling

If `MONGODB_URI` is missing, you'll see:
```
Error: MONGODB_URI is not defined in environment variables. Please set it in your .env file.
```

This ensures you always use environment variables and never accidentally use hardcoded credentials.

