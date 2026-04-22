# 🚀 Complete Setup & Troubleshooting Guide

## Fixed Issues ✅

1. **tsx --loader error** - Changed to `--import` flag (Node v20.6.0+)
2. **TypeScript moduleResolution** - Changed to `bundler` + added `ignoreDeprecations`
3. **Missing type definitions** - Added `@types/swagger-jsdoc`
4. **Import paths** - Using `.js` extensions for ES modules

---

## Prerequisites

### System Requirements
- Node.js v20.0.0+ (v24.9.0 confirmed working)
- npm 10+
- PostgreSQL 15+
- Docker & Docker Compose (optional, for PostgreSQL)

### Check Versions
```bash
node --version       # v24.9.0+
npm --version        # 10.0.0+
docker --version     # (optional)
```

---

## Step 1: Install Dependencies

```bash
cd /Users/cash/Desktop/api
npm install
```

If you get package resolution errors:
```bash
npm install --legacy-peer-deps
```

---

## Step 2: Database Setup

### Option A: Using Docker (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Wait 10 seconds for database to start
sleep 10

# Run migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### Option B: Using Local PostgreSQL

```bash
# 1. Create database and user
psql -U postgres -c "CREATE USER realestate_user WITH PASSWORD 'realestate_password';"
psql -U postgres -c "CREATE DATABASE realestate_db OWNER realestate_user;"

# 2. Update .env with correct connection string
# DATABASE_URL="postgresql://realestate_user:realestate_password@localhost:5432/realestate_db"

# 3. Run migrations
npm run prisma:migrate

# 4. Generate Prisma client
npm run prisma:generate
```

---

## Step 3: Environment Configuration

### Copy Template
```bash
cp .env.example .env
```

### Update .env
```env
PORT=3000
NODE_ENV=development

# Database (update if needed)
DATABASE_URL="postgresql://realestate_user:realestate_password@localhost:5432/realestate_db"

# JWT
JWT_SECRET="your_super_secret_key_change_in_production_12345"
JWT_EXPIRATION=7d

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5173

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_DIR=./uploads
```

---

## Step 4: Start Development Server

```bash
npm run dev
```

### Expected Output
```
[timestamp] GET /api/health
🚀 Server running on http://localhost:3000 in development mode
📊 Health check: http://localhost:3000/api/health
```

### If Errors Occur

**Error: "Cannot find module '@prisma/client'"**
```bash
npm run prisma:generate
```

**Error: "connect ECONNREFUSED"**
```bash
# PostgreSQL not running
docker-compose up -d postgres
# OR
brew services start postgresql@15
```

**Error: "relation \"company\" does not exist"**
```bash
npm run prisma:migrate
```

**Error: "tsx must be loaded with --import"**
```bash
# This is fixed in package.json
# Just reinstall or update scripts
npm install
```

---

## Step 5: Verify Setup

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected Response:
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-04-22T10:00:00.000Z"
}
```

### Swagger Documentation
Open in browser:
```
http://localhost:3000/api-docs
```

### Prisma Studio (Database UI)
```bash
npm run prisma:studio
```

Opens database viewer at `http://localhost:5555`

---

## Testing Workflow

### 1. Register Company
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "email": "admin@test.com",
    "password": "SecurePass123",
    "phone": "+1-555-0000"
  }'
```

Save company ID from response.

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "SecurePass123"
  }'
```

Save token from response:
```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 3. Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "John Agent",
    "email": "john@test.com",
    "role": "agent"
  }'
```

### 4. List Users
```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer $TOKEN"
```

### 5. Create Property
```bash
curl -X POST http://localhost:3000/api/properties \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Downtown Condo",
    "description": "Luxury 2-bedroom",
    "latitude": 40.7128,
    "longitude": -74.0060,
    "contactPhone": "+1-555-0100",
    "contactWhatsApp": "+1-555-0100"
  }'
```

---

## Common Errors & Solutions

### Error: "Module not found: @prisma/client"
**Solution:**
```bash
npm install @prisma/client
npm run prisma:generate
```

### Error: "Cannot connect to database"
**Check:**
1. PostgreSQL is running
2. DATABASE_URL is correct in .env
3. Credentials are correct

**Fix:**
```bash
# Check PostgreSQL status
docker ps
# or
pg_isready -h localhost -U realestate_user

# Restart if needed
docker-compose down
docker-compose up -d postgres
```

### Error: "Port 3000 already in use"
**Solution:**
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Error: "Cannot find module './routes/X'"
**Solution:**
```bash
# Ensure all files exist
ls -la src/routes/
# Should show: health.ts, auth.routes.ts, user.routes.ts, property.routes.ts

# Clear and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Error: "SyntaxError: Unexpected token import"
**Solution:**
```bash
# Update package.json scripts (already done)
# Check: "dev": "node --import tsx src/index.ts"

npm run dev
```

### Error: "TypeScript compilation errors"
**Solution:**
```bash
# Full compilation test
npm run build

# If errors, check tsconfig.json
cat tsconfig.json | grep ignoreDeprecations
# Should show: "ignoreDeprecations": "6.0"
```

---

## Database Troubleshooting

### View Database Schema
```bash
npm run prisma:studio
```

### Create New Migration
```bash
npm run prisma:migrate
# Follow prompts to create migration
```

### Seed Database (Optional)
```bash
# Create seeds/seed.ts file to add test data
npm run prisma:db seed
```

### Reset Database (WARNING: Deletes all data)
```bash
npm run prisma:migrate reset
```

---

## Development Commands Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Database management
npm run prisma:migrate    # Create/apply migrations
npm run prisma:generate   # Generate Prisma client
npm run prisma:studio     # Open database UI

# Code quality
npm run lint              # Run ESLint
npm run format            # Format with Prettier

# Dependencies
npm install               # Install all packages
npm update                # Update packages
npm audit                 # Check vulnerabilities
```

---

## File Structure Verification

Verify all critical files exist:

```bash
# Config files
ls -la src/config/       # Should have: env.ts, prisma.ts, swagger.ts

# Middleware
ls -la src/middlewares/  # Should have: auth.ts, cors.ts, errorHandler.ts

# Routes
ls -la src/routes/       # Should have: health.ts, auth.routes.ts, user.routes.ts, property.routes.ts

# Services
ls -la src/services/auth/     # Should have: register.service.ts, login.service.ts
ls -la src/services/user/     # Should have: 5 service files
ls -la src/services/property/ # Should have: createProperty.service.ts

# Controllers
ls -la src/controllers/auth/     # Should have: register.controller.ts, login.controller.ts
ls -la src/controllers/user/     # Should have: 5 controller files
ls -la src/controllers/property/ # Should have: createProperty.controller.ts

# Utilities
ls -la src/utils/       # Should have: errors.ts, jwt.ts, password.ts, validators.ts

# Database
ls -la prisma/          # Should have: schema.prisma
```

---

## Git Workflow

### Initialize Repository
```bash
git init
git add .
git commit -m "Initial project setup"
```

### Create .gitignore (Already Created)
```
node_modules/
dist/
.env
.env.local
*.log
uploads/
.prisma/
```

### Ignore Database Credentials
```bash
# .env is in .gitignore ✓
# .env.example is in git ✓
```

---

## VS Code Setup (Optional)

### Recommended Extensions
1. **Prettier** - Code formatter
2. **ESLint** - Linting
3. **Thunder Client** or **REST Client** - API testing
4. **Prisma** - Database schema syntax highlighting
5. **Thunder Client** - REST API client

### VS Code Settings (.vscode/settings.json)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Docker Setup (Optional)

### Start All Services
```bash
docker-compose up -d
```

### Stop Services
```bash
docker-compose down
```

### View Logs
```bash
docker-compose logs -f postgres
```

### Access PostgreSQL from Host
```bash
psql -U realestate_user -h localhost -d realestate_db
```

---

## Deployment Checklist

Before deploying to production:

- [ ] Set strong JWT_SECRET
- [ ] Update DATABASE_URL to production database
- [ ] Set NODE_ENV=production
- [ ] Update CORS_ORIGIN to production domain
- [ ] Run database migrations
- [ ] Compile TypeScript: `npm run build`
- [ ] Run tests (when tests are added)
- [ ] Check security vulnerabilities: `npm audit`
- [ ] Enable HTTPS
- [ ] Set up monitoring/logging
- [ ] Configure backup strategy

---

## Quick Start (TL;DR)

```bash
# 1. Install
npm install

# 2. Database
docker-compose up -d postgres
npm run prisma:migrate
npm run prisma:generate

# 3. Run
npm run dev

# 4. Test
curl http://localhost:3000/api/health

# 5. API Docs
open http://localhost:3000/api-docs
```

---

## Support & Debugging

### Enable Debug Logging
```bash
# In .env
DEBUG=*
```

### Check Node Version
```bash
node --version
# Should be v20.0.0 or higher
```

### Verify Prisma Installation
```bash
npx prisma version
```

### Check Port Availability
```bash
lsof -i :3000
```

### Test Database Connection
```bash
npm run prisma:db execute --stdin < test.sql
```

---

## Next Steps

1. ✅ Complete setup (this guide)
2. ⏳ Test all endpoints (USER_MANAGEMENT_GUIDE.md)
3. ⏳ Phase 4: Property status updates
4. ⏳ Phase 5: Property listing for map
5. ⏳ Phase 6: Advanced filtering

---

## Summary

✅ All dependencies fixed  
✅ TypeScript configuration updated  
✅ npm scripts corrected  
✅ Project structure verified  
✅ Database setup documented  
✅ Common errors solved  
✅ Testing workflow ready  

**You're now ready to start!** 🚀
