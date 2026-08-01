# Ticketing API 🎟️

Uma API REST para gerenciamento de eventos e ingressos construída com Express, TypeScript, PostgreSQL e Prisma.

## 🎯 Sobre o Projeto

Ticketing API permite criar e gerenciar eventos, autenticar usuários e proteger operações de CRUD por perfil.

## 🏗️ Arquitetura e Stack

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework Web**: Express.js v5.2.1
- **ORM**: Prisma v7.8.0
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT + bcrypt
- **Validação**: Zod
- **Desenvolvimento**: tsx

## 📦 Dependências Principais

```json
{
  "@prisma/client": "^7.8.0",
  "@prisma/adapter-pg": "^7.8.0",
  "express": "^5.2.1",
  "jsonwebtoken": "^9.0.3",
  "bcrypt": "^6.0.0",
  "zod": "^4.4.3",
  "pg": "^8.21.0",
  "dotenv": "^17.4.2"
}
```

## 📊 Modelos de Dados

### User (Usuários)
```typescript
- id: UUID (único)
- name: String
- email: String (único)
- password: String (hash bcrypt)
- role: Enum (CLIENT | ADMIN)
- createdAt: DateTime
- updatedAt: DateTime
- events: Event[]
```

### Event (Eventos)
```typescript
- id: UUID (único)
- title: String
- description: String? 
- date: DateTime
- location: String
- createdAt: DateTime
- updatedAt: DateTime
- userId: String (FK para User)
- organizer: User
- tickets: Ticket[]
```

### Ticket (Lotes de Ingressos)
```typescript
- id: UUID (único)
- name: String
- price: Float
- quantity: Int
- sold: Int @default(0)
- createdAt: DateTime
- updatedAt: DateTime
- eventId: String (FK para Event)
- event: Event
```

## 🔐 Autenticação

A API utiliza **JWT** para autenticação e controle de acesso.

- **Payload**: `{ id: string, role: Role }`
- **Expiração**: 1 dia
- **Segurança**: hash de senha com bcrypt

## 🛣️ Rotas Implementadas

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login e geração de token JWT

### Eventos
- `POST /api/events` - Criar evento (autenticado)
- `GET /api/events` - Listar eventos (autenticado)
- `GET /api/events/:id` - Buscar evento por ID (autenticado)
- `PUT /api/events/:id` - Atualizar evento (autenticado, organizador/Admin)
- `DELETE /api/events/:id` - Excluir evento (autenticado, organizador/Admin)

## 🧪 Validações

- Registro: nome mínimo 2 caracteres, email válido, senha mínima 6 caracteres
- Login: email válido, senha obrigatória
- Eventos: title, date e location obrigatórios

## 🗄️ Banco de Dados

- Conexão via `DATABASE_URL`
- Prisma configurado com `@prisma/adapter-pg`
- Retry automático de conexão para suportar inicialização gradual do banco via Docker Compose

### Migrations Aplicadas
1. `20260627192625_init`
2. `20260706183223_add_users_and_tickets`

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL (local ou Docker)
- npm

### Instalação

```bash
git clone https://github.com/vitor/ticketing-api.git
cd ticketing-api
npm install
cp .env.example .env
# editar .env com suas credenciais
npx prisma migrate deploy
npm run dev
```

### Variáveis de Ambiente

```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/ticketing_db
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
NODE_ENV=development
```

## 🧪 Testes

- `npm test` - executa Vitest com `NODE_ENV=test`
- `npm run test:watch` - executa testes em modo watch
- Usa `.env.test` para configuração de testes

## 📁 Estrutura do Projeto

```
src/
├── controllers/
│   ├── eventControllers.ts
│   └── user.controllers.ts
├── routes/
│   ├── eventRoutes.ts
│   └── userRoutes.ts
├── middlewares/
│   └── middleware.ts
├── prisma.ts
└── serve.ts

prisma/
├── schema.prisma
└── migrations/
```

## ✅ Status do Projeto

- ✅ Backend em Express + TypeScript
- ✅ Autenticação JWT + bcrypt
- ✅ Validação com Zod
- ✅ CRUD de eventos com proteção de permissão
- ✅ Prisma com PostgreSQL
- ✅ Testes com Vitest e Supertest
- ✅ Retry de conexão do banco no startup

## 📄 Licença

ISC
