# Database Setup Instructions

## Prerequisites
- Docker and Docker Compose installed
- OR PostgreSQL 15+ installed locally

## Option 1: Using Docker (Recommended)

### Start PostgreSQL Container
```bash
docker-compose up -d postgres
```

### Initialize Database & Migrations
```bash
# Install dependencies (if not already done)
npm install

# Create initial migration
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# View database UI
npm run prisma:studio
```

### Stop Database
```bash
docker-compose down
```

---

## Option 2: Local PostgreSQL Installation

### 1. Install PostgreSQL
- macOS: `brew install postgresql@15`
- Linux: `sudo apt-get install postgresql`
- Windows: Download from https://www.postgresql.org/download/

### 2. Create Database
```sql
CREATE USER realestate_user WITH PASSWORD 'realestate_password';
CREATE DATABASE realestate_db OWNER realestate_user;
GRANT ALL PRIVILEGES ON DATABASE realestate_db TO realestate_user;
```

### 3. Update .env
```
DATABASE_URL="postgresql://realestate_user:realestate_password@localhost:5432/realestate_db"
```

### 4. Initialize Migrations
```bash
npm install
npm run prisma:migrate
npm run prisma:generate
```

---

## Verify Setup

### Check database connection:
```bash
npx prisma db push
```

### View database in UI:
```bash
npm run prisma:studio
```

### Start API server:
```bash
npm run dev
```

### Test health endpoint:
```bash
curl http://localhost:3000/api/health
```

---

## Testing Authentication Endpoints

### 1. Register Company
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Acme Real Estate",
    "email": "contact@acme.com",
    "password": "SecurePass123",
    "phone": "+1234567890",
    "whatsapp": "+1234567890"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "contact@acme.com",
    "password": "SecurePass123"
  }'
```

Response includes JWT token:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "company": { ... }
  }
}
```

---

## Common Issues

### "connect ECONNREFUSED"
- PostgreSQL is not running
- Run: `docker-compose up -d postgres` or start PostgreSQL service

### "relation \"company\" does not exist"
- Migrations haven't been run
- Run: `npm run prisma:migrate`

### "Invalid DATABASE_URL"
- Check `.env` file has correct connection string
- Ensure PostgreSQL credentials match

---
