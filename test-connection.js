const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔌 Testando conexão com o banco de dados...');
    
    // Testar conexão básica
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!');
    
    // Listar tabelas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;
    
    console.log('\n📊 Tabelas criadas no banco de dados:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name}`);
    });
    
    // Verificar se as tabelas principais existem
    const expectedTables = ['User', 'Categoria', 'Servico', 'Prestador', '_prisma_migrations'];
    const existingTables = tables.map(t => t.table_name);
    
    console.log('\n🔍 Verificação das tabelas esperadas:');
    expectedTables.forEach(table => {
      const exists = existingTables.includes(table);
      console.log(`  ${exists ? '✅' : '❌'} ${table}`);
    });
    
    console.log('\n🎉 Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com o banco de dados:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
