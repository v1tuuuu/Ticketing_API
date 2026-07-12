# Como Rodar o Projeto Ticketing API

Este documento descreve como configurar e rodar o projeto completo localmente.

## 📋 Pré-requisitos

- Node.js v18+
- npm ou yarn
- PostgreSQL 15+ (local ou Docker)
- Git

## 🚀 Configuração Rápida com Docker

### 1. Iniciar PostgreSQL com Docker

```bash
cd /home/vitor/ticketing-api

# Copiar o arquivo de ambiente e configurar
cp .env.example .env

# Editar .env com as credenciais (opcional)
# nano .env

# Iniciar o container PostgreSQL
docker-compose up -d
```

### 2. Configurar o Backend

```bash
# Na pasta raiz do projeto
npm install

# Executar migrations do Prisma
npx prisma migrate deploy

# Iniciar servidor de desenvolvimento
npm run dev
```

O backend estará rodando em `http://localhost:3000`

### 3. Configurar o Frontend

Em outro terminal:

```bash
cd frontend

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## 📝 Variáveis de Ambiente

### Backend (.env)

```env
# Database
DATABASE_URL=postgresql://admin:sua_senha@localhost:5432/ticketing
POSTGRES_USER=admin
POSTGRES_PASSWORD=sua_senha
POSTGRES_DB=ticketing

# JWT
JWT_SECRET=sua_chave_secreta_jwt

# Server
PORT=3000
NODE_ENV=development
```

### Frontend (frontend/.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## 🐳 Verificar Docker

```bash
# Ver containers rodando
docker ps

# Ver logs do PostgreSQL
docker logs ticketing_db

# Parar os containers
docker-compose down

# Parar e remover volumes (cuidado - deleta dados!)
docker-compose down -v
```

## 🔄 Workflow de Desenvolvimento

### Terminal 1 - Backend
```bash
npm run dev
# Outputs: 🚀 Servidor rodando com sucesso em http://localhost:3000
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
# Outputs: ➜  Local:   http://localhost:5173/
```

### Terminal 3 - Database (se não usar Docker)
```bash
# Conectar ao PostgreSQL
psql -U admin -d ticketing

# Ou criar database manualmente
createdb -U admin ticketing
```

## 📊 Estrutura de Pastas

```
ticketing-api/
├── src/                    # Backend TypeScript
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── middlewares/
│   ├── prisma.ts
│   └── serve.ts
├── prisma/                 # Database schema e migrations
│   ├── schema.prisma
│   └── migrations/
├── frontend/               # Frontend React
│   ├── src/
│   ├── public/
│   ├── vite.config.ts
│   └── package.json
├── docker-compose.yml      # Orquestração Docker
├── package.json            # Dependências backend
└── tsconfig.json
```

## 🔌 Testar a API

### Com cURL

```bash
# Registrar usuário
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@example.com",
    "password": "senha123"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "password": "senha123"
  }'
```

### Com Insomnia/Postman

1. Importar a API base: `http://localhost:3000/api`
2. Testar endpoints em `src/routes/`

## ⚙️ Scripts Disponíveis

### Backend

```bash
npm run dev       # Iniciar servidor com hot reload
npm run build     # Build para produção
npx prisma studio # Acessar dashboard do Prisma (http://localhost:5555)
npx prisma migrate dev --name <name> # Criar nova migration
```

### Frontend

```bash
npm run dev       # Iniciar dev server
npm run build     # Build para produção
npm run preview   # Preview do build
npm run lint      # Executar linter
```

## 🐛 Troubleshooting

### PostgreSQL connection refused
```bash
# Verificar se o container está rodando
docker ps

# Reiniciar container
docker-compose restart postgres

# Ver logs do container
docker logs ticketing_db
```

### Port already in use
```bash
# Backend (3000)
kill -9 $(lsof -ti:3000)

# Frontend (5173)
kill -9 $(lsof -ti:5173)
```

### Migrations falhas
```bash
# Reset database (cuidado - deleta tudo!)
npx prisma migrate reset

# Ver status das migrations
npx prisma migrate status
```

## 📚 Documentação

- [Backend README](./README.md)
- [Frontend README](./frontend/README.md)
- [Prisma Docs](https://www.prisma.io/docs/)
- [React Router Docs](https://reactrouter.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/)

## 🔐 Segurança

⚠️ **Importante**: Nunca comitar arquivos `.env` com valores reais! Use apenas `.env.example` para referência.

```bash
# O arquivo .env já está no .gitignore
cat .gitignore | grep .env
```

## 💡 Próximos Passos

1. ✅ Implementar rota GET /api/events
2. ✅ Implementar rota POST /api/events
3. ✅ Implementar rota GET /api/events/:id
4. ⏳ Implementar middleware de autenticação
5. ⏳ Implementar CRUD completo de tickets
6. ⏳ Testes unitários
7. ⏳ Deploy em produção

---

**Desenvolvido com ❤️ por Vitor**
