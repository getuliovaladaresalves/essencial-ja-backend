import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

interface RegisterUserDto {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  cpf?: string;
  categoria?: string;
  endereco?: string;
  descricao?: string;
  horarioFuncionamento?: string;
  precoBase?: string;
  experiencia?: string;
  certificacoes?: string;
  atendimento24h?: boolean;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Apenas POST é permitido
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { 
    nome, 
    email, 
    senha, 
    telefone, 
    cpf,
    categoria, 
    endereco, 
    descricao, 
    horarioFuncionamento, 
    precoBase, 
    experiencia, 
    certificacoes, 
    atendimento24h 
  }: RegisterUserDto = req.body;

  // Validações básicas
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
  }

  try {
    // Verificar se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Este e-mail já está em uso' });
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(senha, 12);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senhaHash,
        telefone,
        cpf
      },
      select: {
        id: true,
        nome: true,
        email: true,
        telefone: true,
        cpf: true,
        criadoEm: true
      }
    });

    // Se é um prestador (tem campos adicionais), criar o perfil de prestador
    if (categoria || endereco || descricao) {
      await prisma.prestador.create({
        data: {
          userId: user.id,
          descricao: descricao || '',
          atendimento24h: atendimento24h || false,
          endereco: endereco || null,
          horarioFuncionamento: horarioFuncionamento || null,
          precoBase: precoBase || null,
          experiencia: experiencia || null,
          certificacoes: certificacoes || null,
        }
      });
    }

    return res.status(201).json({
      message: 'Usuário criado com sucesso',
      user
    });
  } catch (error) {
    console.error('Erro no registro:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}
