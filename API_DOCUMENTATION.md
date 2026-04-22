# 📍 SmartMap Real Estate API - Documentação para Frontend

**Versão:** 1.0.0  
**Data:** 22 Abril 2026  
**Base URL:** `http://localhost:3000/api` (desenvolvimento) | `https://api.smartmap.com/api` (produção)  
**Autenticação:** JWT Bearer Token  

---

## 📚 Índice

1. [Visão Geral](#visão-geral)
2. [Autenticação](#autenticação)
3. [Modelos de Dados](#modelos-de-dados)
4. [Endpoints](#endpoints)
5. [Erros](#tratamento-de-erros)
6. [Notas Importantes](#notas-importantes)

---

## Visão Geral

API REST para plataforma de imóveis com foco em mapa (MAP is the core).

### Características
- ✅ Autenticação JWT com expiração de 7 dias
- ✅ Multi-tenant (cada empresa tem seus dados isolados)
- ✅ Geolocalização (latitude/longitude com validação)
- ✅ Gerenciamento de imóveis e usuários
- ✅ Validação em tempo real

### Tecnologia
- Node.js + Express
- TypeScript (type-safe)
- PostgreSQL + Prisma ORM
- JWT para autenticação

---

## Autenticação

### Fluxo de Autenticação

1. **Registrar Empresa** → Cria conta da empresa
2. **Fazer Login** → Recebe JWT token
3. **Usar Token** → Incluir em todas as requisições protegidas

### Headers Obrigatórios

```javascript
// Para endpoints protegidos, adicione:
Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

// Sempre use:
Content-Type: "application/json"
```

### Token JWT

- **Formato:** `Bearer {token}`
- **Validade:** 7 dias
- **Renovação:** Fazer login novamente após expiração
- **Armazenamento:** LocalStorage ou SessionStorage

### Exemplo de Decodificação (Frontend)

```javascript
// Decode JWT para verificar conteúdo
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join('')
  );
  return JSON.parse(jsonPayload);
}

// Uso
const token = localStorage.getItem('token');
const decoded = parseJwt(token);
console.log(decoded.id);     // ID da empresa
console.log(decoded.email);  // Email da empresa
console.log(decoded.iat);    // Data de emissão
console.log(decoded.exp);    // Data de expiração
```

---

## Modelos de Dados

### Company (Empresa)

Representa uma empresa/imobiliária no sistema.

```typescript
{
  id: string;              // UUID gerado automaticamente
  name: string;            // Nome da empresa (2-100 caracteres)
  email: string;           // Email único (formato válido)
  password: string;        // Armazenado com hash bcrypt (nunca retornado)
  phone?: string;          // Telefone da empresa (opcional)
  whatsapp?: string;       // WhatsApp da empresa (opcional)
  createdAt: ISO8601;      // Timestamp de criação
  updatedAt: ISO8601;      // Timestamp de atualização
}
```

**Validações:**
- `name`: 2-100 caracteres, único
- `email`: Formato válido (regex), único
- `password`: Mínimo 8 caracteres, 1 maiúscula, 1 minúscula, 1 número

---

### User (Usuário)

Representa um usuário dentro de uma empresa (agente imobiliário, etc).

```typescript
{
  id: string;              // UUID gerado automaticamente
  name: string;            // Nome do usuário (2+ caracteres)
  email: string;           // Email dentro da empresa (único por empresa)
  phone?: string;          // Telefone do usuário (opcional)
  role: string;            // "agent", "manager", "admin (padrão: "agent")
  companyId: string;       // FK para Company
  createdAt: ISO8601;      // Timestamp de criação
  updatedAt: ISO8601;      // Timestamp de atualização
}
```

**Validações:**
- `name`: Mínimo 2 caracteres
- `email`: Único por combinação (email, companyId)
- `role`: Suporta qualquer string (recomendado: "agent", "manager", "admin")

**Relacionamento:**
- Cada usuário pertence a exatamente 1 empresa
- Ao deletar empresa, usuários são deletados em cascata

---

### Property (Imóvel)

Representa um imóvel no mapa.

```typescript
{
  id: string;              // UUID gerado automaticamente
  title: string;           // Título do imóvel (3+ caracteres)
  description?: string;    // Descrição detalhada (opcional)
  latitude: number;        // Latitude do mapa (-90 a 90)
  longitude: number;       // Longitude do mapa (-180 a 180)
  status: string;          // "AVAILABLE" | "NEGOTIATING" | "SOLD" (padrão: "AVAILABLE")
  contactPhone?: string;   // Telefone de contato (opcional)
  contactWhatsApp?: string;// WhatsApp de contato (opcional)
  companyId: string;       // FK para Company
  createdAt: ISO8601;      // Timestamp de criação
  updatedAt: ISO8601;      // Timestamp de atualização
}
```

**Validações:**
- `title`: Mínimo 3 caracteres
- `latitude`: Entre -90 e 90
- `longitude`: Entre -180 e 180
- `status`: Enum com 3 valores (AVAILABLE, NEGOTIATING, SOLD)
- `coordinates`: Formato válido (ex: -23.5505, -46.6333 para São Paulo)

**Relacionamento:**
- Cada imóvel pertence a exatamente 1 empresa
- Multi-tenant: uma empresa vê apenas seus imóveis
- Otimizado para busca por coordenadas (índices de database)

**Exemplo de Coordenadas Brasileiras:**
```
São Paulo: -23.5505, -46.6333
Rio de Janeiro: -22.9068, -43.1729
Brasília: -15.7932, -47.8822
Salvador: -12.9714, -38.5014
Curitiba: -25.4284, -49.2733
```

---

## Endpoints

### 1. Health Check

Verifica se o servidor está online.

#### Request
```http
GET /health HTTP/1.1
Host: localhost:3000
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "API is healthy",
  "timestamp": "2026-04-22T17:55:18.994Z"
}
```

**Uso no Frontend:**
```javascript
fetch('http://localhost:3000/api/health')
  .then(r => r.json())
  .then(data => console.log('API ativa:', data.success));
```

---

### 2. Registrar Empresa

Cria uma nova empresa no sistema. Este é o primeiro endpoint a ser chamado.

#### Request
```http
POST /auth/register HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "name": "Tech Solutions Brasil",
  "email": "admin@techsolutions.com",
  "password": "SecurePass123",
  "phone": "+55-11-99999-0000",
  "whatsapp": "+55-11-99999-0001"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Company registered successfully",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Tech Solutions Brasil",
    "email": "admin@techsolutions.com",
    "phone": "+55-11-99999-0000",
    "whatsapp": "+55-11-99999-0001",
    "createdAt": "2026-04-22T17:55:18.994Z",
    "updatedAt": "2026-04-22T17:55:18.994Z"
  }
}
```

#### Erros Possíveis

| Código | Mensagem | Causa |
|--------|----------|-------|
| 400 | Company name must be between 2 and 100 characters | `name` inválido |
| 400 | Invalid email format | `email` em formato inválido |
| 400 | Password must be at least 8 characters with uppercase, lowercase, and number | `password` fraca |
| 409 | Email already registered | `email` já existe |

#### Exemplo de Código (Frontend)
```javascript
async function registerCompany(formData) {
  const response = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: formData.companyName,
      email: formData.email,
      password: formData.password,
      phone: formData.phone,
      whatsapp: formData.whatsapp
    })
  });

  const data = await response.json();
  if (data.success) {
    console.log('Empresa criada:', data.data);
    localStorage.setItem('companyId', data.data.id);
  } else {
    console.error('Erro:', data.error.message);
  }
}
```

---

### 3. Login

Autentica a empresa e retorna um JWT token.

#### Request
```http
POST /auth/login HTTP/1.1
Host: localhost:3000
Content-Type: application/json

{
  "email": "admin@techsolutions.com",
  "password": "SecurePass123"
}
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1MGU4NDAwLWUyOWItNDFkNC1hNzE2LTQ0NjY1NTQ0MDAwMCIsImVtYWlsIjoiYWRtaW5AdGVjaHNvbHV0aW9ucy5jb20iLCJpYXQiOjE2MDA2NjY2NjYsImV4cCI6MTYwMDY2NjY2N30.SIGNATURE",
    "company": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "Tech Solutions Brasil",
      "email": "admin@techsolutions.com"
    }
  }
}
```

#### Erros Possíveis

| Código | Mensagem | Causa |
|--------|----------|-------|
| 400 | Email and password are required | Faltam campos |
| 401 | Invalid email or password | Credenciais inválidas |

#### Exemplo de Código (Frontend)
```javascript
async function login(email, password) {
  const response = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await response.json();
  if (data.success) {
    // Salvar token
    localStorage.setItem('authToken', data.data.token);
    localStorage.setItem('companyId', data.data.company.id);
    // Redirecionar para dashboard
    window.location.href = '/dashboard';
  } else {
    alert('Erro: ' + data.error.message);
  }
}
```

---

### 4. Criar Usuário

Cria um novo usuário (agente imobiliário) dentro da empresa. **Requer autenticação.**

#### Request
```http
POST /users HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "João Silva",
  "email": "joao@techsolutions.com",
  "phone": "+55-11-98888-0000",
  "role": "agent"
}
```

#### Response (201 Created)
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "João Silva",
    "email": "joao@techsolutions.com",
    "phone": "+55-11-98888-0000",
    "role": "agent",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-04-22T17:55:18.994Z",
    "updatedAt": "2026-04-22T17:55:18.994Z"
  }
}
```

#### Erros Possíveis

| Código | Mensagem | Causa |
|--------|----------|-------|
| 400 | User name must be at least 2 characters | `name` muito curto |
| 400 | Invalid email format | `email` inválido |
| 401 | Unauthorized | Token ausente ou inválido |
| 409 | Email already in use by another user in this company | `email` duplicado na empresa |

#### Exemplo de Código (Frontend)
```javascript
async function createUser(userData) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:3000/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role || 'agent'
    })
  });

  const data = await response.json();
  if (data.success) {
    console.log('Usuário criado:', data.data);
  }
}
```

---

### 5. Listar Usuários

Lista todos os usuários da empresa com suporte a paginação e filtro. **Requer autenticação.**

#### Request
```http
GET /users?limit=10&offset=0&role=agent HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Query Parameters

| Parâmetro | Tipo | Obrigatório | Padrão | Descrição |
|-----------|------|-------------|--------|-----------|
| `limit` | number | Não | 10 | Quantos registros retornar |
| `offset` | number | Não | 0 | Quantos registros pular |
| `role` | string | Não | null | Filtrar por role (ex: "agent") |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "Users fetched successfully",
  "data": {
    "users": [
      {
        "id": "660e8400-e29b-41d4-a716-446655440001",
        "name": "João Silva",
        "email": "joao@techsolutions.com",
        "phone": "+55-11-98888-0000",
        "role": "agent",
        "companyId": "550e8400-e29b-41d4-a716-446655440000",
        "createdAt": "2026-04-22T17:55:18.994Z",
        "updatedAt": "2026-04-22T17:55:18.994Z"
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440002",
        "name": "Maria Santos",
        "email": "maria@techsolutions.com",
        "phone": "+55-11-97777-0000",
        "role": "agent",
        "companyId": "550e8400-e29b-41d4-a716-446655440000",
        "createdAt": "2026-04-22T17:55:18.994Z",
        "updatedAt": "2026-04-22T17:55:18.994Z"
      }
    ],
    "total": 2,
    "pages": 1,
    "currentPage": 1,
    "itemsPerPage": 10
  }
}
```

#### Exemplo de Código (Frontend)
```javascript
async function fetchUsers(limit = 10, offset = 0, role = null) {
  const token = localStorage.getItem('authToken');
  let url = `http://localhost:3000/api/users?limit=${limit}&offset=${offset}`;
  
  if (role) {
    url += `&role=${role}`;
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  const data = await response.json();
  if (data.success) {
    console.log('Usuários:', data.data.users);
    console.log('Total:', data.data.total);
  }
}
```

---

### 6. Obter Usuário por ID

Retorna os dados de um usuário específico. **Requer autenticação.**

#### Request
```http
GET /users/660e8400-e29b-41d4-a716-446655440001 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Path Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `userId` | string | UUID do usuário |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "User fetched successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "João Silva",
    "email": "joao@techsolutions.com",
    "phone": "+55-11-98888-0000",
    "role": "agent",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-04-22T17:55:18.994Z",
    "updatedAt": "2026-04-22T17:55:18.994Z"
  }
}
```

#### Erros Possíveis

| Código | Mensagem | Causa |
|--------|----------|-------|
| 401 | Unauthorized | Token ausente ou inválido |
| 404 | User not found | ID do usuário não existe |

---

### 7. Atualizar Usuário

Atualiza os dados de um usuário. **Requer autenticação.**

#### Request
```http
PATCH /users/660e8400-e29b-41d4-a716-446655440001 HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "name": "João Silva Santos",
  "phone": "+55-11-99999-0000",
  "role": "manager"
}
```

#### Body (todos os campos opcionais)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | string | Novo nome (2+ caracteres) |
| `phone` | string | Novo telefone |
| `role` | string | Novo role |

#### Response (200 OK)
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "João Silva Santos",
    "email": "joao@techsolutions.com",
    "phone": "+55-11-99999-0000",
    "role": "manager",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-04-22T17:55:18.994Z",
    "updatedAt": "2026-04-22T17:55:18.994Z"
  }
}
```

#### Erros Possíveis

| Código | Mensagem | Causa |
|--------|----------|-------|
| 400 | User name must be at least 2 characters | `name` muito curto |
| 401 | Unauthorized | Token ausente ou inválido |
| 404 | User not found | ID do usuário não existe |

---

### 8. Deletar Usuário

Remove um usuário da empresa. **Requer autenticação.**

#### Request
```http
DELETE /users/660e8400-e29b-41d4-a716-446655440001 HTTP/1.1
Host: localhost:3000
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### Response (200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

#### Erros Possíveis

| Código | Mensagem | Causa |
|--------|----------|-------|
| 401 | Unauthorized | Token ausente ou inválido |
| 404 | User not found | ID do usuário não existe |

---

### 9. Criar Imóvel

Cria um novo imóvel no mapa. **Requer autenticação.** Este é o endpoint mais crítico para o mapa.

#### Request
```http
POST /properties HTTP/1.1
Host: localhost:3000
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

{
  "title": "Apartamento Duplex Luxo",
  "description": "Apartamento com 200m², 3 suites, garagem privada. Localizado em bairro premium.",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "status": "AVAILABLE",
  "contactPhone": "+55-11-99999-0000",
  "contactWhatsApp": "+55-11-99999-0000"
}
```

#### Body

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `title` | string | Sim | Nome do imóvel (3+ caracteres) |
| `description` | string | Não | Descrição detalhada |
| `latitude` | number | Sim | Latitude entre -90 e 90 |
| `longitude` | number | Sim | Longitude entre -180 e 180 |
| `status` | string | Não | "AVAILABLE", "NEGOTIATING", "SOLD" (padrão: "AVAILABLE") |
| `contactPhone` | string | Não | Telefone de contato |
| `contactWhatsApp` | string | Não | WhatsApp de contato |

#### Response (201 Created)
```json
{
  "success": true,
  "message": "Property created successfully",
  "data": {
    "id": "770e8400-e29b-41d4-a716-446655440002",
    "title": "Apartamento Duplex Luxo",
    "description": "Apartamento com 200m², 3 suites, garagem privada. Localizado em bairro premium.",
    "latitude": -23.5505,
    "longitude": -46.6333,
    "status": "AVAILABLE",
    "contactPhone": "+55-11-99999-0000",
    "contactWhatsApp": "+55-11-99999-0000",
    "companyId": "550e8400-e29b-41d4-a716-446655440000",
    "createdAt": "2026-04-22T17:55:18.994Z",
    "updatedAt": "2026-04-22T17:55:18.994Z"
  }
}
```

#### Erros Possíveis

| Código | Mensagem | Causa |
|--------|----------|-------|
| 400 | Property title must be at least 3 characters | `title` muito curto |
| 400 | Latitude must be between -90 and 90 | Latitude inválida |
| 400 | Longitude must be between -180 and 180 | Longitude inválida |
| 401 | Unauthorized | Token ausente ou inválido |

#### Exemplo de Código (Frontend - com Leaflet.js)
```javascript
async function createProperty(mapData) {
  const token = localStorage.getItem('authToken');
  
  const response = await fetch('http://localhost:3000/api/properties', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      title: mapData.title,
      description: mapData.description,
      latitude: mapData.latlng.lat,
      longitude: mapData.latlng.lng,
      status: 'AVAILABLE',
      contactPhone: mapData.phone,
      contactWhatsApp: mapData.whatsapp
    })
  });

  const data = await response.json();
  if (data.success) {
    // Adicionar marcador ao mapa
    addMarkerToMap(data.data);
    console.log('Imóvel criado:', data.data.id);
  }
}
```

---

## Tratamento de Erros

### Estrutura de Erro Padrão

Todos os erros retornam a seguinte estrutura:

```json
{
  "success": false,
  "error": {
    "message": "Mensagem de erro legível",
    "code": "CÓDIGO_DO_ERRO"
  }
}
```

### Códigos de Erro HTTP

| Código | Significado | Ação |
|--------|-------------|------|
| **200** | OK | Requisição bem-sucedida |
| **201** | Created | Recurso criado com sucesso |
| **400** | Bad Request | Dados inválidos, verifique o request |
| **401** | Unauthorized | Token ausente, inválido ou expirado |
| **404** | Not Found | Recurso não encontrado |
| **409** | Conflict | Email/dados duplicados |
| **500** | Server Error | Erro no servidor (contate suporte) |

### Tratamento de Erros no Frontend

```javascript
async function apiRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        ...options.headers
      },
      ...options
    });

    const data = await response.json();

    if (!response.ok) {
      // Erro da API
      if (response.status === 401) {
        // Token expirado
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }
      
      throw new Error(data.error?.message || 'Erro desconhecido');
    }

    return data;
  } catch (error) {
    console.error('Erro na requisição:', error);
    throw error;
  }
}

// Uso
try {
  const data = await apiRequest('http://localhost:3000/api/users');
  console.log(data.data);
} catch (error) {
  alert('Erro: ' + error.message);
}
```

---

## Notas Importantes

### 🔐 Segurança

1. **Nunca armazene senha** - Apenas o JWT token
2. **Token em localStorage** - Use `localStorage.getItem('authToken')`
3. **Renovar token** - Faça login novamente após expiração (7 dias)
4. **Logout** - `localStorage.removeItem('authToken')`
5. **HTTPS em produção** - Sempre use HTTPS em produção

### 📍 Geolocalização

1. **Sempre validar coordenadas** no frontend antes de enviar
2. **Formato**: latitude, longitude (ex: -23.5505, -46.6333)
3. **Brasília é o centro** - Coordenadas podem variar bastante
4. **Google Maps / Leaflet.js** - Use bibliotecas para ajudar

### 🗺️ Mapa (MAP is the Core)

1. **Imóveis são multi-tenant** - Cada empresa vê apenas seus
2. **Cores por status**:
   - 🟢 AVAILABLE (verde) - Disponível
   - 🟡 NEGOTIATING (amarelo) - Em negociação
   - 🔴 SOLD (vermelho) - Vendido
3. **Clique em marcador** - Mostra detalhes do imóvel
4. **Clusters** - Agrupe marcadores em zoom-out

### 👥 Multi-tenant

1. **Cada empresa isolada** - Dados privados
2. **Um login = uma empresa** - Não há usuário global
3. **Usuários dentro da empresa** - Para atribuição de imóveis
4. **Apenas leitura cross-empresa** - Não implementado (segurança)

### ⏱️ Timestamps

Todos os `createdAt` e `updatedAt` estão em **ISO 8601**:
```javascript
"2026-04-22T17:55:18.994Z"

// Converter no frontend
const date = new Date("2026-04-22T17:55:18.994Z");
console.log(date.toLocaleString('pt-BR'));
// Resultado: 22/4/2026, 14:55:18
```

### 🔄 Paginação

Sempre usar `limit` e `offset` para listar muitos registros:

```javascript
// Página 1
GET /users?limit=10&offset=0

// Página 2
GET /users?limit=10&offset=10

// Página 3
GET /users?limit=10&offset=20

// Cálculo: offset = (página - 1) * limit
```

### 📱 Respostas de Sucesso

Toda resposta bem-sucedida segue este padrão:

```json
{
  "success": true,
  "message": "Descrição do que foi feito",
  "data": {
    // Dados do recurso
  }
}
```

### 🛠️ Exemplo Completo (React)

```javascript
import { useState, useEffect } from 'react';

export function PropertyMap() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/properties', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Erro ao buscar');
      
      const data = await response.json();
      setProperties(data.data);
    } catch (error) {
      console.error('Erro:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createProperty(propertyData) {
    try {
      const response = await fetch('http://localhost:3000/api/properties', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(propertyData)
      });

      if (!response.ok) throw new Error('Erro ao criar');
      
      const data = await response.json();
      setProperties([...properties, data.data]);
      return data.data;
    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
  }

  return (
    <div>
      {loading && <p>Carregando...</p>}
      <ul>
        {properties.map(prop => (
          <li key={prop.id}>{prop.title} - {prop.status}</li>
        ))}
      </ul>
    </div>
  );
}
```

---

## 🚀 Quick Reference

### Autenticação
```bash
# 1. Registrar
POST /auth/register
{ "name", "email", "password" }

# 2. Login
POST /auth/login
{ "email", "password" }
→ Salvar: localStorage.setItem('authToken', token)

# 3. Usar token em todas as requisições protegidas
Authorization: Bearer {token}
```

### Usuários
```bash
POST   /users              # Criar
GET    /users              # Listar (com paginação)
GET    /users/:userId      # Obter um
PATCH  /users/:userId      # Atualizar
DELETE /users/:userId      # Deletar
```

### Imóveis
```bash
POST /properties           # Criar (IMPORTANTE: latitude/longitude validadas)
```

---

## 📞 Suporte

- **API Documentation:** Esta documentação
- **GitHub Issues:** Para bugs e features
- **Email:** support@smartmap.com
- **Status:** Disponível em http://localhost:3000/api/health

---

**Última atualização:** 22 Abril 2026  
**Versão:** 1.0.0  
**Pronto para produção:** ✅ Sim
