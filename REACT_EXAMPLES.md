# 🎨 Exemplos Práticos de Integração React

> Copie e adapte esses exemplos para sua aplicação React

---

## 1️⃣ Setup API Client

### `src/api/client.ts`
```typescript
const API_BASE = 'http://localhost:3000/api';

type ApiResponse<T> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code: string;
  };
};

export const apiClient = {
  async request<T>(
    method: string,
    endpoint: string,
    body?: any,
    token?: string
  ): Promise<ApiResponse<T>> {
    const headers: HeadersInit = {
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

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'API Error');
    }

    return data;
  },

  // Auth methods
  async register(name: string, email: string, password: string, phone?: string) {
    return this.request('/auth/register', 'POST', {
      name,
      email,
      password,
      phone,
    });
  },

  async login(email: string, password: string) {
    return this.request('/auth/login', 'POST', {
      email,
      password,
    });
  },

  // User methods
  async getUsers(token: string, limit = 50, offset = 0) {
    return this.request(
      `/users?limit=${limit}&offset=${offset}`,
      'GET',
      undefined,
      token
    );
  },

  async getUser(userId: string, token: string) {
    return this.request(`/users/${userId}`, 'GET', undefined, token);
  },

  async createUser(token: string, name: string, email: string, phone?: string, role = 'agent') {
    return this.request(
      '/users',
      'POST',
      { name, email, phone, role },
      token
    );
  },

  async updateUser(token: string, userId: string, updates: any) {
    return this.request(`/users/${userId}`, 'PATCH', updates, token);
  },

  async deleteUser(token: string, userId: string) {
    return this.request(`/users/${userId}`, 'DELETE', undefined, token);
  },

  // Property methods
  async createProperty(
    token: string,
    title: string,
    latitude: number,
    longitude: number,
    description?: string,
    status = 'AVAILABLE'
  ) {
    return this.request(
      '/properties',
      'POST',
      {
        title,
        description,
        latitude,
        longitude,
        status,
      },
      token
    );
  },
};
```

---

## 2️⃣ Custom Hook para API

### `src/hooks/useApi.ts`
```typescript
import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (apiCall: () => Promise<any>) => {
    setLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      if (!result.success) {
        throw new Error(result.error?.message || 'API Error');
      }
      return result.data;
    } catch (err: any) {
      const message = err.message || 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { execute, loading, error };
};
```

---

## 3️⃣ Context para Autenticação

### `src/context/AuthContext.tsx`
```typescript
import { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';

interface Company {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  token: string | null;
  company: Company | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [company, setCompany] = useState<Company | null>(() => {
    const stored = localStorage.getItem('company');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string) => {
    const response = await apiClient.login(email, password);
    setToken(response.data.token);
    setCompany(response.data.company);
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('company', JSON.stringify(response.data.company));
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setCompany(null);
    localStorage.removeItem('token');
    localStorage.removeItem('company');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token,
        company,
        login,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

---

## 4️⃣ Login Component

### `src/pages/Login.tsx`
```typescript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await execute(() => login(email, password));
      navigate('/users');
    } catch (err) {
      // Error is already set in hook
    }
  };

  return (
    <div className="login-container">
      <h1>SmartMap Login</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
```

---

## 5️⃣ Lista de Usuários

### `src/pages/Users.tsx`
```typescript
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { useApi } from '../hooks/useApi';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const { execute, loading, error } = useApi();

  useEffect(() => {
    if (!token) return;

    const loadUsers = async () => {
      try {
        const data = await execute(() =>
          apiClient.getUsers(token, 50, 0)
        );
        setUsers(data.users);
        setTotal(data.total);
      } catch (err) {
        // Error handled by hook
      }
    };

    loadUsers();
  }, [token, execute]);

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja deletar?')) return;

    try {
      await execute(() => apiClient.deleteUser(token!, userId));
      setUsers(users.filter((u) => u.id !== userId));
      setTotal(total - 1);
    } catch (err) {
      // Error handled
    }
  };

  return (
    <div className="users-container">
      <h1>Users ({total})</h1>

      {error && <div className="error">{error}</div>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.phone || '-'}</td>
                <td>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
```

---

## 6️⃣ Criar Novo Usuário (Form)

### `src/components/CreateUserForm.tsx`
```typescript
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { useApi } from '../hooks/useApi';

interface CreateUserFormProps {
  onSuccess: (user: any) => void;
}

export function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const { token } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('agent');
  const { execute, loading, error } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await execute(() =>
        apiClient.createUser(token!, name, email, phone, role)
      );
      onSuccess(data);
      // Reset form
      setName('');
      setEmail('');
      setPhone('');
      setRole('agent');
    } catch (err) {
      // Error handled by hook
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create New User</h2>

      <div className="form-group">
        <label>Name *</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
        />
      </div>

      <div className="form-group">
        <label>Email *</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="agent">Agent</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

---

## 7️⃣ Criar Propriedade no Mapa

### `src/components/CreatePropertyForm.tsx`
```typescript
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiClient } from '../api/client';
import { useApi } from '../hooks/useApi';

interface MapClickEvent {
  latLng: { lat: number; lng: number };
}

export function CreatePropertyForm({ onSuccess }: { onSuccess: (property: any) => void }) {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [latitude, setLatitude] = useState(-22.9068); // Rio default
  const [longitude, setLongitude] = useState(-43.1729);
  const [status, setStatus] = useState('AVAILABLE');
  const mapRef = useRef<any>(null);
  const { execute, loading, error } = useApi();

  const handleMapClick = (e: any) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await execute(() =>
        apiClient.createProperty(
          token!,
          title,
          latitude,
          longitude,
          description,
          status
        )
      );
      onSuccess(data);
      // Reset form
      setTitle('');
      setDescription('');
      setLatitude(-22.9068);
      setLongitude(-43.1729);
    } catch (err) {
      // Error handled
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create New Property</h2>

      <div className="form-group">
        <label>Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          minLength={3}
          placeholder="Ex: Cobertura Duplex"
        />
      </div>

      <div className="form-group">
        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Ex: Cobertura de luxo com 250m², 3 suites, piscina"
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label>Latitude *</label>
          <input
            type="number"
            value={latitude}
            onChange={(e) => setLatitude(parseFloat(e.target.value))}
            required
            min={-90}
            max={90}
            step={0.0001}
          />
        </div>

        <div className="form-group">
          <label>Longitude *</label>
          <input
            type="number"
            value={longitude}
            onChange={(e) => setLongitude(parseFloat(e.target.value))}
            required
            min={-180}
            max={180}
            step={0.0001}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="AVAILABLE">Available</option>
          <option value="NEGOTIATING">Negotiating</option>
          <option value="SOLD">Sold</option>
        </select>
      </div>

      {error && <div className="error">{error}</div>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Property'}
      </button>

      <p className="hint">
        Clique no mapa para selecionar a localização
        <br />
        Lat: {latitude.toFixed(4)} | Lng: {longitude.toFixed(4)}
      </p>
    </form>
  );
}
```

---

## 8️⃣ Setup App.tsx

### `src/App.tsx`
```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Login } from './pages/Login';
import { Users } from './pages/Users';
import { PrivateRoute } from './components/PrivateRoute';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <Users />
              </PrivateRoute>
            }
          />
          <Route path="/" element={<Navigate to="/users" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### `src/components/PrivateRoute.tsx`
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
```

---

## 🎯 Dados de Teste

### Testando no Swagger
```
Empresa: admin@imoveisbrasil.com
Senha: Senha@2026
```

### Coordenadas Brasileiras
```typescript
const coordinates = {
  rio: { latitude: -22.9068, longitude: -43.1729 },
  sao_paulo: { latitude: -23.5505, longitude: -46.6333 },
  salvador: { latitude: -12.9714, longitude: -38.5014 },
  brasilia: { latitude: -15.7942, longitude: -47.8822 },
  belo_horizonte: { latitude: -19.9191, longitude: -43.9386 },
  curitiba: { latitude: -25.4267, longitude: -49.2733 },
  fortaleza: { latitude: -3.7319, longitude: -38.5267 },
};
```

---

## 💡 Dicas de Implementação

1. **Sempre use o token do context** - Nunca salve em variáveis globais
2. **Trate erros da API** - Mostre mensagens amigáveis ao usuário
3. **Use loading states** - Desabilite botões enquanto carrega
4. **Valide input** - Use os constraints HTML + JS validation
5. **Teste no Swagger primeiro** - Antes de testar no React
6. **Use TypeScript** - Para melhor DX com autocomplete
7. **Memoize components** - Use React.memo para otimizar

---

## 🧪 Testando Localmente

```bash
# Terminal 1 - Backend
cd /Users/cash/Desktop/api
npm run dev

# Terminal 2 - Frontend
npx create-react-app smartmap-frontend --template typescript
cd smartmap-frontend
npm install react-router-dom

# Copie os arquivos de exemplo acima para src/
npm start
```

---

**Pronto para começar o desenvolvimento! 🚀**

