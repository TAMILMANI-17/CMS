# MongoDB Database Connection Guide

## Connection Configuration

The backend uses **MongoDB Atlas** (cloud MongoDB) with **Mongoose** as the ODM (Object Document Mapper).

### Connection Details

**Location**: `backend/src/app.module.ts`

```typescript
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    uri: configService.get<string>(
      'MONGODB_URI',
      'mongodb+srv://techadmin:2oV4Gqj4egrbvdvevbevbevvo39ZtAtY@pepagora.xi1kwl.mongodb.net/?retryWrites=true&w=majority&appName=Pepagora',
    ),
    dbName: configService.get<string>('DB_NAME', 'CMS'),
  }),
  inject: [ConfigService],
}),
```

### Connection String Breakdown

```
mongodb+srv://techadmin:2oV4Gqj4egrbvdvevbevbevvo39ZtAtY@pepagora.xi1kwl.mongodb.net/?retryWrites=true&w=majority&appName=Pepagora
```

- **Protocol**: `mongodb+srv://` (MongoDB Atlas connection)
- **Username**: `techadmin`
- **Password**: `2oV4Gqj4egrbvdvevbevbevvo39ZtAtY`
- **Cluster**: `pepagora.xi1kwl.mongodb.net`
- **Database**: `CMS` (specified separately via `dbName`)
- **Options**:
  - `retryWrites=true` - Automatic retry for write operations
  - `w=majority` - Write concern (wait for majority of replicas)
  - `appName=Pepagora` - Application identifier

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://techadmin:2oV4Gqj4egrbvdvevbevbevvo39ZtAtY@pepagora.xi1kwl.mongodb.net/?retryWrites=true&w=majority&appName=Pepagora
DB_NAME=CMS

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_ACCESS_TOKEN_EXPIRATION=15m
JWT_REFRESH_TOKEN_EXPIRATION=7d

# Server Configuration
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

### Database Structure

**Database Name**: `CMS`

**Collections**:
1. **`users`** - User accounts
   - Fields: firstName, lastName, username, email, password, role, location, etc.
   - Indexes: username (unique), email (unique)

2. **`roles`** - Role definitions
   - Fields: name, description, features (array of ObjectIds)
   - Indexes: name (unique)

3. **`features`** - Feature definitions
   - Fields: name, description
   - Indexes: name (unique)

### Auto-Initialization

On first run, the application automatically:

1. **Connects to MongoDB Atlas**
2. **Creates collections** (if they don't exist)
3. **Initializes 10 features** (feature_1 to feature_10)
4. **Initializes 4 roles** with feature mappings:
   - `super_admin` → All 10 features
   - `admin` → First 8 features
   - `employee` → First 4 features
   - `user` → Only feature_1

### Connection Status

When you start the backend, you should see:

```
Application is running on: http://localhost:3001
```

If the connection fails, you'll see an error message. Common issues:

1. **Network/Firewall**: MongoDB Atlas requires IP whitelisting
2. **Credentials**: Wrong username/password
3. **Database Access**: User doesn't have permissions

### Testing the Connection

1. **Start the backend**:
```bash
cd backend
npm run start:dev
```

2. **Check console output** - Should show "Application is running"

3. **Test an endpoint**:
```bash
curl http://localhost:3001/auth/signup
```

4. **Check MongoDB Atlas Dashboard**:
   - Log into MongoDB Atlas
   - Navigate to your cluster
   - Check the "Collections" tab
   - You should see `CMS` database with `users`, `roles`, and `features` collections

### Connection Options

The connection uses these Mongoose options:

- **Automatic reconnection**: Mongoose handles reconnection automatically
- **Connection pooling**: Default pool size (10 connections)
- **Timeout**: Default connection timeout

### Security Notes

⚠️ **Important**: 
- The connection string contains credentials
- Store it in `.env` file (not in code)
- Add `.env` to `.gitignore`
- Use environment variables in production
- Consider using MongoDB Atlas IP whitelisting for additional security

### Troubleshooting

**Connection Error: "MongoServerError: bad auth"**
- Check username/password in connection string
- Verify user has database access permissions

**Connection Error: "MongoNetworkError"**
- Check internet connection
- Verify IP is whitelisted in MongoDB Atlas
- Check firewall settings

**Connection Timeout**
- Check network connectivity
- Verify MongoDB Atlas cluster is running
- Check connection string format

### Production Recommendations

1. **Use environment variables** for connection string
2. **Enable MongoDB Atlas monitoring**
3. **Set up connection pooling** for high traffic
4. **Use read preferences** for replica sets
5. **Enable SSL/TLS** (already enabled with `mongodb+srv://`)
6. **Set up database backups**
7. **Monitor connection pool usage**

