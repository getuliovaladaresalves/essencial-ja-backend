import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

interface RegisterUserDto {
  nome: string;
  email: string;
  senha: string;
}

interface LoginUserDto {
  email: string;
  senha: string;
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

  const { action } = req.query;

  if (!action || typeof action !== 'string') {
    return res.status(400).json({ message: 'Ação não especificada' });
  }

  try {
    switch (action) {
      case 'register':
        return await handleRegister(req, res);
      case 'login':
        return await handleLogin(req, res);
      default:
        return res.status(400).json({ message: 'Ação não reconhecida' });
    }
  } catch (error) {
    console.error('Erro na API de autenticação:', error);
    return res.status(500).json({ message: 'Erro interno do servidor' });
  }
}

async function handleRegister(req: NextApiRequest, res: NextApiResponse) {
  const { nome, email, senha }: RegisterUserDto = req.body;

  // Validações básicas
  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ message: 'A senha deve ter no mínimo 6 caracteres' });
  }

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
      senhaHash
    },
    select: {
      id: true,
      nome: true,
      email: true,
      criadoEm: true
    }
  });

  return res.status(201).json({
    message: 'Usuário criado com sucesso',
    user
  });
}

async function handleLogin(req: NextApiRequest, res: NextApiResponse) {
  const { email, senha }: LoginUserDto = req.body;

  // Validações básicas
  if (!email || !senha) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Verificar senha
  const isPasswordValid = await bcrypt.compare(senha, user.senhaHash);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  // Gerar JWT
  const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-here';
  const token = jwt.sign(
    { 
      sub: user.id, 
      email: user.email, 
      nome: user.nome 
    },
    jwtSecret,
    { expiresIn: '7d' }
  );

  return res.status(200).json({
    message: 'Login realizado com sucesso',
    access_token: token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      criadoEm: user.criadoEm
    }
  });
}
