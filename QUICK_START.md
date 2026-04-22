# 📱 SmartMap API - Guia para Frontend Developer

**Status:** ✅ **PRONTO PARA PRODUÇÃO**  
**Versão:** 1.0.0  
**Data:** 22 Abril 2026  

---

## 🚀 Quick Start

### URL Base
```
http://localhost:3000/api
```

### Documentação Interativa
```
http://localhost:3000/api-docs (Swagger UI)
```

---

## 🔑 Autenticação (JWT Token)

### 1. Register Company (Criar Conta)
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "Sua Imobiliária",
  "email": "admin@imobiliaria.com",
  "password": "SenhaForte@123",
  "phone": "+55-21-99999-0000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Company registered successfully",
  "data": {
    "id": "uuid-aqui",
    "name": "Sua Imobiliária",
    "email": "admin@imobiliaria.com",
    "phone": "+55-21-99999-0000",
    "createdAt": "2026-04-22T18:14:50.782Z"
  }
}
```

---

### 2. Login (Obter Token JWT)
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@imobiliaria.com",
  "password": "SenhaForte@123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "company": {
      "id": "uuid-aqui",
      "name": "Sua Imobiliária",
      "email": "admin@imobiliaria.com"
    }
  }
}
```

**Token Validade:** 7 dias  
**Header:** `Authorization: Bearer {token}`

---

## 👥 Endpoints de Usuário

### Listar Usuários (Paginado)
```bash
GET /api/users?limit=10&offset=0
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": "uuid",
        "name": "João Silva",
        "email": "joao@imobiliaria.com",
        "phone": "+55-21-98765-0000",
        "role": "agent",
        "companyId": "uuid",
        "createdAt": "2026-04-22T18:14:50.782Z"
      }
    ],
    "total": 1,
    "limit": 10,
    "offset": 0,
    "pages": 1
  }
}
```

---

### Criar Novo Usuário
```bash
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Maria Santos",
  "email": "maria@imobiliaria.com",
  "phone": "+55-21-97654-0000",
  "role": "agent"  // "agent" | "manager" | "admin"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "name": "Maria Santos",
    "email": "maria@imobiliaria.com",
    "phone": "+55-21-97654-0000",
    "role": "agent",
    "companyId": "uuid",
    "createdAt": "2026-04-22T18:14:50.782Z"
  }
}
```

---

### Obter Usuário Específico
```bash
GET /api/users/{userId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Maria Santos",
    "email": "maria@imobiliaria.com",
    "phone": "+55-21-97654-0000",
    "role": "agent",
    "companyId": "uuid",
    "createdAt": "2026-04-22T18:14:50.782Z"
  }
}
```

---

### Atualizar Usuário
```bash
PATCH /api/users/{userId}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Maria Santos Atualizado",
  "phone": "+55-21-99999-0000",
  "role": "manager"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "uuid",
    "name": "Maria Santos Atualizado",
    "email": "maria@imobiliaria.com",
    "phone": "+55-21-99999-0000",
    "role": "manager",
    "companyId": "uuid",
    "updatedAt": "2026-04-22T18:15:51.247Z"
  }
}
```

---

### Deletar Usuário
```bash
DELETE /api/users/{userId}
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 🏠 Endpoints de Propriedade

### Criar Propriedade/Imóvel
```bash
POST /api/properties
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Apartamento Cobertura",
  "description": "Cobertura de luxo com 250m², 3 suites, piscina privada",
  "latitude": -22.9068,
  "longitude": -43.1729,
  "status": "AVAILABLE",
  "contactPhone": "+55-21-99999-0000",
  "contactWhatsApp": "+55-21-99999-0000"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "uuid",
    "title": "Apartamento Cobertura",
    "description": "Cobertura de luxo com 250m², 3 suites, piscina privada",
    "latitude": -22.9068,
    "longitude": -43.1729,
    "status": "AVAILABLE",
    "contactPhone": "+55-21-99999-0000",
    "contactWhatsApp": "+55-21-99999-0000",
    "companyId": "uuid",
    "createdAt": "2026-04-22T18:15:50.675Z"
  }
}
```

---

## 📊 Tipos de Dados

### Company (Empresa)
```typescript
interface Company {
  id: string;              // UUID
  name: string;            // 2-100 caracteres
  email: string;           // Único
  password?: string;       // Hashado (never na response)
  phone?: string;          // Opcional
  whatsapp?: string;       // Opcional
  createdAt: string;       // ISO 8601
  updatedAt?: string;      // ISO 8601
}
```

### User (Usuário)
```typescript
interface User {
  id: string;              // UUID
  name: string;            // 2+ caracteres
  email: string;           // Único por empresa
  phone?: string;          // Opcional
  role: string;            // "agent" | "manager" | "admin"
  companyId: string;       // FK para Company
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

### Property (Imóvel)
```typescript
interface Property {
  id: string;              // UUID
  title: string;           // 3+ caracteres
  description?: string;    // Opcional
  latitude: number;        // -90 a 90
  longitude: number;       // -180 a 180
  status: string;          // "AVAILABLE" | "NEGOTIATING" | "SOLD"
  contactPhone?: string;   // Opcional
  contactWhatsApp?: string;// Opcional
  companyId: string;       // FK para Company
  createdAt: string;       // ISO 8601
  updatedAt: string;       // ISO 8601
}
```

---

## 🛠️ Exemplo React com Hooks

### Setup Initial
```typescript
import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000/api';

// Hook para usar a API
const useAPI = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  
  const request = async (method: string, endpoint: string, body?: any) => {
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    
    return response.json();
  };
  
  const login = async (email: string, password: string) => {
    const result = await request('POST', '/auth/login', { email, password });
    if (result.success) {
      setToken(result.data.token);
      localStorage.setItem('token', result.data.token);
    }
    return result;
  };
  
  const getUsers = async () => {
    return request('GET', '/users');
  };
  
  return { login, getUsers, token };
};
```

### Component Exemplo
```typescript
export function UserList() {
  const { getUsers, token } = useAPI();
  const [users, setUsers] = useState([]);
  
  useEffect(() => {
    if (token) {
      getUsers().then(result => {
        if (result.success) {
          setUsers(result.data.users);
        }
      });
    }
  }, [token]);
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} ({user.email})</li>
      ))}
    </ul>
  );
}
```

---

## 📍 Coordenadas Brasileiras (Exemplos)

```javascript
// Rio de Janeiro
const rio = { latitude: -22.9068, longitude: -43.1729 };

// São Paulo
const sp = { latitude: -23.5505, longitude: -46.6333 };

// Salvador
const salvador = { latitude: -12.9714, longitude: -38.5014 };

// Brasília
const brasilia = { latitude: -15.7942, longitude: -47.8822 };
```

---

## ⚠️ Tratamento de Erros

### Erro de Autenticação (401)
```json
{
  "success": false,
  "error": {
    "message": "Unauthorized",
    "code": "UNAUTHORIZED"
  }
}
```

### Erro de Validação (400)
```json
{
  "success": false,
  "error": {
    "message": "Email already exists",
    "code": "VALIDATION_ERROR"
  }
}
```

### Recurso Não Encontrado (404)
```json
{
  "success": false,
  "error": {
    "message": "User not found",
    "code": "NOT_FOUND"
  }
}
```

---

## 🔒 Validações Implementadas

- ✅ **Email:** Formato válido, único por empresa
- ✅ **Senha:** Mín. 8 chars, 1 maiúscula, 1 minúscula, 1 dígito
- ✅ **Latitude:** Entre -90 e 90 graus
- ✅ **Longitude:** Entre -180 e 180 graus
- ✅ **JWT Token:** Válido por 7 dias
- ✅ **Multi-tenant:** Dados isolados por empresa

---

## 📚 Recursos Adicionais

- **Documentação Completa:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Tipos TypeScript:** [FRONTEND_TYPES.md](./FRONTEND_TYPES.md)
- **Swagger UI:** http://localhost:3000/api-docs

---

## 🚀 Pronto para Desenvolvimento!

Todos os 9 endpoints estão testados e funcionando.

**Endpoints Disponíveis:**
1. ✅ POST `/auth/register` - Criar conta
2. ✅ POST `/auth/login` - Fazer login
3. ✅ GET `/users` - Listar usuários
4. ✅ POST `/users` - Criar usuário
5. ✅ GET `/users/:id` - Obter usuário
6. ✅ PATCH `/users/:id` - Atualizar usuário
7. ✅ DELETE `/users/:id` - Deletar usuário
8. ✅ POST `/properties` - Criar propriedade
9. ✅ GET `/health` - Verificar saúde da API

**Começar Agora:**
1. Clone o repositório
2. Instale dependências: `npm install`
3. Configure `.env` com `DATABASE_URL` e `JWT_SECRET`
4. Execute migrações: `npm run prisma:migrate`
5. Inicie servidor: `npm run dev`
6. Abra http://localhost:3000/api-docs para testar

---

**Desenvolvido com ❤️ para SmartMap Real Estate**

# 🚀 Quick Start - Server Launch Guide

## Current Status
✅ **All TypeScript errors fixed**  
✅ **All imports corrected**  
✅ **Type declarations in place**  
✅ **Ready to run**

---

## 5-Step Quick Start

### Step 1: Install Dependencies
```bash
cd /Users/cash/Desktop/api
npm install
```
**What it does:** Installs all packages including `@types/swagger-jsdoc`

### Step 2: Setup Database (Choose One)

#### Option A: Using Docker (Easiest)
```bash
docker-compose up -d postgres
sleep 10
npm run prisma:migrate
npm run prisma:generate
```

#### Option B: Using Local PostgreSQL
```bash
# Already running? Skip this
# Not running? Start it first, then:
npm run prisma:migrate
npm run prisma:generate
```

### Step 3: Copy Environment File
```bash
cp .env.example .env
```
**Note:** The .env file already has correct values from setup

### Step 4: Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
[2025-04-22T10:00:00.000Z] GET /api/health
🚀 Server running on http://localhost:3000 in development mode
```

### Step 5: Test the API
**Open in browser:**
```
http://localhost:3000/api-docs
```

---

## Verification Checklist

```bash
# 1. Health check
curl http://localhost:3000/api/health

# 2. View Swagger docs
open http://localhost:3000/api-docs

# 3. View database
npm run prisma:studio

# 4. Check compilation
npm run build
# Should output: "src/index.ts -> dist/index.js"
```

---

## Available Endpoints (No Auth)

### Health Check
```bash
GET http://localhost:3000/api/health
```

### Register Company
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "My Company",
  "email": "admin@company.com",
  "password": "SecurePass123",
  "phone": "+1-555-0000"
}
```

### Login
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "admin@company.com",
  "password": "SecurePass123"
}
```

**Response includes JWT token - save this!**

---

## Protected Endpoints (Need Token)

All other endpoints require the JWT token from login.

### Create User
```bash
POST http://localhost:3000/api/users
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "John Agent",
  "email": "john@company.com",
  "role": "agent"
}
```

### Create Property
```bash
POST http://localhost:3000/api/properties
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "title": "Downtown Condo",
  "description": "Luxury 2-bedroom",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "contactPhone": "+1-555-0100",
  "contactWhatsApp": "+1-555-0100"
}
```

---

## Troubleshooting

### Port 3000 Already in Use
```bash
PORT=3001 npm run dev
```

### Cannot Connect to Database
```bash
# Check if PostgreSQL is running
docker ps
# or
pg_isready -h localhost -U realestate_user

# Restart if needed
docker-compose down
docker-compose up -d postgres
```

### TypeScript Errors
```bash
# Check compilation
npm run build

# Should say: No errors
# If not, file issues have been fixed - try:
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Module Not Found Errors
```bash
# Regenerate Prisma client
npm run prisma:generate

# Or full reset
npm run prisma:migrate
npm run prisma:generate
```

---

## Useful Commands

```bash
# Development
npm run dev              # Start with hot reload ✅ USE THIS

# Production
npm run build            # Compile TypeScript
npm start                # Run compiled version

# Database
npm run prisma:migrate   # Run migrations
npm run prisma:generate  # Generate Prisma client
npm run prisma:studio    # Open database UI at localhost:5555

# Code Quality
npm run lint             # Check for issues
npm run format           # Format code
```

---

## Project Overview

**31 TypeScript files** organized as:
```
src/
├── config/         (env, prisma, swagger)
├── middlewares/    (auth, cors, error handling)
├── routes/         (4 route files with Swagger docs)
├── controllers/    (8 thin request handlers)
├── services/       (8 business logic files)
├── utils/          (errors, jwt, password, validators)
└── index.ts        (main entry point)
```

**8 API Endpoints:**
- Health check
- Register company
- Login company
- Create user
- List users
- Get user
- Update user
- Delete user
- Create property (Phase 3A)
- List properties (Phase 5)
- Update property status (Phase 4 - Next!)

---

## What's Included

✅ **JWT Authentication** - Secure endpoints  
✅ **PostgreSQL Database** - With Prisma ORM  
✅ **Type-Safe** - Full TypeScript with strict mode  
✅ **Error Handling** - Custom error classes  
✅ **Swagger Docs** - Interactive API documentation  
✅ **Modular Design** - Each endpoint in its own file  
✅ **Business Logic** - Separated into services  
✅ **Input Validation** - Email, password, coordinates  
✅ **CORS Enabled** - Ready for frontend integration  

---

## Next Phase (Phase 4)

After you've tested the current 8 endpoints, we'll add:

**Property Status Update**
```bash
PATCH /api/properties/:id
```
- Update property status
- Enum validation: AVAILABLE → NEGOTIATING → SOLD
- Only owner company can update
- Full Swagger documentation

---

## Questions?

All documentation is in:
- **PROJECT_MAP.md** - Complete architecture overview
- **SETUP_GUIDE.md** - Detailed setup & troubleshooting
- **PHASE8_COMPLETION.md** - Error fixes documentation
- **Swagger UI** - Interactive at /api-docs

---

## Ready? 🚀

```bash
npm run dev
```

Then open: http://localhost:3000/api-docs

**The backend is live!**

