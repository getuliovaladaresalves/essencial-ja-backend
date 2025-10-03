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

  try {
    // Obter parâmetros de query para filtros
    const { categoria, emergencia } = req.query;
    
    // Construir filtros base
    const whereClause: any = {
      disponivel: true
    };

    // Se for uma busca de emergência, priorizar prestadores 24h
    if (emergencia === 'true') {
      whereClause.atendimento24h = true;
    }

    // Se categoria for especificada, filtrar por serviços
    let servicosFilter: any = undefined;
    if (categoria && typeof categoria === 'string') {
      servicosFilter = {
        some: {
          categoria: {
            nome: {
              contains: categoria,
              mode: 'insensitive'
            }
          }
        }
      };
    }

    const prestadores = await prisma.prestador.findMany({
      where: {
        ...whereClause,
        ...(servicosFilter && { servicos: servicosFilter })
      },
      select: {
        id: true,
        fotoUrl: true,
        descricao: true,
        disponivel: true,
        atendimento24h: true,
        user: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
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
      orderBy: [
        // Priorizar prestadores 24h em emergências
        ...(emergencia === 'true' ? [{ atendimento24h: 'desc' as const }] : []),
        { user: { nome: 'asc' as const } }
      ]
    });

    return res.status(200).json({
      message: 'Prestadores listados com sucesso',
      data: prestadores,
      total: prestadores.length
    });
  } catch (error) {
    console.error('Erro na API de prestadores:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
