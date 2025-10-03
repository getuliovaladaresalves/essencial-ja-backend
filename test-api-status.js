const https = require('https');

// Função para testar diferentes endpoints
function testEndpoint(path, method = 'GET') {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'essencial-ja-backend.vercel.app',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        resolve({
          path: path,
          method: method,
          statusCode: res.statusCode,
          headers: res.headers,
          data: responseData
        });
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (method === 'POST') {
      req.write(JSON.stringify({}));
    }
    
    req.end();
  });
}

// Testar diferentes endpoints
async function testAPIEndpoints() {
  console.log('🔍 Testando endpoints da API em produção...\n');

  const endpoints = [
    { path: '/api/auth/register', method: 'POST' },
    { path: '/api/auth/login', method: 'POST' },
    { path: '/api/prestadores', method: 'GET' },
    { path: '/api/auth/[...action]', method: 'POST' }
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📡 Testando ${endpoint.method} ${endpoint.path}...`);
      const response = await testEndpoint(endpoint.path, endpoint.method);
      
      console.log(`   Status: ${response.statusCode}`);
      console.log(`   Content-Type: ${response.headers['content-type']}`);
      
      if (response.statusCode === 200 || response.statusCode === 201) {
        console.log('   ✅ Endpoint funcionando');
      } else if (response.statusCode === 405) {
        console.log('   ⚠️  Método não permitido');
      } else if (response.statusCode === 500) {
        console.log('   ❌ Erro interno do servidor');
      } else {
        console.log(`   ℹ️  Status: ${response.statusCode}`);
      }
      
      console.log('');
      
    } catch (error) {
      console.log(`   ❌ Erro: ${error.message}\n`);
    }
  }
}

// Executar testes
testAPIEndpoints();
