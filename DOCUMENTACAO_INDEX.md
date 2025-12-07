# 📚 Documentação - Índice de Referência Rápida

Guia de navegação pelos READMEs do projeto GDASH.

## 🗂️ Estrutura de Documentação

```
GDASH/
│
├── README.md           ← Documentação completa e detalhada
│
├── front-end/
│   └── README.md                ← Frontend React específico
│
├── weather_nest_api/
│   └── README.md                ← Backend NestJS específico
│
├── weather_golang_worker/
│   └── README.md                ← Worker Go específico
│
└── python_collector/
    └── README.md                ← Collector Python específico
```

## 📖 Guia de Leitura

### 🟢 Comece Aqui

2. **[README.md](./README.md)** (15 min)
   - Documentação completa
   - Todos os componentes
   - Exemplos de uso
   - Troubleshooting

### 🔵 Por Componente

| Componente | README | Tempo | Para quem? |
|-----------|--------|-------|-----------|
| 🎨 Frontend | [front-end/README.md](./front-end/README.md) | 10 min | Devs Frontend/React |
| 🔙 Backend | [weather_nest_api/README.md](./weather_nest_api/README.md) | 15 min | Devs Backend/Node |
| 🔄 Worker | [weather_golang_worker/README.md](./weather_golang_worker/README.md) | 8 min | Devs Go/Infraestrutura |
| 📦 Collector | [python_collector/README.md](./python_collector/README.md) | 8 min | Devs Python/Data |

## 🎯 O que procuro?

### "Preciso entender a arquitetura"
→ [README.md - Visão Geral](./README.md#-visão-geral-da-arquitetura)

### "Trabalho com React/Frontend"
→ [front-end/README.md](./front-end/README.md)

### "Trabalho com NestJS/Backend"
→ [weather_nest_api/README.md](./weather_nest_api/README.md)

### "Trabalho com Go/Workers"
→ [weather_golang_worker/README.md](./weather_golang_worker/README.md)

### "Trabalho com Python/Coleta"
→ [python_collector/README.md](./python_collector/README.md)

## 📊 Resumo dos READMEs

### 1. README.md
**Tipo**: Documentação Completa  
**Tamanho**: ~500 linhas  
**Público-alvo**: Todos (desenvolvimento e deploy)  
**Tópicos**:
- Visão geral detalhada
- Diagrama completo de componentes
- Stack tecnológico
- Quick start expandido
- Descrição de cada componente
- Fluxo de dados completo
- Endpoints da API
- Variáveis de ambiente
- Commands úteis
- Troubleshooting extenso
- Deployment production
- Roadmap

### 2. front-end/README.md
**Tipo**: Documentação Específica  
**Tamanho**: ~350 linhas  
**Público-alvo**: Devs Frontend  
**Tópicos**:
- Stack React/TypeScript/Vite
- Estrutura de diretórios
- Instalação local e Docker
- Páginas (Login, Register, Dashboard)
- Integração com API
- Componentes UI
- Scripts disponíveis
- Autenticação JWT
- Performance
- Troubleshooting React

### 3. weather_nest_api/README.md
**Tipo**: Documentação Específica  
**Tamanho**: ~400 linhas  
**Público-alvo**: Devs Backend  
**Tópicos**:
- Stack NestJS/MongoDB
- Estrutura de módulos
- Instalação local e Docker
- Endpoints da API
- DTOs e Validação
- Autenticação JWT
- Modelos de dados
- Testes (Unit, E2E)
- Migrations
- Seeds
- Variáveis de ambiente
- Padrões utilizados

### 4. weather_golang_worker/README.md
**Tipo**: Documentação Específica  
**Tamanho**: ~250 linhas  
**Público-alvo**: Devs Go / Infraestrutura  
**Tópicos**:
- Arquitetura do worker
- Build e deployment
- Variáveis de ambiente
- Estrutura de dados
- Fluxo de processamento
- Performance
- Health checks
- Troubleshooting

### 5. python_collector/README.md
**Tipo**: Documentação Específica  
**Tamanho**: ~300 linhas  
**Público-alvo**: Devs Python / Data  
**Tópicos**:
- Visão geral do collector
- Fluxo de coleta de dados
- Instalação local e Docker
- Variáveis de ambiente
- Dados coletados
- Funcionamento do script
- Tratamento de erros
- Monitoramento
- Dependências Python
- Troubleshooting

## 🚀 Quick Links

### Documentação Detalhada
- 📚 [Documentação Completa](./README.md)
- 🏗️ [Arquitetura Completa](./README.md#-visão-geral-da-arquitetura)
- 🔄 [Fluxo de Dados](./README.md#-fluxo-de-dados-completo)

### Por Tecnologia
- ⚛️ [React Frontend](./front-end/README.md)
- 🔴 [NestJS Backend](./weather_nest_api/README.md)
- 🟦 [Go Worker](./weather_golang_worker/README.md)
- 🐍 [Python Collector](./python_collector/README.md)

### Endpoints API
- 🔐 [Autenticação](./weather_nest_api/README.md#autenticação)
- 🌦️ [Weather](./weather_nest_api/README.md#dados-meteorológicos)
- 🎮 [Pokémon](./weather_nest_api/README.md#pokémon)
- 📥 [Exportação](./weather_nest_api/README.md#exportação-de-dados)

### Problemas e Soluções
- 🚨 [Troubleshooting Geral](./README.md#-troubleshooting)
- 🐳 [Docker Issues](./README.md#troubleshooting)
- ⚛️ [React Issues](./front-end/README.md#-troubleshooting)
- 🔴 [NestJS Issues](./weather_nest_api/README.md#-troubleshooting)

## 🎓 Estrutura de Aprendizado

### Nível 1: Intermediário (Entender componentes)
1. Leia: [README.md](./README.md)
2. Escolha um componente
3. Leia seu README específico
4. Modifique e teste localmente

### Nível 2: Avançado (Desenvolvimento)
1. Clone repositório
2. Instale dependências locais
3. Leia documentação específica de cada componente
4. Faça suas modificações
5. Teste com `npm run test`
6. Submit PR

## 📝 Nomenclatura

| Termo | Significado |
|-------|------------|
| 🔴 Backend | NestJS API |
| ⚛️ Frontend | React App |
| 🟦 Worker | Go Consumer |
| 🐍 Collector | Python Script |
| 🗂️ Database | MongoDB |
| 📨 Queue | RabbitMQ |
| 🐳 Container | Docker |

## 🔗 Recursos Externos

- [NestJS Documentation](https://docs.nestjs.com)
- [React Documentation](https://react.dev)
- [Go Documentation](https://golang.org/doc)
- [Python Documentation](https://docs.python.org)
- [MongoDB Documentation](https://docs.mongodb.com)
- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- [Docker Documentation](https://docs.docker.com)

## 📞 Suporte

- 📖 Não encontrou? Tente a busca nos READMEs
- 🐛 Bug? Verifique Troubleshooting
- 💡 Sugestão? Abra uma issue
- 🤝 Quer ajudar? Abra um PR

## 📈 Versões

| Versão | Data | Status | Links |
|--------|------|--------|-------|
| 1.0.0 | Dez 2025 | ✅ Estável | [README](./README.md) |

---

**Atualizado**: 6 de Dezembro de 2025  
**Mantido por**: Talia  
