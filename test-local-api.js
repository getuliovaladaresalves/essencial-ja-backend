const http = require('http');

// Dados de teste para cadastro de cliente
const clientData = {
  nome: "João Silva Teste Local",
  email: "joao.teste.local@email.com",
  senha: "MinhaSenh@123",
  telefone: "11999887766",
  cpf: "12345678901",
  endereco: "Rua das Flores, 123, Centro, São Paulo - SP"
};

// Função para fazer requisição POST
function makeRequest(data, port = 3000) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify(data);
    
    const options = {
      hostname: 'localhost',
      port: port,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: parsedData
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            data: responseData
          });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Executar teste
async function testLocalAPI() {
  console.log('🧪 Testando API local...\n');
  console.log('📋 Dados de teste:');
  console.log(JSON.stringify(clientData, null, 2));
  console.log('\n🚀 Enviando requisição para localhost:3000...\n');

  try {
    const response = await makeRequest(clientData, 3000);
    
    console.log('📊 Resposta da API:');
    console.log(`Status: ${response.statusCode}`);
    console.log('Headers:', response.headers);
    console.log('Body:', JSON.stringify(response.data, null, 2));
    
    if (response.statusCode === 201) {
      console.log('\n✅ SUCESSO: Cliente cadastrado com sucesso!');
      console.log('🎉 API local funcionando!');
    } else if (response.statusCode === 409) {
      console.log('\n⚠️  AVISO: E-mail já existe (esperado em testes repetidos)');
      console.log('✅ API local funcionando corretamente!');
    } else {
      console.log('\n❌ ERRO: Falha no cadastro');
      console.log('🔍 Verificar logs da API local');
    }
    
  } catch (error) {
    console.error('\n❌ ERRO na requisição:', error.message);
    console.log('🔍 Verificar se o servidor local está rodando na porta 3000');
  }
}

// Executar o teste
testLocalAPI();
