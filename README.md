# Real Estate Map API - Backend

Scalable Node.js backend for a real estate B2B platform with map-centric design.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + Prisma ORM
- **Authentication**: JWT (Bearer tokens)
- **Password Hashing**: Bcrypt
- **File Upload**: Multer (prepared for future use)
- **API Documentation**: Swagger/OpenAPI
- **Code Quality**: ESLint + Prettier

## Project Structure

```
src/
├── modules/           # Feature modules
│   ├── auth/         # Authentication logic
│   ├── company/      # Company management
│   └── property/     # Property management
├── controllers/      # Request handlers (thin layer)
├── services/         # Business logic
├── routes/           # API route definitions
├── middlewares/      # Express middlewares
├── config/           # Configuration files
├── utils/            # Utility functions
└── index.ts          # Application entry point

prisma/
├── schema.prisma     # Database schema
└── migrations/       # Database migrations

```

## Architecture Principles

1. **Modular Design**: Each endpoint in its own file
2. **Separation of Concerns**: Controllers are thin, services contain logic
3. **Database Abstraction**: Prisma queries only in services
4. **Size Limits**: No file exceeds ~100 lines
5. **Error Handling**: Custom error classes for consistent responses
6. **Type Safety**: Full TypeScript support

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials.

### 3. Setup Database

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. Start Development Server

```bash
npm run dev
```

Server runs on `http://localhost:3000`

## API Features (MVP)

- ✅ Company authentication (register/login)
- ✅ Property registration with geo-data
- ✅ Property status management
- ✅ Filter properties by status
- ✅ Map-ready coordinates (lat/lng)
- ✅ Direct contact fields (WhatsApp/phone)
- ✅ API documentation (Swagger)

## Scripts

- `npm run dev` - Start development server (with hot reload)
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Run production build
- `npm run prisma:migrate` - Create database migrations
- `npm run prisma:studio` - Open Prisma Studio (database UI)
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Next Steps

- Implement authentication module
- Create company endpoints
- Build property CRUD operations
- Add Swagger documentation
