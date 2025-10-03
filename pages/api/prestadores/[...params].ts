import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas GET é permitido
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  // Verificar autenticação
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autorização necessário' });
  }

  const token = authHeader.substring(7);
  
  try {
    const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Verificar se o usuário ainda existe
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub }
    });

    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }

  const { params } = req.query;

  if (!params || !Array.isArray(params)) {
    return res.status(400).json({ message: 'Parâmetros inválidos' });
  }

  try {
    if (params.length === 0) {
      // GET /api/prestadores - Listar todos
      return await handleListAll(req, res);
    } else if (params.length === 1) {
      // GET /api/prestadores/[id] - Buscar por ID
      return await handleFindById(req, res, params[0]);
    } else if (params.length === 2 && params[0] === 'servico') {
      // GET /api/prestadores/servico/[servicoId] - Filtrar por serviço
      return await handleFindByServico(req, res, params[1]);
    } else {
      return res.status(400).json({ message: 'Rota não reconhecida' });
    }
  } catch (error) {
    console.error('Erro na API de prestadores:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function handleListAll(req: NextApiRequest, res: NextApiResponse) {
  const prestadores = await prisma.prestador.findMany({
    where: {
      disponivel: true
    },
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          criadoEm: true
        }
      },
      servicos: {
        include: {
          categoria: {
            select: {
              id: true,
              nome: true
            }
          }
        }
      }
    },
    orderBy: {
      user: {
        nome: 'asc'
      }
    }
  });

  return res.status(200).json({
    message: 'Prestadores listados com sucesso',
    data: prestadores,
    total: prestadores.length
  });
}

async function handleFindById(req: NextApiRequest, res: NextApiResponse, id: string) {
  const prestador = await prisma.prestador.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          criadoEm: true
        }
      },
      servicos: {
        include: {
          categoria: true
        }
      }
    }
  });

  if (!prestador) {
    return res.status(404).json({
      message: 'Prestador não encontrado',
      data: null
    });
  }

  return res.status(200).json({
    message: 'Prestador encontrado com sucesso',
    data: prestador
  });
}

async function handleFindByServico(req: NextApiRequest, res: NextApiResponse, servicoId: string) {
  const prestadores = await prisma.prestador.findMany({
    where: {
      disponivel: true,
      servicos: {
        some: {
          id: servicoId
        }
      }
    },
    include: {
      user: {
        select: {
          id: true,
          nome: true,
          email: true,
          criadoEm: true
        }
      },
      servicos: {
        include: {
          categoria: true
        }
      }
    },
    orderBy: {
      user: {
        nome: 'asc'
      }
    }
  });

  return res.status(200).json({
    message: `Prestadores para o serviço ${servicoId} listados com sucesso`,
    data: prestadores,
    total: prestadores.length
  });
}
