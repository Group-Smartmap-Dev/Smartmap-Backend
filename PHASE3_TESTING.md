# Phase 3: Property Creation Testing Guide

## Overview
Phase 3 implements the core property creation endpoint with:
- JWT authentication protection
- Geolocation data (latitude/longitude) validation
- Map-ready data structure
- Full Swagger API documentation

## Setup & Database

### 1. Start PostgreSQL
```bash
docker-compose up -d postgres
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Migrations
```bash
npm run prisma:migrate
npm run prisma:generate
```

### 4. Start Development Server
```bash
npm run dev
```

Server will start at: `http://localhost:3000`

---

## Testing Workflow

### Step 1: Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-04-22T10:30:00.000Z"
}
```

---

### Step 2: Register Company
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Downtown Properties Inc",
    "email": "team@downtown.com",
    "password": "SecurePass123",
    "phone": "+1-555-0100",
    "whatsapp": "+1-555-0100"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Company registered successfully",
  "data": {
    "id": "clxxxxx",
    "name": "Downtown Properties Inc",
    "email": "team@downtown.com",
    "phone": "+1-555-0100",
    "whatsapp": "+1-555-0100",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "updatedAt": "2026-04-22T10:30:00.000Z"
  }
}
```

---

### Step 3: Login & Get JWT Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "team@downtown.com",
    "password": "SecurePass123"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "company": {
      "id": "clxxxxx",
      "name": "Downtown Properties Inc",
      "email": "team@downtown.com"
    }
  }
}
```

**Save the token** from this response to use in protected endpoints.

---

### Step 4: Create Property (With Token)
```bash
TOKEN="your_token_from_login_response"

curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Luxury Downtown Penthouse",
    "description": "5-bedroom penthouse with panoramic city views",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "contactPhone": "+1-555-0100",
    "contactWhatsApp": "+1-555-0100"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "clyyyyyyy",
    "title": "Luxury Downtown Penthouse",
    "description": "5-bedroom penthouse with panoramic city views",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "status": "AVAILABLE",
    "contactPhone": "+1-555-0100",
    "contactWhatsApp": "+1-555-0100",
    "companyId": "clxxxxx",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "updatedAt": "2026-04-22T10:30:00.000Z"
  }
}
```

---

## Validation Tests

### Test 1: Missing Authentication Token
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Property",
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

Expected: **401 Unauthorized**

---

### Test 2: Invalid Latitude (>90)
```bash
TOKEN="your_token"

curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Property",
    "latitude": 95,
    "longitude": -74.0060
  }'
```

Expected error: **400 Bad Request**
```json
{
  "success": false,
  "error": {
    "message": "Latitude must be between -90 and 90"
  }
}
```

---

### Test 3: Invalid Longitude (<-180)
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Property",
    "latitude": 40.7128,
    "longitude": -185
  }'
```

Expected error: **400 Bad Request**

---

### Test 4: Missing Title
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "latitude": 40.7128,
    "longitude": -74.0060
  }'
```

Expected error: **400 Bad Request**
```json
{
  "success": false,
  "error": {
    "message": "Title must be at least 3 characters"
  }
}
```

---

## Swagger Documentation

View full API documentation at:
```
http://localhost:3000/api-docs
```

The UI includes:
- All endpoints with full descriptions
- Request/response examples
- Authentication setup guide
- Schema definitions
- Try-it-out functionality

---

## Files Structure (Phase 3)

```
src/
├── services/property/
│   └── createProperty.service.ts      # Business logic
├── controllers/property/
│   └── createProperty.controller.ts   # Request handler
├── routes/
│   └── property.routes.ts             # Route + Swagger docs
├── middlewares/
│   └── auth.ts                        # JWT protection
└── config/
    └── swagger.ts                     # Swagger configuration
```

---

## Key Features (Phase 3)

✅ **JWT Authentication** - All property endpoints require valid token  
✅ **Geolocation Validation** - Latitude/longitude bounds checking  
✅ **Map-Ready Data** - Properties indexed by coordinates  
✅ **Swagger Docs** - Interactive API documentation  
✅ **Strict Separation** - Service → Controller → Route pattern  
✅ **Error Handling** - Consistent error responses  

---

## Next Phase: Phase 4

Phase 4 will implement:
- `PATCH /api/properties/:id` - Update property status
- Status change: AVAILABLE → NEGOTIATING → SOLD
- Authenticated endpoint protection

**Ready to proceed to Phase 4?**
