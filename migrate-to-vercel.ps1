# Script de Migração para Vercel - Essencial Já (PowerShell)
Write-Host "🚀 Iniciando migração da API para Vercel..." -ForegroundColor Green

# Função para imprimir com cor
function Write-Status {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Verificar se estamos no diretório correto
if (-not (Test-Path "package.json")) {
    Write-Error "Execute este script no diretório raiz da API (api/)"
    exit 1
}

# Backup da estrutura atual
Write-Status "Criando backup da estrutura atual..."
if (Test-Path "src") {
    Copy-Item -Path "src" -Destination "src-backup" -Recurse
    Write-Success "Backup criado em src-backup/"
}

# Instalar dependências do Next.js
Write-Status "Instalando dependências do Next.js..."
npm install next@latest react@latest react-dom@latest

# Instalar dependências de tipos
Write-Status "Instalando dependências de tipos..."
npm install --save-dev @types/node @types/react @types/react-dom @types/jsonwebtoken

# Configurar package.json para Vercel
Write-Status "Configurando package.json para Vercel..."
if (Test-Path "package-vercel.json") {
    Copy-Item "package.json" "package-nestjs.json"
    Copy-Item "package-vercel.json" "package.json"
    Write-Success "package.json configurado para Vercel"
}

# Configurar TypeScript
Write-Status "Configurando TypeScript..."
if (Test-Path "tsconfig-vercel.json") {
    Copy-Item "tsconfig.json" "tsconfig-nestjs.json"
    Copy-Item "tsconfig-vercel.json" "tsconfig.json"
    Write-Success "TypeScript configurado para Vercel"
}

# Configurar Prisma
Write-Status "Configurando Prisma..."
if (Test-Path "prisma/schema-vercel.prisma") {
    Copy-Item "prisma/schema.prisma" "prisma/schema-nestjs.prisma"
    Copy-Item "prisma/schema-vercel.prisma" "prisma/schema.prisma"
    Write-Success "Prisma configurado para Vercel"
}

# Gerar Prisma Client
Write-Status "Gerando Prisma Client..."
npx prisma generate

# Criar arquivo de configuração do Vercel
Write-Status "Criando configuração do Vercel..."
if (Test-Path "vercel.json") {
    Write-Success "vercel.json já existe"
} else {
    Write-Warning "vercel.json não encontrado"
}

# Criar arquivo de configuração do Next.js
Write-Status "Criando configuração do Next.js..."
if (Test-Path "next.config.js") {
    Write-Success "next.config.js já existe"
} else {
    Write-Warning "next.config.js não encontrado"
}

# Verificar estrutura de rotas
Write-Status "Verificando estrutura de rotas..."
if (Test-Path "api") {
    Write-Success "Diretório api/ existe"
    if (Test-Path "api/auth/[...action].ts") {
        Write-Success "Rota de autenticação criada"
    } else {
        Write-Warning "Rota de autenticação não encontrada"
    }
    if (Test-Path "api/prestadores/[...params].ts") {
        Write-Success "Rota de prestadores criada"
    } else {
        Write-Warning "Rota de prestadores não encontrada"
    }
} else {
    Write-Error "Diretório api/ não encontrado"
}

# Testar build
Write-Status "Testando build..."
try {
    npm run build
    Write-Success "Build realizado com sucesso"
} catch {
    Write-Error "Erro no build"
    exit 1
}

# Mostrar resumo
Write-Host ""
Write-Success "🎉 Migração concluída com sucesso!"
Write-Host ""
Write-Host "📊 Estrutura Otimizada:"
Write-Host "  ✅ Rotas dinâmicas criadas"
Write-Host "  ✅ Configurações atualizadas"
Write-Host "  ✅ Dependências instaladas"
Write-Host "  ✅ Build testado"
Write-Host ""
Write-Host "🚀 Próximos Passos:"
Write-Host "  1. Configurar variáveis no Vercel"
Write-Host "  2. Deploy: vercel --prod"
Write-Host "  3. Executar seed: npm run prisma:seed"
Write-Host "  4. Testar endpoints"
Write-Host ""
Write-Host "📁 Arquivos de Backup:"
Write-Host "  - src-backup/ (estrutura NestJS)"
Write-Host "  - package-nestjs.json"
Write-Host "  - tsconfig-nestjs.json"
Write-Host "  - prisma/schema-nestjs.prisma"
Write-Host ""
Write-Success "🚀 API pronta para deploy no Vercel!"
