# Backend - Weather API (NestJS)

API RESTful robusta para gerenciamento de dados meteorológicos, autenticação de usuários, integração com Pokémon e análise com OpenAI.

## 🏗️ Visão Geral

Backend desenvolvido com **NestJS** (framework Node.js escalável), **MongoDB** para persistência de dados, **JWT** para autenticação e **OpenAI** para análise de padrões meteorológicos.

### Stack Tecnológico

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| NestJS | 11.0.1 | Framework web |
| TypeScript | 5.x | Type safety |
| MongoDB | latest | Database |
| Mongoose | 8.20.1 | ODM |
| JWT (Passport) | 11.0.1 | Autenticação |
| OpenAI | 6.10.0 | IA e análise |
| Jest | 29.x | Testes |
| Migrate-Mongo | 12.1.3 | Migrations |

## 📂 Estrutura do Projeto

```
weather_nest_api/
├── src/
│   ├── auth/                      # Autenticação
│   │   ├── auth.controller.ts     # Endpoints login/register
│   │   ├── auth.service.ts        # Lógica de autenticação
│   │   ├── auth.module.ts         # Módulo
│   │   └── jwt.strategy.ts        # Estratégia Passport JWT
│   ├── users/                     # Gerenciamento de usuários
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   ├── users.module.ts
│   │   ├── create-user.dto.ts
│   │   ├── user.seed.ts           # Seed de usuários
│   │   └── schemas/
│   │       └── user.schema.ts     # Schema MongoDB
│   ├── weather/                   # Dados meteorológicos
│   │   ├── weather.controller.ts
│   │   ├── weather.service.ts
│   │   ├── weather.module.ts
│   │   └── schemas/
│   │       └── weather.schema.ts
│   ├── pokemon/                   # Integração Pokémon
│   │   ├── pokemon.controller.ts
│   │   ├── pokemon.service.ts
│   │   ├── pokemon.module.ts
│   │   └── pokemon.service.spec.ts
│   ├── utils/
│   │   └── flattenWeatherRecord.ts
│   ├── app.module.ts              # Módulo principal
│   ├── app.controller.ts          # Endpoints gerais
│   ├── app.service.ts
│   ├── create-weather.dto.ts
│   └── main.ts                    # Entry point
├── test/
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── scripts/
│   └── seed-weather.ts            # Script de seed
├── Dockerfile.dev                 # Dev container
├── Dockerfile                     # Produção
├── package.json
├── tsconfig.json
├── nest-cli.json
└── migrate-mongo-config.ts
```

## 🚀 Como Começar

### Instalação Local

```bash
# Entrar no diretório
cd weather_nest_api

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env

# Iniciar em modo desenvolvimento
npm run start:dev

# API disponível em: http://localhost:3000
```

### Com Docker

```bash
# Build
docker build -t weather-api:latest -f Dockerfile.dev .

# Run
docker run -p 3000:3000 \
  -e MONGODB_URI=mongodb://mongodb:27017/weatherDB \
  -e OPENAI_API_KEY=sua_chave \
  weather-api:latest
```

### Build para Produção

```bash
# Build
npm run build

# Start produção
npm run start:prod
```

## 🔌 Endpoints da API

### Autenticação

```bash
# Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Response
{
  "access_token": "eyJhbGc...",
  "user": { "id": "...", "email": "user@example.com" }
}

# Registro
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User"
}
```

### Dados Meteorológicos

```bash
# Obter última leitura
GET /api/weather
Authorization: Bearer <token>

# Obter histórico
GET /api/weather/logs
Authorization: Bearer <token>

# Postar novo dado (via Worker)
POST /api/weather/logs
Content-Type: application/json

{
  "temp": 28.5,
  "feels_like": 30,
  "humidity": 65,
  "wind_speed": 5.2,
  "description": "Céu limpo"
}
```

### Pokémon

```bash
# Listar Pokémon
GET /api/pokemon
Authorization: Bearer <token>

# Obter por ID
GET /api/pokemon/:id
Authorization: Bearer <token>
```

### Exportação de Dados

```bash
# Excel
GET /api/weather/export/excel
Authorization: Bearer <token>

# CSV
GET /api/weather/export/csv
Authorization: Bearer <token>
```

## 🔐 Autenticação

### JWT Strategy

```typescript
// src/auth/jwt.strategy.ts
// Valida tokens JWT nos headers Authorization: Bearer <token>
// Injeta usuário no request context
```

### Proteção de Rotas

```typescript
// Usar decorator @UseGuards(JwtAuthGuard) em controllers
@UseGuards(JwtAuthGuard)
@Get('/protected')
getProtected() { ... }
```

## 📊 Modelos de Dados

### User Schema
```typescript
{
  _id: ObjectId,
  email: string (unique),
  password: string (hashed with bcryptjs),
  name?: string,
  createdAt: Date,
  updatedAt: Date
}
```

### Weather Schema
```typescript
{
  _id: ObjectId,
  temp: number,
  feels_like: number,
  temp_min: number,
  temp_max: number,
  pressure: number,
  humidity: number,
  visibility: number,
  wind: {
    speed: number,
    deg: number,
    gust?: number
  },
  description: string,
  location: string,
  latitude: number,
  longitude: number,
  timestamp: Date,
  createdAt: Date
}
```

## 🧪 Testes

```bash
# Unit tests
npm run test

# Tests com cobertura
npm run test:cov

# E2E tests
npm run test:e2e

# Watch mode
npm run test:watch
```

## 🔄 Migrations

### Criar nova migration

```bash
# Usando Migrate-Mongo
npx migrate-mongo create <nome_migration>

# Aplicar migrations
npx migrate-mongo up

# Reverter última migration
npx migrate-mongo down
```

### Status das migrations

```bash
npx migrate-mongo status
```

## 🌱 Seed de Dados

### Executar seed

```bash
# Seed de usuários padrão (ao iniciar)
npm run start:dev

# Seed de dados meteorológicos
npm run seed
```

### Usuário padrão criado

```
Email: user@example.com
Senha: password123
```

## 📋 Variáveis de Ambiente

```env
# Node
NODE_ENV=development

# Database
MONGODB_URI=mongodb://mongodb:27017/weatherDB

# JWT
JWT_SECRET=seu_secret_super_seguro
JWT_EXPIRATION=7d

# OpenAI
OPENAI_API_KEY=sk-proj-xxx

# Server
PORT=3000
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run start              # Iniciar servidor
npm run start:dev         # Watch mode
npm run start:debug       # Debug mode

# Build
npm run build             # Compilar TypeScript

# Testes
npm run test              # Unit tests
npm run test:watch       # Watch mode
npm run test:cov         # Com cobertura
npm run test:e2e         # E2E tests

# Lint
npm run lint              # ESLint
npm run format            # Prettier

# Database
npm run seed              # Seed de dados
```

## 🎯 Features Principais

### ✅ Implementadas
- [x] Autenticação JWT com Passport
- [x] CRUD de usuários
- [x] Armazenamento de dados meteorológicos
- [x] Integração com Pokémon API
- [x] Análise com OpenAI GPT
- [x] Exportação em Excel e CSV
- [x] Validação com DTOs
- [x] Migrations com Migrate-Mongo
- [x] Testes unitários e E2E
- [x] CORS habilitado

### 🔄 Em Desenvolvimento
- [ ] Paginação avançada
- [ ] Rate limiting
- [ ] Cache com Redis
- [ ] WebSocket para real-time

## 🚨 Troubleshooting

### Erro de conexão MongoDB
```bash
# Verificar se MongoDB está rodando
docker ps | grep mongodb

# Conectar diretamente
mongosh mongodb://localhost:27017/weatherDB
```

### Erro de autenticação JWT
- Verificar se `JWT_SECRET` está setada
- Verificar se token está sendo enviado corretamente no header
- Token pode ter expirado

### Porta 3000 já em uso
```bash
lsof -i :3000
kill -9 <PID>
```

### Migrations com erro
```bash
# Resetar migrations
npx migrate-mongo down  # Múltiplas vezes

# Recriar
npx migrate-mongo up
```

## 📦 Dependências Principais

### Runtime
- **@nestjs/core** - Framework principal
- **@nestjs/mongoose** - Integração MongoDB
- **@nestjs/jwt** - JWT para autenticação
- **@nestjs/passport** - Estratégias de autenticação
- **mongoose** - ODM para MongoDB
- **bcryptjs** - Hash de senhas
- **openai** - Cliente OpenAI
- **exceljs** - Exportar para Excel
- **json2csv** - Exportar para CSV

### Dev
- **@nestjs/cli** - CLI do NestJS
- **@nestjs/schematics** - Generators
- **@nestjs/testing** - Testes
- **jest** - Test runner
- **typescript** - Type safety
- **ts-node** - Executor TypeScript

## 🔗 Recursos Úteis

- [NestJS Docs](https://docs.nestjs.com)
- [MongoDB Docs](https://docs.mongodb.com)
- [Mongoose Docs](https://mongoosejs.com)
- [OpenAI API](https://platform.openai.com/docs)
- [Passport.js](http://www.passportjs.org)

## 🤝 Padrões Utilizados

- **MVC Architecture**: Controllers, Services, Modules
- **Dependency Injection**: Padrão do NestJS
- **DTOs**: Data Transfer Objects para validação
- **Middleware**: CORS, Logging
- **Guards**: Autenticação e autorização
- **Pipes**: Validação de entrada
---

**Backend Version**: 1.0.0  
**Last Updated**: Dezembro 2025
