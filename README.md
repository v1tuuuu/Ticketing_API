# Ticketing API 🎟️

API REST para gestão de eventos e ingressos, com autenticação, validações e persistência em banco relacional.

## 🎯 Sobre o Projeto

Este projeto oferece uma base para criar, listar, atualizar e remover eventos, além de autenticar usuários e controlar acesso a operações sensíveis.

## 🏗️ Arquitetura e Stack

- Node.js
- TypeScript
- Express
- PostgreSQL
- Prisma
- JWT para autenticação
- bcrypt para hash de senhas
- Zod para validação

## 📊 Modelos de Dados

### Usuários
- id único
- nome
- email único
- senha protegida por hash
- papel/perfil do usuário
- dados de criação e atualização

### Eventos
- id único
- título
- descrição
- data
- localização
- usuário responsável
- registros de criação e atualização

### Ingressos
- id único
- nome do lote
- preço
- quantidade total
- quantidade vendida
- associação ao evento

## 🔐 Autenticação

A API usa autenticação baseada em tokens e senha com hash seguro.

- fluxo de cadastro e login
- proteção de rotas por perfil ou proprietário
- tokens configurados via variáveis de ambiente

## 🛣️ Rotas Principais

### Autenticação
- `POST /api/auth/register`
- `POST /api/auth/login`

### Eventos
- `POST /api/events`
- `GET /api/events`
- `GET /api/events/:id`
- `PUT /api/events/:id`
- `DELETE /api/events/:id`

## 🧪 Validações

- nome e email válidos no registro
- senha com comprimento mínimo definido pela regra do projeto
- campos obrigatórios em eventos
- dados sanitizados antes de persistir

## 🗄️ Banco de Dados

O projeto utiliza Prisma com PostgreSQL e migrações para versionar o schema.

### Migrações
- migração inicial
- migração de usuários e ingressos

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js
- npm
- banco PostgreSQL disponível

### Instalação

```bash
npm install
cp .env.example .env
# edite o arquivo .env com suas configurações locais
npx prisma migrate deploy
npm run dev
```

### Variáveis de Ambiente

Configure as variáveis do ambiente de acordo com seu ambiente local ou de desenvolvimento, sem expor valores reais no repositório.

```env
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secret_key
PORT=3000
NODE_ENV=development
```

## 🧪 Testes

- `npm test`
- `npm run test:watch`

Os testes usam configuração específica para ambiente de teste e devem manter valores sensíveis fora do código versionado.

## 📁 Estrutura do Projeto

```text
src/
├── controllers/
├── routes/
├── middlewares/
├── prisma.ts
├── serve.ts
prisma/
├── schema.prisma
├── migrations/
```

## ✅ Status do Projeto

- Backend em Express + TypeScript
- Autenticação com JWT e hash de senha
- Validação com Zod
- CRUD de eventos
- Persistência com Prisma + PostgreSQL
- Testes automatizados

## 📄 Licença

A definir conforme a política da organização ou do mantenedor do projeto.
