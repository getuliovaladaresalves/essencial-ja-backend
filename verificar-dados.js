const { PrismaClient } = require('@prisma/client');

async function verificarDados() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Verificando dados no banco de dados...\n');
    
    // Contar registros
    const totalUsers = await prisma.user.count();
    const totalCategorias = await prisma.categoria.count();
    const totalServicos = await prisma.servico.count();
    const totalPrestadores = await prisma.prestador.count();
    
    console.log('📊 Resumo dos dados:');
    console.log(`- Usuários: ${totalUsers}`);
    console.log(`- Categorias: ${totalCategorias}`);
    console.log(`- Serviços: ${totalServicos}`);
    console.log(`- Prestadores: ${totalPrestadores}\n`);
    
    // Listar categorias
    console.log('📂 Categorias:');
    const categorias = await prisma.categoria.findMany();
    categorias.forEach(cat => {
      console.log(`  - ${cat.nome}`);
    });
    
    // Listar serviços
    console.log('\n🔧 Serviços:');
    const servicos = await prisma.servico.findMany({
      include: { categoria: true }
    });
    servicos.forEach(serv => {
      console.log(`  - ${serv.nome} (${serv.categoria.nome})`);
    });
    
    // Listar prestadores
    console.log('\n👥 Prestadores:');
    const prestadores = await prisma.prestador.findMany({
      include: { 
        user: true,
        servicos: {
          include: { categoria: true }
        }
      }
    });
    
    prestadores.forEach(prest => {
      console.log(`  - ${prest.user.nome} (${prest.user.email})`);
      console.log(`    Serviços: ${prest.servicos.map(s => s.nome).join(', ')}`);
    });
    
    // Listar usuários cliente
    console.log('\n👤 Usuários Cliente:');
    const clientes = await prisma.user.findMany({
      where: { prestador: null }
    });
    clientes.forEach(cliente => {
      console.log(`  - ${cliente.nome} (${cliente.email})`);
    });
    
    console.log('\n✅ Verificação concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verificarDados();
