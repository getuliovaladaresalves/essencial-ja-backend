# Essencial Já - API Backend

API backend para o projeto Essencial Já, construída com NestJS e Prisma.

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Criptografia de senhas

## 📁 Estrutura do Projeto

```
api/
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── src/
│   ├── auth/                   # Módulo de autenticação
│   ├── users/                  # Módulo de usuários
│   ├── common/
│   │   └── prisma/            # Serviço Prisma
│   ├── app.module.ts          # Módulo principal
│   └── main.ts                # Arquivo de inicialização
├── .env.example               # Variáveis de ambiente
├── package.json              # Dependências
└── README.md                 # Documentação
```

## 🛠️ Configuração

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/essencial_ja_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
```

### 3. Configurar Banco de Dados

```bash
# Gerar cliente Prisma
npm run prisma:generate

# Aplicar migrações
npm run prisma:migrate

# (Opcional) Abrir Prisma Studio
npm run prisma:studio
```

### 4. Executar Aplicação

```bash
# Desenvolvimento
npm run start:dev

# Produção
npm run start:prod
```

## 📊 Modelo de Dados

### User

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | String (UUID) | Chave primária |
| email | String | Email único |
| nome | String | Nome do usuário |
| senhaHash | String | Senha criptografada |
| criadoEm | DateTime | Data de criação |

## 🔐 Autenticação

A API utiliza JWT para autenticação com as seguintes características:

- **Algoritmo**: HS256
- **Expiração**: 7 dias (configurável)
- **Estratégias**: JWT e Local (username/password)

## 📝 Scripts Disponíveis

- `npm run start` - Inicia a aplicação
- `npm run start:dev` - Inicia em modo desenvolvimento
- `npm run start:prod` - Inicia em modo produção
- `npm run build` - Compila a aplicação
- `npm run test` - Executa testes
- `npm run prisma:generate` - Gera cliente Prisma
- `npm run prisma:migrate` - Aplica migrações
- `npm run prisma:studio` - Abre Prisma Studio

## 🌐 Endpoints

### Autenticação

- `POST /auth/register` - Registrar usuário
- `POST /auth/login` - Login
- `POST /auth/logout` - Logout

### Usuários

- `GET /users/profile` - Perfil do usuário
- `PUT /users/profile` - Atualizar perfil

## 🔧 Desenvolvimento

### Adicionar Nova Migração

```bash
npm run prisma:migrate -- --name nome_da_migracao
```

### Reset do Banco de Dados

```bash
npm run prisma:migrate -- --reset
```

## 📄 Licença

Este projeto é privado e proprietário do Essencial Já.
