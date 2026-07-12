# Ticketing API - Frontend 🎨

Interface moderna para gerenciamento de eventos e venda de ingressos construída com React, TypeScript, Vite e Tailwind CSS.

## 🚀 Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Type safety
- **Vite** - Build tool rápido
- **Tailwind CSS** - Utility-first CSS
- **React Router** - Navegação entre páginas
- **Fetch API** - Requisições HTTP

## 📦 Instalação

### Pré-requisitos
- Node.js v18+
- npm ou yarn

### Setup

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env

# Iniciar servidor de desenvolvimento
npm run dev
```

### Build para produção

```bash
npm run build
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Header.tsx          # Navegação e autenticação
│   ├── EventCard.tsx       # Card de exibição de eventos
│   └── ...
├── pages/
│   ├── Home.tsx            # Página inicial
│   ├── Login.tsx           # Página de login
│   ├── Register.tsx        # Página de cadastro
│   ├── Events.tsx          # Listagem de eventos
│   └── ...
├── contexts/
│   └── AuthContext.tsx     # Contexto de autenticação
├── services/
│   └── api.ts              # Cliente HTTP para API
├── types/
│   └── index.ts            # TypeScript types e interfaces
├── App.tsx                 # Componente raiz com rotas
└── main.tsx                # Entry point
```

## 🔐 Autenticação

A aplicação usa **React Context** para gerenciar autenticação:

- Tokens JWT armazenados em `localStorage`
- Contexto `AuthProvider` disponível em toda aplicação
- Hook `useAuth()` para acessar estado de autenticação
- Rotas protegidas com componente `ProtectedRoute`

### Usar o hook de autenticação

```typescript
import { useAuth } from './contexts/AuthContext';

function MyComponent() {
  const { user, token, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated ? (
        <span>Bem-vindo, {user?.name}!</span>
      ) : (
        <span>Não autenticado</span>
      )}
    </div>
  );
}
```

## 🌐 Configuração da API

Edite o arquivo `.env` para alterar a URL da API:

```env
VITE_API_URL=http://localhost:3000/api
```

## 📝 Páginas Disponíveis

### Públicas
- **Home** (`/`) - Página inicial com informações
- **Login** (`/login`) - Formulário de login
- **Register** (`/register`) - Formulário de cadastro

### Privadas (requer autenticação)
- **Events** (`/events`) - Listagem de eventos
- **Event Details** (`/events/:id`) - Detalhes do evento (em desenvolvimento)

## 🎨 Tailwind CSS

Cores personalizadas configuradas em `tailwind.config.js`:

```javascript
colors: {
  primary: '#6366f1',      // Indigo
  secondary: '#8b5cf6',    // Violet
}
```

## 🔌 Integrações com API

### Login
```typescript
POST /api/auth/login
{
  email: string;
  password: string;
}
```

### Registro
```typescript
POST /api/auth/register
{
  name: string;
  email: string;
  password: string;
}
```

### Listar Eventos
```typescript
GET /api/events
// Headers: { Authorization: 'Bearer {token}' }
```

## 📝 Tipos TypeScript

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'CLIENT' | 'ADMIN';
}

interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  location: string;
  organizer: User;
  tickets: Ticket[];
}

interface Ticket {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
}
```

## 🚦 Status do Projeto

- ✅ Setup com React + TypeScript + Vite
- ✅ Tailwind CSS integrado
- ✅ Autenticação com Context API
- ✅ Páginas de Login e Registro
- ✅ Listagem de Eventos
- ✅ Componentes base (Header, EventCard)
- ⏳ Detalhes do evento
- ⏳ Compra de ingressos
- ⏳ Painel do usuário
- ⏳ Dashboard de admin
- ⏳ Testes unitários
- ⏳ Deploy

## 🛠️ Scripts Disponíveis

```bash
npm run dev      # Inicia servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
npm run lint     # Lint com Oxlint
```

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ por Vitor**
