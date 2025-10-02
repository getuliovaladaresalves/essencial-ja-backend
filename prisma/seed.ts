import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Limpar dados existentes (em ordem reversa das dependências)
  console.log('🧹 Limpando dados existentes...');
  await prisma.prestador.deleteMany();
  await prisma.servico.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.user.deleteMany();

  // 1. Criar Categorias
  console.log('📂 Criando categorias...');
  const categoriaAutomotivo = await prisma.categoria.create({
    data: { nome: 'Automotivo' }
  });

  const categoriaResidencial = await prisma.categoria.create({
    data: { nome: 'Residencial' }
  });

  const categoriaUrgencias = await prisma.categoria.create({
    data: { nome: 'Urgências' }
  });

  // 2. Criar Serviços
  console.log('🔧 Criando serviços...');
  const servicoConsertoPneu = await prisma.servico.create({
    data: {
      nome: 'Conserto de Pneu',
      categoriaId: categoriaAutomotivo.id
    }
  });

  const servicoAberturaPorta = await prisma.servico.create({
    data: {
      nome: 'Abertura de Porta',
      categoriaId: categoriaUrgencias.id
    }
  });

  const servicoReparoEletrico = await prisma.servico.create({
    data: {
      nome: 'Reparo Elétrico',
      categoriaId: categoriaResidencial.id
    }
  });

  const servicoEntregaGas = await prisma.servico.create({
    data: {
      nome: 'Entrega de Gás',
      categoriaId: categoriaResidencial.id
    }
  });

  const servicoReparoVazamento = await prisma.servico.create({
    data: {
      nome: 'Reparo de Vazamento',
      categoriaId: categoriaUrgencias.id
    }
  });

  // 3. Criar Usuários/Prestadores
  console.log('👥 Criando usuários prestadores...');
  
  // Borracharia Silva
  const senhaHash = await bcrypt.hash('123456', 12);
  const userBorracharia = await prisma.user.create({
    data: {
      nome: 'João Silva',
      email: 'joao@borrachariasilva.com',
      senhaHash
    }
  });

  const prestadorBorracharia = await prisma.prestador.create({
    data: {
      fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      descricao: 'Especialista em conserto de pneus, alinhamento e balanceamento. Atendimento 24h com qualidade garantida.',
      disponivel: true,
      userId: userBorracharia.id,
      servicos: {
        connect: [{ id: servicoConsertoPneu.id }]
      }
    }
  });

  // Chaveiro Central
  const userChaveiro = await prisma.user.create({
    data: {
      nome: 'Carlos Mendes',
      email: 'carlos@chaveirocentral.com',
      senhaHash
    }
  });

  const prestadorChaveiro = await prisma.prestador.create({
    data: {
      fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      descricao: 'Especialista em abertura de portas, chaves codificadas e duplicatas. Atendimento rápido e confiável.',
      disponivel: true,
      userId: userChaveiro.id,
      servicos: {
        connect: [{ id: servicoAberturaPorta.id }]
      }
    }
  });

  // Eletro Fix
  const userEletro = await prisma.user.create({
    data: {
      nome: 'Maria Santos',
      email: 'maria@eletrofix.com',
      senhaHash
    }
  });

  const prestadorEletro = await prisma.prestador.create({
    data: {
      fotoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      descricao: 'Instalações elétricas, reparos e manutenção. Profissional certificado com 10 anos de experiência.',
      disponivel: true,
      userId: userEletro.id,
      servicos: {
        connect: [{ id: servicoReparoEletrico.id }]
      }
    }
  });

  // Gás & Água Express
  const userGas = await prisma.user.create({
    data: {
      nome: 'Pedro Oliveira',
      email: 'pedro@gasaguaexpress.com',
      senhaHash
    }
  });

  const prestadorGas = await prisma.prestador.create({
    data: {
      fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      descricao: 'Entrega de botijão de gás e galão de água. Atendimento rápido e preços competitivos.',
      disponivel: true,
      userId: userGas.id,
      servicos: {
        connect: [{ id: servicoEntregaGas.id }]
      }
    }
  });

  // Desentupidora Rápida
  const userDesentupidora = await prisma.user.create({
    data: {
      nome: 'Ana Costa',
      email: 'ana@desentupidorarapida.com',
      senhaHash
    }
  });

  const prestadorDesentupidora = await prisma.prestador.create({
    data: {
      fotoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      descricao: 'Desentupimento de esgotos, pias e vasos sanitários. Atendimento 24h com equipamentos modernos.',
      disponivel: true,
      userId: userDesentupidora.id,
      servicos: {
        connect: [{ id: servicoReparoVazamento.id }]
      }
    }
  });

  // 4. Criar Usuário Cliente (não-prestador)
  console.log('👤 Criando usuário cliente...');
  const userCliente = await prisma.user.create({
    data: {
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      senhaHash
    }
  });

  console.log('✅ Seed concluído com sucesso!');
  console.log('\n📊 Resumo dos dados criados:');
  console.log(`- ${await prisma.categoria.count()} categorias`);
  console.log(`- ${await prisma.servico.count()} serviços`);
  console.log(`- ${await prisma.user.count()} usuários`);
  console.log(`- ${await prisma.prestador.count()} prestadores`);
  
  console.log('\n🔑 Credenciais para teste:');
  console.log('Cliente: cliente@teste.com / 123456');
  console.log('Prestador: joao@borrachariasilva.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
