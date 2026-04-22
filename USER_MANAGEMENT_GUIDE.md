# User Management Module - Complete Guide

## Overview

The User management module enables companies to manage team members (agents, managers, admins). Users are always associated with a company and can manage properties on behalf of the company.

### User Model
```prisma
User {
  id: String (unique)
  name: String (2+ chars)
  email: String (unique per company)
  phone: String? (optional)
  role: String (agent, manager, admin) - default: "agent"
  companyId: String (foreign key to Company)
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## Endpoints Overview

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|-----------------|
| POST | `/api/users` | Create new user | ✅ JWT |
| GET | `/api/users` | List all users (paginated) | ✅ JWT |
| GET | `/api/users/:userId` | Get user details | ✅ JWT |
| PATCH | `/api/users/:userId` | Update user info | ✅ JWT |
| DELETE | `/api/users/:userId` | Delete user | ✅ JWT |

---

## Setup & Database

### 1. Install Dependencies (Fixed)
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npm run prisma:generate
```

### 3. Run Database Migrations
```bash
npm run prisma:migrate
```

### 4. Start Development Server
```bash
npm run dev
```

---

## Complete Testing Workflow

### Step 1: Register Company
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TechRealty Inc",
    "email": "admin@techrealty.com",
    "password": "SecurePass123",
    "phone": "+1-555-0100"
  }'
```

Save the company ID from response.

---

### Step 2: Login to Get JWT Token
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@techrealty.com",
    "password": "SecurePass123"
  }'
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "company": { "id": "clxxxxx", ... }
  }
}
```

**Save the token** - you'll use it for all subsequent requests.

---

## User Endpoint Tests

### Test 1: Create User
```bash
TOKEN="your_jwt_token_from_login"

curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Smith",
    "email": "john@techrealty.com",
    "phone": "+1-555-0101",
    "role": "agent"
  }'
```

Expected response (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "clyyyyyyy",
    "name": "John Smith",
    "email": "john@techrealty.com",
    "phone": "+1-555-0101",
    "role": "agent",
    "companyId": "clxxxxx",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "updatedAt": "2026-04-22T10:30:00.000Z"
  }
}
```

**Save the user ID** (id: "clyyyyyyy") for next tests.

---

### Test 2: Create Second User (Manager)
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Sarah Johnson",
    "email": "sarah@techrealty.com",
    "phone": "+1-555-0102",
    "role": "manager"
  }'
```

---

### Test 3: List All Users
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

Expected response (200):
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "clyyyyyyy",
        "name": "John Smith",
        "email": "john@techrealty.com",
        "phone": "+1-555-0101",
        "role": "agent",
        "companyId": "clxxxxx",
        "createdAt": "2026-04-22T10:30:00.000Z",
        "updatedAt": "2026-04-22T10:30:00.000Z"
      },
      {
        "id": "clzzzzzzz",
        "name": "Sarah Johnson",
        "email": "sarah@techrealty.com",
        "phone": "+1-555-0102",
        "role": "manager",
        "companyId": "clxxxxx",
        "createdAt": "2026-04-22T10:35:00.000Z",
        "updatedAt": "2026-04-22T10:35:00.000Z"
      }
    ],
    "total": 2,
    "limit": 50,
    "offset": 0,
    "pages": 1
  }
}
```

---

### Test 4: List Users by Role (Filter)
```bash
curl "http://localhost:3000/api/users?role=manager" \
  -H "Authorization: Bearer $TOKEN"
```

Expected: Only users with role "manager"

---

### Test 5: List Users with Pagination
```bash
curl "http://localhost:3000/api/users?limit=10&offset=0" \
  -H "Authorization: Bearer $TOKEN"
```

---

### Test 6: Get Specific User
```bash
USER_ID="clyyyyyyy"  # From Test 1

curl http://localhost:3000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

Expected response (200):
```json
{
  "success": true,
  "data": {
    "id": "clyyyyyyy",
    "name": "John Smith",
    "email": "john@techrealty.com",
    "phone": "+1-555-0101",
    "role": "agent",
    "companyId": "clxxxxx",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "updatedAt": "2026-04-22T10:30:00.000Z"
  }
}
```

---

### Test 7: Update User
```bash
USER_ID="clyyyyyyy"

curl -X PATCH http://localhost:3000/api/users/$USER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Smith Updated",
    "phone": "+1-555-0199",
    "role": "manager"
  }'
```

Expected response (200):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "clyyyyyyy",
    "name": "John Smith Updated",
    "email": "john@techrealty.com",
    "phone": "+1-555-0199",
    "role": "manager",
    "companyId": "clxxxxx",
    "createdAt": "2026-04-22T10:30:00.000Z",
    "updatedAt": "2026-04-22T10:40:00.000Z"
  }
}
```

---

### Test 8: Delete User
```bash
USER_ID="clyyyyyyy"

curl -X DELETE http://localhost:3000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

Expected response (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## Error Test Cases

### Test Error 1: Missing Authentication Token
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@company.com"
  }'
```

Expected (401):
```json
{
  "success": false,
  "error": {
    "message": "Missing or invalid authorization token"
  }
}
```

---

### Test Error 2: Duplicate Email (Same Company)
```bash
# Try to create user with same email as existing user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Another User",
    "email": "john@techrealty.com"
  }'
```

Expected (400):
```json
{
  "success": false,
  "error": {
    "message": "User with this email already exists in this company"
  }
}
```

---

### Test Error 3: Invalid Email Format
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test User",
    "email": "not-an-email"
  }'
```

Expected (400):
```json
{
  "success": false,
  "error": {
    "message": "Invalid email format"
  }
}
```

---

### Test Error 4: Name Too Short
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "A",
    "email": "user@company.com"
  }'
```

Expected (400):
```json
{
  "success": false,
  "error": {
    "message": "User name must be at least 2 characters"
  }
}
```

---

### Test Error 5: User Not Found
```bash
USER_ID="invalid_user_id"

curl http://localhost:3000/api/users/$USER_ID \
  -H "Authorization: Bearer $TOKEN"
```

Expected (404):
```json
{
  "success": false,
  "error": {
    "message": "User not found"
  }
}
```

---

## API Documentation

Full interactive API documentation available at:
```
http://localhost:3000/api-docs
```

Features:
- Try-it-out functionality for all endpoints
- Request/response examples
- Authentication configuration
- Schema definitions
- Error codes reference

---

## File Structure

```
src/
├── services/user/
│   ├── createUser.service.ts      ✅ Validation & DB create
│   ├── getUser.service.ts         ✅ Fetch by ID
│   ├── listUsers.service.ts       ✅ List with pagination & filters
│   ├── updateUser.service.ts      ✅ Update user fields
│   └── deleteUser.service.ts      ✅ Delete user
│
├── controllers/user/
│   ├── createUser.controller.ts   ✅ Request handler
│   ├── getUser.controller.ts      ✅ Request handler
│   ├── listUsers.controller.ts    ✅ Request handler
│   ├── updateUser.controller.ts   ✅ Request handler
│   └── deleteUser.controller.ts   ✅ Request handler
│
└── routes/
    └── user.routes.ts             ✅ Routes + Swagger docs
```

---

## Key Features

✅ **JWT Authentication** - All endpoints protected  
✅ **Role-based users** - agent, manager, admin  
✅ **Pagination** - List users with limit/offset  
✅ **Filtering** - Filter by role  
✅ **Validation** - Email format, name length  
✅ **Unique constraint** - One email per company  
✅ **Full Swagger docs** - Interactive API reference  
✅ **Consistent error handling** - Standard JSON errors  

---

## Database Schema

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'agent',
  companyId TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  CONSTRAINT fk_company FOREIGN KEY (companyId) 
    REFERENCES companies(id) ON DELETE CASCADE,
  CONSTRAINT unique_email_per_company UNIQUE (email, companyId)
);

CREATE INDEX idx_users_company ON users(companyId);
CREATE INDEX idx_users_email ON users(email);
```

---

## Notes

- Users can be created/deleted only by their company (via JWT token)
- Email must be unique **per company** (different companies can have same email)
- Deleting a company cascades to delete all its users
- Role field is free-text but recommended values: "agent", "manager", "admin"

---

## Next Steps

Phase 4 will implement:
- Property status update endpoint (`PATCH /api/properties/:id`)
- Status transitions management
- Full filtering by status

**Ready for next phase?** ✅
