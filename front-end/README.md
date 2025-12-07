# Frontend - GDASH Weather Dashboard

Interface web moderna e responsiva para visualização de dados meteorológicos em tempo real, integração com Pokémon e análise com IA.

## 🎨 Visão Geral

Frontend construído com **React 19** + **TypeScript** + **Vite**, oferecendo uma experiência de usuário fluida com mapa interativo, autenticação e dashboard completo.

### Stack Tecnológico

| Tecnologia | Versão | Propósito |
|-----------|--------|----------|
| React | 19.2.0 | Framework UI |
| TypeScript | 5.9.3 | Type safety |
| Vite | 7.2.4 | Build tool |
| TailwindCSS | 3.4.18 | Styling |
| Leaflet | 1.9.4 | Mapa interativo |
| React Router | 7.10.0 | Navegação |
| React Hook Form | 7.67.0 | Gerenciamento de formulários |
| Zod | 4.1.13 | Validação de schema |
| React Toastify | 11.0.5 | Notificações |

## 📂 Estrutura do Projeto

```
front-end/
├── public/                        # Arquivos estáticos
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── ui/                   # Componentes Radix UI reutilizáveis
│   │   │   ├── button.tsx        # Botão genérico
│   │   │   ├── card.tsx          # Card container
│   │   │   ├── dialog.tsx        # Modal/Dialog
│   │   │   ├── form.tsx          # Form wrapper
│   │   │   ├── input.tsx         # Input field
│   │   │   └── label.tsx         # Label
│   │   ├── Input.tsx             # Custom input component
│   │   └── (outros componentes)
│   ├── pages/
│   │   ├── Login.tsx             # Página de login
│   │   ├── Register.tsx          # Página de registro
│   │   └── Dashboard.tsx         # Dashboard principal
│   ├── services/
│   │   └── auth.ts               # Serviço de autenticação
│   ├── lib/
│   │   └── utils.ts              # Utilitários (classnames merge)
│   ├── assets/                   # Imagens e assets
│   ├── App.tsx                   # Componente root
│   ├── main.tsx                  # Entry point
│   ├── index.css                 # Estilos globais
│   └── vite-env.d.ts             # Tipos Vite
├── Dockerfile                    # Produção
├── package.json
├── vite.config.ts                # Configuração Vite
├── tailwind.config.js            # Configuração TailwindCSS
├── tsconfig.json                 # TypeScript config
└── eslint.config.js              # ESLint config
```

## 🚀 Como Começar

### Instalação Local

```bash
# Entrar no diretório
cd front-end

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Acesso: http://localhost:5173
```

### Com Docker

```bash
# Build
docker build -t gdash-frontend:latest .

# Run
docker run -p 5173:5173 -v $(pwd):/app gdash-frontend:latest
```

### Build para Produção

```bash
# Build
npm run build

# Preview local
npm run preview

# Os arquivos estão em: dist/
```

## 📖 Páginas Principais

### 1. Login (\`/login\`)
- Autenticação via JWT
- Email e senha
- Redirecionamento automático para Dashboard após login
- Link para registro de novo usuário
- Mensagens de erro amigáveis

### 2. Register (\`/register\`)
- Criação de nova conta
- Validação de formulário com Zod
- Senhas com hash bcryptjs (processadas no backend)
- Redirecionamento para login após registro

### 3. Dashboard (\`/dashboard\`)
**Componentes principais**:

#### Informações Meteorológicas
- Temperatura atual, sensação térmica
- Temperatura mín/máx
- Pressão atmosférica
- Umidade
- Visibilidade
- Velocidade do vento

#### Mapa Interativo
- Powered by Leaflet
- Marcador da localização (São Paulo)
- Popup com informações básicas
- TileLayer do OpenStreetMap

#### Pokémon relacionados
- Exibe Pokémon baseado na condição climática atual
- Mostra estatísticas do Pokémon
- Cards bonitos com imagens

#### Análise com IA
- Integração com OpenAI GPT
- Gera insights sobre padrões meteorológicos
- Análise de tendências

#### Ações
- **Download de Dados**: Exporta em Excel ou CSV
- **Logout**: Retorna para login

## 🔌 Integração com API

### Endpoints Utilizados

```typescript
// Autenticação
POST   /api/auth/login        // Login
POST   /api/auth/register     // Registro

// Dados Meteorológicos
GET    /api/weather           // Última leitura
GET    /api/weather/logs      // Histórico

// Pokémon
GET    /api/pokemon           // Lista de Pokémon

// Exportação
GET    /api/weather/export/excel  // Download Excel
GET    /api/weather/export/csv    // Download CSV
```

## 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Inicia dev server (hot reload)

# Build
npm run build            # Build otimizado
npm run preview          # Preview do build

# Lint
npm run lint             # Verifica código com ESLint
```

## 🔐 Autenticação

### JWT Token
- Armazenado em \`localStorage\` com chave \`token\`
- Enviado em headers: \`Authorization: Bearer <token>\`
- Validado no backend com Passport JWT

## 📦 Dependências Principais

### Runtime
- **@radix-ui/\*** - Componentes UI acessíveis
- **react-leaflet** - Integração React com Leaflet
- **react-hook-form** - Gerenciamento de formulários
- **zod** - Validação de dados
- **openai** - Cliente OpenAI

### Dev
- **vite** - Build tool
- **tailwindcss** - Utility-first CSS
- **typescript** - Type checking
- **eslint** - Linting

## 🎯 Features

### ✅ Implementadas
- [x] Autenticação com JWT
- [x] Dashboard com dados em tempo real
- [x] Mapa interativo
- [x] Integração com Pokémon
- [x] Análise com IA (OpenAI)
- [x] Exportação de dados (Excel, CSV)
- [x] UI responsiva
- [x] Notificações toast

## �� Troubleshooting

### Porta 5173 já em uso
```bash
npm run dev -- --port 5174
```

### CORS Error
- Verifica se API está rodando em localhost:3000
- Verifica se CORS está habilitado no backend

### Node modules quebrados
```bash
rm -rf node_modules package-lock.json
npm install
```

---

**Frontend Version**: 1.0.0  
**Last Updated**: Dezembro 2025
