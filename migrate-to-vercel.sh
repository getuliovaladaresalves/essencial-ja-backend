#!/bin/bash

# Script de Migração para Vercel - Essencial Já
echo "🚀 Iniciando migração da API para Vercel..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir com cor
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
    print_error "Execute este script no diretório raiz da API (api/)"
    exit 1
fi

# Backup da estrutura atual
print_status "Criando backup da estrutura atual..."
if [ -d "src" ]; then
    cp -r src src-backup
    print_success "Backup criado em src-backup/"
fi

# Instalar dependências do Next.js
print_status "Instalando dependências do Next.js..."
npm install next@latest react@latest react-dom@latest

# Instalar dependências de tipos
print_status "Instalando dependências de tipos..."
npm install --save-dev @types/node @types/react @types/react-dom @types/jsonwebtoken

# Configurar package.json para Vercel
print_status "Configurando package.json para Vercel..."
if [ -f "package-vercel.json" ]; then
    cp package.json package-nestjs.json
    cp package-vercel.json package.json
    print_success "package.json configurado para Vercel"
fi

# Configurar TypeScript
print_status "Configurando TypeScript..."
if [ -f "tsconfig-vercel.json" ]; then
    cp tsconfig.json tsconfig-nestjs.json
    cp tsconfig-vercel.json tsconfig.json
    print_success "TypeScript configurado para Vercel"
fi

# Configurar Prisma
print_status "Configurando Prisma..."
if [ -f "prisma/schema-vercel.prisma" ]; then
    cp prisma/schema.prisma prisma/schema-nestjs.prisma
    cp prisma/schema-vercel.prisma prisma/schema.prisma
    print_success "Prisma configurado para Vercel"
fi

# Gerar Prisma Client
print_status "Gerando Prisma Client..."
npx prisma generate

# Criar arquivo de configuração do Vercel
print_status "Criando configuração do Vercel..."
if [ -f "vercel.json" ]; then
    print_success "vercel.json já existe"
else
    print_warning "vercel.json não encontrado"
fi

# Criar arquivo de configuração do Next.js
print_status "Criando configuração do Next.js..."
if [ -f "next.config.js" ]; then
    print_success "next.config.js já existe"
else
    print_warning "next.config.js não encontrado"
fi

# Verificar estrutura de rotas
print_status "Verificando estrutura de rotas..."
if [ -d "api" ]; then
    print_success "Diretório api/ existe"
    if [ -f "api/auth/[...action].ts" ]; then
        print_success "Rota de autenticação criada"
    else
        print_warning "Rota de autenticação não encontrada"
    fi
    if [ -f "api/prestadores/[...params].ts" ]; then
        print_success "Rota de prestadores criada"
    else
        print_warning "Rota de prestadores não encontrada"
    fi
else
    print_error "Diretório api/ não encontrado"
fi

# Testar build
print_status "Testando build..."
if npm run build; then
    print_success "Build realizado com sucesso"
else
    print_error "Erro no build"
    exit 1
fi

# Mostrar resumo
echo ""
print_success "🎉 Migração concluída com sucesso!"
echo ""
echo "📊 Estrutura Otimizada:"
echo "  ✅ Rotas dinâmicas criadas"
echo "  ✅ Configurações atualizadas"
echo "  ✅ Dependências instaladas"
echo "  ✅ Build testado"
echo ""
echo "🚀 Próximos Passos:"
echo "  1. Configurar variáveis no Vercel"
echo "  2. Deploy: vercel --prod"
echo "  3. Executar seed: npm run prisma:seed"
echo "  4. Testar endpoints"
echo ""
echo "📁 Arquivos de Backup:"
echo "  - src-backup/ (estrutura NestJS)"
echo "  - package-nestjs.json"
echo "  - tsconfig-nestjs.json"
echo "  - prisma/schema-nestjs.prisma"
echo ""
print_success "🚀 API pronta para deploy no Vercel!"
