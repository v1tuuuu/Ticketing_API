# Ticketing API 🎟️

Uma API REST para gerenciamento de eventos e vendas de ingressos construída com Express, TypeScript, PostgreSQL e Prisma.

## 🎯 Sobre o Projeto

Ticketing API é uma plataforma que permite criar e gerenciar eventos, definir lotes de ingressos e controlar a venda de ingressos para diferentes tipos de eventos.

## 🏗️ Arquitetura e Stack

- **Runtime**: Node.js
- **Linguagem**: TypeScript
- **Framework Web**: Express.js v5.2.1
- **ORM**: Prisma v7.8.0
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT (JSON Web Tokens) + bcrypt
- **Validação**: Zod
- **Desenvolvimento**: tsx watch

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
- events: Event[] (relacionamento)
```

### Event (Eventos)
```typescript
- id: UUID (único)
- title: String
- description: String (opcional)
- date: DateTime
- location: String
- createdAt: DateTime
- updatedAt: DateTime
- userId: String (FK para User - organizador)
- organizer: User (relacionamento)
- tickets: Ticket[] (relacionamento)
```

### Ticket (Lotes de Ingressos)
```typescript
- id: UUID (único)
- name: String (ex: "Lote 1 - Pista", "Camarote VIP")
- price: Float
- quantity: Int (total disponível)
- sold: Int (já vendidos, padrão 0)
- createdAt: DateTime
- updatedAt: DateTime
- eventId: String (FK para Event)
- event: Event (relacionamento)
```

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Tokens)** para autenticação:

- **Token payload**: `{ id: string, role: Role }`
- **Expiração**: 1 dia
- **Segurança**: Senhas hash com bcrypt (salt rounds: 10)

## 🛣️ Rotas Implementadas

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login e obter token JWT

### Validações
- **Registro**: Nome (min 2 chars), Email válido, Senha (min 6 chars)
- **Login**: Email válido, Senha obrigatória

## 🗄️ Database

### Migrations Aplicadas
1. **20260627192625_init**: Schema inicial
2. **20260706183223_add_users_and_tickets**: Modelos User, Event e Ticket

### Adapter
- Usando `@prisma/adapter-pg` para otimização com PostgreSQL

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL (local ou Docker)
- npm ou yarn

### Instalação

```bash
# Clonar repositório
git clone https://github.com/vitor/ticketing-api.git
cd ticketing-api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas credenciais do PostgreSQL

# Executar migrations
npx prisma migrate deploy

# Iniciar servidor em modo desenvolvimento
npm run dev
```

### Variáveis de Ambiente
```
DATABASE_URL=postgresql://usuario:senha@localhost:5432/ticketing_db
JWT_SECRET=sua_chave_secreta_aqui
PORT=3000
```

## 📝 Exemplo de Uso

### Registrar usuário
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Fazer login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

## 📁 Estrutura do Projeto

```
src/
├── controllers/
│   ├── user.controllers.ts       # Controllers de autenticação e usuários
│   └── eventControllers.ts       # Controllers de eventos (em desenvolvimento)
├── routes/
│   └── eventRoutes.ts            # Rotas da API
├── middlewares/
│   └── middleware.ts             # Middlewares customizados
├── services/                     # Lógica de negócio
├── prisma.ts                     # Configuração do Prisma Client
└── serve.ts                      # Entrada da aplicação

prisma/
├── schema.prisma                 # Schema do banco de dados
└── migrations/                   # Histórico de migrations
```

## 🔄 Fluxo de Desenvolvimento

1. **Autenticação**: Registro e Login de usuários com JWT
2. **Gestão de Eventos**: CRUD de eventos (em desenvolvimento)
3. **Gestão de Ingressos**: Criação e venda de lotes de ingressos
4. **Controle de Acesso**: Diferenciação entre roles (CLIENT/ADMIN)

## ✅ Status do Projeto

- ✅ Setup inicial com Express + TypeScript
- ✅ Configuração do Prisma + PostgreSQL
- ✅ Modelos de dados (User, Event, Ticket)
- ✅ Autenticação com JWT + bcrypt
- ✅ Controllers de usuários (register, login)
- ✅ Validação com Zod
- ⏳ Controllers de eventos (em desenvolvimento)
- ⏳ Middleware de autenticação
- ⏳ Testes unitários
- ⏳ Documentação com Swagger/OpenAPI
- ⏳ Deployment

## 📄 Licença

ISC

---

**Desenvolvido com ❤️ por Vitor**
