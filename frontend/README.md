# CMS Frontend

Production-ready authentication and authorization system frontend built with Next.js 16 (App Router), TypeScript, and Redux Toolkit.

## Features

- User authentication (Login/Signup)
- JWT token management with refresh tokens
- Role-based access control (RBAC)
- Feature-based access control
- Protected routes
- Responsive UI with Tailwind CSS
- **Redux Toolkit** for state management (standard Redux patterns)
- Next.js 16 with React 19

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file (optional, defaults are set):
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable React components
│   ├── auth/        # Authentication components
│   ├── guards/      # Route/feature guards
│   └── ui/          # UI components
├── lib/             # Utility libraries (API client)
├── store/           # Redux store and slices
│   ├── slices/     # Redux slices (authSlice)
│   └── hooks.ts    # Typed Redux hooks
├── providers/       # React providers (ReduxProvider)
└── types/           # TypeScript type definitions
```

## Available Roles

- `super_admin` - All 10 features
- `admin` - First 8 features
- `employee` - First 4 features
- `user` - Only feature_1

