# Quick Reference - All Endpoints

## Authentication
```
POST /api/auth/register      - Register new company
POST /api/auth/login         - Login and get JWT token
```

## Users (Company Team Members)
```
POST   /api/users              - Create user
GET    /api/users              - List users (paginated, filterable)
GET    /api/users/:userId      - Get user details
PATCH  /api/users/:userId      - Update user
DELETE /api/users/:userId      - Delete user
```

## Properties (Real Estate Listings)
```
POST   /api/properties         - Create property
GET    /api/properties         - List properties (coming in Phase 5)
GET    /api/properties/:id     - Get property details (coming)
PATCH  /api/properties/:id     - Update property status (coming in Phase 4)
DELETE /api/properties/:id     - Delete property (coming)
```

## System
```
GET /api/health              - Health check
GET /api-docs                - Swagger API documentation
```

---

## Authentication Header

All endpoints except `/auth/*` and `/health` require JWT token:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Example:
```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  http://localhost:3000/api/users
```

---

## Quick Start

### 1. Register Company
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Company",
    "email": "admin@company.com",
    "password": "SecurePass123"
  }'
```

### 2. Login
```bash
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "password": "SecurePass123"
  }' | jq -r '.data.token')

echo $TOKEN
```

### 3. Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Doe",
    "email": "john@company.com",
    "role": "agent"
  }'
```

### 4. Create Property
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Downtown Apartment",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "contactPhone": "+1234567890"
  }'
```

### 5. View API Docs
```
Open: http://localhost:3000/api-docs
```

---

## Error Codes

| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing/invalid JWT token |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `BAD_REQUEST` | 400 | Validation error |
| `CONFLICT` | 409 | Resource already exists (e.g., duplicate email) |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Pagination Query Parameters

For endpoints that support pagination:

```bash
GET /api/users?limit=10&offset=0
GET /api/users?limit=25&offset=50&role=manager
```

Response includes:
```json
{
  "users": [...],
  "total": 100,
  "limit": 10,
  "offset": 0,
  "pages": 10
}
```

---

## Database Models

### Company
- id (String)
- name (String, unique)
- email (String, unique)
- password (String, hashed)
- phone (String?)
- whatsapp (String?)
- createdAt, updatedAt

### User
- id (String)
- name (String)
- email (String)
- phone (String?)
- role (String) - default: "agent"
- companyId (FK)
- createdAt, updatedAt
- Constraint: email unique per company

### Property
- id (String)
- title (String)
- description (String?)
- latitude (Float)
- longitude (Float)
- status (Enum) - AVAILABLE, NEGOTIATING, SOLD
- contactPhone (String?)
- contactWhatsApp (String?)
- companyId (FK)
- createdAt, updatedAt

---

## Environment Variables

```env
PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/realestate_db
JWT_SECRET=your_secret_key
JWT_EXPIRATION=7d
CORS_ORIGIN=http://localhost:3000
```

---

## Commands

```bash
# Setup
npm install
npm run prisma:generate
npm run prisma:migrate

# Development
npm run dev              # Start with hot reload
npm run build            # Compile TypeScript
npm start                # Run production build

# Database
npm run prisma:studio   # Open database UI
npm run prisma:migrate  # Create migration

# Code quality
npm run lint            # Run ESLint
npm run format          # Format with Prettier
```

---

## Testing Tools

### Using cURL
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "..."}' | jq
```

### Using Swagger UI
Visit: `http://localhost:3000/api-docs`

### Using Postman
Import OpenAPI spec from `/api-docs` endpoint

---

## Current Status

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Project setup | ✅ |
| 2 | Express server | ✅ |
| 3 | Authentication | ✅ |
| **NEW** | **User management** | ✅ **COMPLETE** |
| 3A | Property creation | ✅ |
| 4 | Property status update | ⏳ Next |
| 5 | Property listing for map | ⏳ |
| 6 | Filter by status | ⏳ |

---
