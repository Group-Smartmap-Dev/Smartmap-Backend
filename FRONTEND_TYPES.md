# 📦 Tipos de Dados - TypeScript/JSON

Tipos e interfaces para usar no frontend (TypeScript/React).

---

## Company (Empresa)

```typescript
interface Company {
  id: string;              // UUID
  name: string;            // "Tech Solutions Brasil"
  email: string;           // "admin@techsolutions.com"
  phone?: string;          // "+55-11-99999-0000"
  whatsapp?: string;       // "+55-11-99999-0001"
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// Exemplo
const company: Company = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Tech Solutions Brasil",
  email: "admin@techsolutions.com",
  phone: "+55-11-99999-0000",
  whatsapp: "+55-11-99999-0001",
  createdAt: "2026-04-22T17:55:18.994Z",
  updatedAt: "2026-04-22T17:55:18.994Z"
};
```

---

## User (Usuário)

```typescript
interface User {
  id: string;              // UUID
  name: string;            // "João Silva"
  email: string;           // "joao@techsolutions.com"
  phone?: string;          // "+55-11-98888-0000"
  role: string;            // "agent" | "manager" | "admin"
  companyId: string;       // FK para Company
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// Exemplo
const user: User = {
  id: "660e8400-e29b-41d4-a716-446655440001",
  name: "João Silva",
  email: "joao@techsolutions.com",
  phone: "+55-11-98888-0000",
  role: "agent",
  companyId: "550e8400-e29b-41d4-a716-446655440000",
  createdAt: "2026-04-22T17:55:18.994Z",
  updatedAt: "2026-04-22T17:55:18.994Z"
};
```

---

## Property (Imóvel)

```typescript
type PropertyStatus = "AVAILABLE" | "NEGOTIATING" | "SOLD";

interface Property {
  id: string;              // UUID
  title: string;           // "Apartamento Duplex Luxo"
  description?: string;    // Descrição completa
  latitude: number;        // -23.5505
  longitude: number;       // -46.6333
  status: PropertyStatus;  // "AVAILABLE" | "NEGOTIATING" | "SOLD"
  contactPhone?: string;   // "+55-11-99999-0000"
  contactWhatsApp?: string;// "+55-11-99999-0000"
  companyId: string;       // FK para Company
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

// Exemplo
const property: Property = {
  id: "770e8400-e29b-41d4-a716-446655440002",
  title: "Apartamento Duplex Luxo",
  description: "Apartamento com 200m², 3 suites, garagem privada.",
  latitude: -23.5505,
  longitude: -46.6333,
  status: "AVAILABLE",
  contactPhone: "+55-11-99999-0000",
  contactWhatsApp: "+55-11-99999-0000",
  companyId: "550e8400-e29b-41d4-a716-446655440000",
  createdAt: "2026-04-22T17:55:18.994Z",
  updatedAt: "2026-04-22T17:55:18.994Z"
};

// Cores para o mapa
const statusColors = {
  AVAILABLE: "#00AA00",    // Verde
  NEGOTIATING: "#FFAA00",  // Amarelo
  SOLD: "#FF0000"          // Vermelho
};
```

---

## API Responses

### Sucesso

```typescript
interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

// Exemplo: Login
interface LoginResponse extends SuccessResponse<{
  token: string;
  company: Company;
}> {}

// Exemplo: Criar Usuário
interface CreateUserResponse extends SuccessResponse<User> {}

// Exemplo: Listar Usuários
interface ListUsersResponse extends SuccessResponse<{
  users: User[];
  total: number;
  pages: number;
  currentPage: number;
  itemsPerPage: number;
}> {}
```

### Erro

```typescript
interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
  };
}

// Exemplo
const errorResponse: ErrorResponse = {
  success: false,
  error: {
    message: "Email already registered",
    code: "CONFLICT"
  }
};
```

---

## Requests (Input)

### Register Company

```typescript
interface RegisterCompanyInput {
  name: string;      // 2-100 caracteres
  email: string;     // Email válido
  password: string;  // 8+ chars, upper, lower, number
  phone?: string;
  whatsapp?: string;
}

// Exemplo
const registerData: RegisterCompanyInput = {
  name: "Tech Solutions Brasil",
  email: "admin@techsolutions.com",
  password: "SecurePass123",
  phone: "+55-11-99999-0000",
  whatsapp: "+55-11-99999-0001"
};
```

### Login

```typescript
interface LoginInput {
  email: string;
  password: string;
}

// Exemplo
const loginData: LoginInput = {
  email: "admin@techsolutions.com",
  password: "SecurePass123"
};
```

### Create User

```typescript
interface CreateUserInput {
  name: string;    // 2+ caracteres
  email: string;   // Email válido
  phone?: string;
  role?: string;   // Default: "agent"
}

// Exemplo
const userData: CreateUserInput = {
  name: "João Silva",
  email: "joao@techsolutions.com",
  phone: "+55-11-98888-0000",
  role: "agent"
};
```

### Update User

```typescript
interface UpdateUserInput {
  name?: string;   // Se presente, 2+ caracteres
  phone?: string;
  role?: string;
}

// Exemplo
const updateData: UpdateUserInput = {
  name: "João Silva Santos",
  role: "manager"
};
```

### Create Property

```typescript
interface CreatePropertyInput {
  title: string;           // 3+ caracteres
  description?: string;
  latitude: number;        // -90 a 90
  longitude: number;       // -180 a 180
  status?: PropertyStatus; // Default: "AVAILABLE"
  contactPhone?: string;
  contactWhatsApp?: string;
}

// Exemplo
const propertyData: CreatePropertyInput = {
  title: "Apartamento Duplex Luxo",
  description: "Apartamento com 200m², 3 suites, garagem privada.",
  latitude: -23.5505,
  longitude: -46.6333,
  status: "AVAILABLE",
  contactPhone: "+55-11-99999-0000",
  contactWhatsApp: "+55-11-99999-0000"
};
```

---

## Helper Functions (React)

### Validação de Email

```typescript
function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
```

### Validação de Senha

```typescript
function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Mínimo 8 caracteres");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Pelo menos 1 letra maiúscula");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Pelo menos 1 letra minúscula");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Pelo menos 1 número");
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

// Uso
const result = validatePassword("abc");
console.log(result.valid);    // false
console.log(result.errors);   // ["Mínimo 8 caracteres", ...]
```

### Validação de Coordenadas

```typescript
function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Uso
validateCoordinates(-23.5505, -46.6333);  // true
validateCoordinates(200, 500);             // false
```

### Converter ISO para Data Legível

```typescript
function formatDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleString('pt-BR');
}

// Exemplo
formatDate("2026-04-22T17:55:18.994Z");
// Resultado: "22/4/2026, 14:55:18"
```

### Decodificar JWT

```typescript
function decodeJWT(token: string): {
  id: string;
  email: string;
  iat: number;
  exp: number;
} | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Erro ao decodificar JWT:', error);
    return null;
  }
}

// Uso
const token = localStorage.getItem('authToken');
const decoded = decodeJWT(token);
console.log(decoded?.id);
```

### Verificar Token Expirado

```typescript
function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token);
  if (!decoded) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

// Uso
if (isTokenExpired(token)) {
  // Redirecionar para login
  window.location.href = '/login';
}
```

### API Request Helper

```typescript
async function apiRequest<T>(
  url: string,
  method: string = 'GET',
  body?: unknown
): Promise<T> {
  const token = localStorage.getItem('authToken');

  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  });

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Token expirado
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    throw new Error(data.error?.message || 'Erro desconhecido');
  }

  return data;
}

// Uso
try {
  const response = await apiRequest('http://localhost:3000/api/users');
  console.log(response.data);
} catch (error) {
  console.error('Erro:', error.message);
}
```

---

## Exemplo de Contexto React (Auth)

```typescript
import { createContext, useState, useCallback } from 'react';

interface AuthContextType {
  token: string | null;
  companyId: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [companyId, setCompanyId] = useState(() => localStorage.getItem('companyId'));

  const login = useCallback(async (email: string, password: string) => {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (data.success) {
      localStorage.setItem('authToken', data.data.token);
      localStorage.setItem('companyId', data.data.company.id);
      setToken(data.data.token);
      setCompanyId(data.data.company.id);
    } else {
      throw new Error(data.error.message);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('companyId');
    setToken(null);
    setCompanyId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        companyId,
        login,
        logout,
        isAuthenticated: !!token
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar contexto
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

---

## Exemplo de Hook para Properties

```typescript
import { useState, useCallback } from 'react';

export function useProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest(
        'http://localhost:3000/api/properties'
      );
      setProperties(response.data);
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const create = useCallback(async (propertyData: CreatePropertyInput) => {
    try {
      const response = await apiRequest(
        'http://localhost:3000/api/properties',
        'POST',
        propertyData
      );
      setProperties([...properties, response.data]);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar imóvel:', error);
      throw error;
    }
  }, [properties]);

  return {
    properties,
    loading,
    fetch,
    create
  };
}
```

---

## Coordenadas Importantes (Brasil)

```typescript
const brazilianCities = {
  sãoPaulo: { lat: -23.5505, lng: -46.6333 },
  rioDeJaneiro: { lat: -22.9068, lng: -43.1729 },
  brasília: { lat: -15.7932, lng: -47.8822 },
  salvador: { lat: -12.9714, lng: -38.5014 },
  curitiba: { lat: -25.4284, lng: -49.2733 },
  fortaleza: { lat: -3.7319, lng: -38.5269 },
  manaus: { lat: -3.1190, lng: -60.0217 },
  buenosAires: { lat: -34.6037, lng: -58.3816 },
  belém: { lat: -1.4558, lng: -48.4902 },
  recife: { lat: -8.0476, lng: -34.8770 }
};

// Uso com Leaflet.js
import L from 'leaflet';

const map = L.map('map').setView(
  [brazilianCities.sãoPaulo.lat, brazilianCities.sãoPaulo.lng],
  13
);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```

---

## Exemplo Completo: Componente de Mapa

```typescript
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Property } from './types';

export function PropertyMap() {
  const mapRef = useRef<L.Map | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const { token } = useAuth();

  useEffect(() => {
    // Inicializar mapa
    if (!mapRef.current) {
      mapRef.current = L.map('map').setView([-23.5505, -46.6333], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(
        mapRef.current
      );
    }

    // Buscar propriedades
    fetchProperties();
  }, []);

  async function fetchProperties() {
    try {
      const response = await fetch('http://localhost:3000/api/properties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      setProperties(data.data);
      addMarkersToMap(data.data);
    } catch (error) {
      console.error('Erro:', error);
    }
  }

  function addMarkersToMap(props: Property[]) {
    const statusColors = {
      AVAILABLE: '#00AA00',
      NEGOTIATING: '#FFAA00',
      SOLD: '#FF0000'
    };

    props.forEach((prop) => {
      const marker = L.circleMarker(
        [prop.latitude, prop.longitude],
        {
          radius: 10,
          fillColor: statusColors[prop.status],
          color: '#000',
          weight: 2,
          opacity: 1,
          fillOpacity: 0.8
        }
      ).addTo(mapRef.current!);

      marker.bindPopup(`
        <b>${prop.title}</b><br>
        Status: ${prop.status}<br>
        ${prop.contactPhone || ''}
      `);
    });
  }

  return <div id="map" style={{ width: '100%', height: '600px' }} />;
}
```

---

**Pronto para usar no seu frontend!**
