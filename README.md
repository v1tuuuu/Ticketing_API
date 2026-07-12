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
