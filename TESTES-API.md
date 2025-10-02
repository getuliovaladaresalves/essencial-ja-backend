# 🧪 Guia de Testes da API Essencial Já

## 🚀 API Rodando em: http://localhost:3000

### 📋 Pré-requisitos
- Postman ou Insomnia instalado
- API rodando em http://localhost:3000
- Banco de dados populado com seed

## 🔐 **1. Teste de Autenticação**

### **1.1 Login Cliente**
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

**⚠️ IMPORTANTE:** Copie o `access_token` da resposta para usar nos próximos testes!

### **1.2 Login Prestador**
**Endpoint:** `POST http://localhost:3000/auth/login`

**Body (JSON):**
```json
{
  "email": "joao@borrachariasilva.com",
  "senha": "123456"
}
```

### **1.3 Cadastro de Novo Usuário**
**Endpoint:** `POST http://localhost:3000/auth/register`

**Body (JSON):**
```json
{
  "nome": "Novo Cliente",
  "email": "novo@cliente.com",
  "senha": "123456"
}
```

## 🏢 **2. Teste de Prestadores (Protegidos)**

### **2.1 Listar Todos os Prestadores**
**Endpoint:** `GET http://localhost:3000/prestadores`

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

### **2.2 Buscar Prestador por ID**
**Endpoint:** `GET http://localhost:3000/prestadores/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Nota:** Use um ID de prestador da resposta anterior.

### **2.3 Filtrar Prestadores por Serviço**
**Endpoint:** `GET http://localhost:3000/prestadores/servico/{servicoId}`

**Headers:**
```
Authorization: Bearer <token>
```

**Nota:** Use um ID de serviço da resposta anterior.

## 👤 **3. Teste de Usuários**

### **3.1 Buscar Usuário por ID**
**Endpoint:** `GET http://localhost:3000/users/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

## 🔍 **4. Verificação no Supabase**

### **4.1 Acessar Painel do Supabase**
1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá para **Table Editor**

### **4.2 Verificar Tabelas Criadas**
- ✅ **User** - 6 registros (5 prestadores + 1 cliente)
- ✅ **Categoria** - 3 registros
- ✅ **Servico** - 5 registros
- ✅ **Prestador** - 5 registros
- ✅ **_PrestadorToServico** - Relacionamentos N:N

### **4.3 Verificar Dados**
- **Categorias**: Automotivo, Residencial, Urgências
- **Serviços**: Conserto de Pneu, Abertura de Porta, Reparo Elétrico, Entrega de Gás, Reparo de Vazamento
- **Prestadores**: Borracharia Silva, Chaveiro Central, Eletro Fix, Gás & Água Express, Desentupidora Rápida

## 🎯 **5. Fluxo Completo de Teste**

### **Passo 1: Login**
1. Faça login com `cliente@teste.com` / `123456`
2. Copie o `access_token` da resposta

### **Passo 2: Listar Prestadores**
1. Use o token no header `Authorization: Bearer <token>`
2. Faça GET para `/prestadores`
3. Verifique se retorna 5 prestadores

### **Passo 3: Buscar Prestador Específico**
1. Use um ID de prestador da resposta anterior
2. Faça GET para `/prestadores/{id}`
3. Verifique se retorna dados completos

### **Passo 4: Filtrar por Serviço**
1. Use um ID de serviço da resposta anterior
2. Faça GET para `/prestadores/servico/{servicoId}`
3. Verifique se retorna prestadores do serviço

## 🐛 **Solução de Problemas**

### **Erro 401 Unauthorized**
- Verifique se o token está correto
- Verifique se o header `Authorization` está formatado como `Bearer <token>`

### **Erro 500 Internal Server Error**
- Verifique se o banco de dados está conectado
- Verifique se o seed foi executado

### **Erro de CORS**
- Verifique se a origem está permitida no CORS_ORIGIN

## 📊 **Resultados Esperados**

✅ **Login funcionando** - Token JWT válido  
✅ **Listagem de prestadores** - 5 prestadores retornados  
✅ **Busca por ID** - Dados completos do prestador  
✅ **Filtro por serviço** - Prestadores filtrados corretamente  
✅ **Relacionamentos** - Dados de usuário e serviços incluídos  
✅ **Proteção JWT** - Endpoints protegidos funcionando  

## 🎉 **Status Final**

A API está **100% funcional** com:
- ✅ Autenticação JWT
- ✅ Endpoints protegidos
- ✅ Banco de dados populado
- ✅ Relacionamentos funcionando
- ✅ Validação de dados
- ✅ CORS configurado

**🚀 Pronto para integração com o frontend React!**
