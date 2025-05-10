import { auth } from '@/lib/auth' // ou o caminho correto pro seu auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const session = await auth(); // ✅ função pronta do NextAuth v5

  if (!session?.user) {
    return new NextResponse('Não autorizado', { status: 401 });
  }

  const { nome, email, senha, role } = await req.json();

  if (!nome || !email || !senha) {
    return new NextResponse('Campos obrigatórios faltando', { status: 400 });
  }

  const existe = await prisma.usuarios.findUnique({ where: { email } });
  if (existe) {
    return new NextResponse('Email já cadastrado', { status: 409 });
  }

  const novoUsuario = await prisma.usuarios.create({
    data: {
      nome,
      email,
      senha, // (futuramente: hash)
      role: role || 'ADMIN',
    },
  });

  return NextResponse.json(novoUsuario, { status: 201 });
}
