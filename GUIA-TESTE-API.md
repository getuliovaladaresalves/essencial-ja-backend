# 🚀 Guia de Execução e Teste da API Essencial Já

Este guia fornece instruções passo a passo para configurar, executar e testar a API do projeto Essencial Já.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL (Supabase configurado)
- Postman ou Insomnia para testes
- Git configurado

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
# Navegar para o diretório da API
cd api

# Instalar dependências
npm install
```

### 2. Configurar Variáveis de Ambiente

Certifique-se de que o arquivo `.env` está configurado com:

```env
DATABASE_URL="postgresql://postgres:58$ZgwavJZHj26c@db.chvulzyyvqaxokgvajyk.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
NODE_ENV="development"
PORT=3000
CORS_ORIGIN="http://localhost:3000,http://localhost:8080,http://localhost:8081"
```

### 3. Executar Migrações

```bash
# Aplicar migrações ao banco de dados
npx prisma migrate deploy

# Gerar cliente Prisma
npm run prisma:generate
```

## 🌱 Popular Banco de Dados (Seed)

### Executar Script de Seed

```bash
# Executar o script de seed
npm run prisma:seed
```

**Dados que serão criados:**
- ✅ **3 Categorias**: Automotivo, Residencial, Urgências
- ✅ **5 Serviços**: Conserto de Pneu, Abertura de Porta, Reparo Elétrico, Entrega de Gás, Reparo de Vazamento
- ✅ **5 Prestadores**: Borracharia Silva, Chaveiro Central, Eletro Fix, Gás & Água Express, Desentupidora Rápida
- ✅ **1 Cliente**: Cliente Teste

**Credenciais criadas:**
- **Cliente**: `cliente@teste.com` / `123456`
- **Prestador**: `joao@borrachariasilva.com` / `123456`

## 🚀 Iniciar a API

### Executar em Modo Desenvolvimento

```bash
# Iniciar a API
npm run start:dev
```

A API estará disponível em: `http://localhost:3000`

## 🧪 Testes com Postman/Insomnia

### 1. Teste de Login (Cliente)

**Endpoint:** `POST http://localhost:3000/auth/login`

**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "email": "cliente@teste.com",
  "senha": "123456"
}
```

**Resposta Esperada:**
```json
{
  "message": "Login realizado com sucesso",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "nome": "Cliente Teste",
    "email": "cliente@teste.com",
    "criadoEm": "2025-01-02T20:02:00.000Z"
  }
}
```

### 2. Teste de Listagem de Prestadores

**Endpoint:** `GET http://localhost:3000/auth/prestadores`

**Headers:**
```
Authorization: Bearer <token_obtido_no_login>
Content-Type: application/json
```

**Resposta Esperada:**
```json
{
  "message": "Prestadores listados com sucesso",
  "data": [
    {
      "id": "uuid",
      "fotoUrl": "https://images.unsplash.com/...",
      "descricao": "Especialista em conserto de pneus...",
      "disponivel": true,
      "user": {
        "id": "uuid",
        "nome": "João Silva",
        "email": "joao@borrachariasilva.com",
        "criadoEm": "2025-01-02T20:02:00.000Z"
      },
      "servicos": [
        {
          "id": "uuid",
          "nome": "Conserto de Pneu",
          "categoria": {
            "id": "uuid",
            "nome": "Automotivo"
          }
        }
      ]
    }
  ],
  "total": 5
}
```

### 3. Teste de Busca por ID

**Endpoint:** `GET http://localhost:3000/prestadores/{id}`

**Headers:**
```
Authorization: Bearer <token_obtido_no_login>
Content-Type: application/json
```

### 4. Teste de Filtro por Serviço

**Endpoint:** `GET http://localhost:3000/prestadores/servico/{servicoId}`

**Headers:**
```
Authorization: Bearer <token_obtido_no_login>
Content-Type: application/json
```

## 🔍 Verificação no Supabase

### Acessar Painel do Supabase

1. Acesse o painel do seu projeto no Supabase
2. Navegue até **Table Editor**
3. Verifique se as seguintes tabelas foram criadas:
   - ✅ **User** - Usuários do sistema
   - ✅ **Categoria** - Categorias de serviços
   - ✅ **Servico** - Serviços oferecidos
   - ✅ **Prestador** - Prestadores de serviço
   - ✅ **_PrestadorToServico** - Relacionamento N:N
   - ✅ **_prisma_migrations** - Controle de migrações

### Verificar Dados

- **User**: 6 registros (5 prestadores + 1 cliente)
- **Categoria**: 3 registros
- **Servico**: 5 registros
- **Prestador**: 5 registros

## 🐛 Solução de Problemas

### Erro de Conexão com Banco

```bash
# Verificar se o .env está correto
cat .env

# Testar conexão
npx prisma db pull
```

### Erro de Token JWT

- Verificar se o token está sendo enviado no header `Authorization`
- Verificar se o token não expirou
- Verificar se o JWT_SECRET está configurado

### Erro de CORS

- Verificar se o CORS_ORIGIN está configurado corretamente
- Verificar se a origem da requisição está permitida

## 📊 Endpoints Disponíveis

### Autenticação
- `POST /auth/register` - Cadastro de usuário
- `POST /auth/login` - Login com JWT

### Prestadores (Protegidos)
- `GET /prestadores` - Lista todos os prestadores
- `GET /prestadores/:id` - Busca prestador por ID
- `GET /prestadores/servico/:servicoId` - Filtra por serviço

### Usuários
- `GET /users/:id` - Busca usuário por ID

## 🎯 Status de Sucesso

✅ **API funcionando** em http://localhost:3000  
✅ **Banco de dados** populado com dados de exemplo  
✅ **Autenticação JWT** funcionando  
✅ **Endpoints protegidos** funcionando  
✅ **Relacionamentos** funcionando corretamente  

## 📝 Próximos Passos

1. **Integrar com Frontend** React
2. **Implementar testes** automatizados
3. **Configurar deploy** em produção
4. **Adicionar logs** e monitoramento
5. **Implementar cache** para performance

---

**🎉 API Essencial Já configurada e funcionando perfeitamente!**
