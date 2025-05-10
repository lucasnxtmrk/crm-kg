import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const usuarios = await prisma.usuarios.findMany({
    orderBy: { nome : 'desc' },
    select: {
      id: true,
      nome: true,
      email: true,
      role: true,
    },
  });
  return NextResponse.json(usuarios);
}

export async function POST(req: NextRequest) {
  try {
    const { nome, email, senha, role } = await req.json();

    if (!nome || !email || !senha) {
      return new NextResponse('Campos obrigatórios faltando', { status: 400 });
    }

    const novoUsuario = await prisma.usuarios.create({
      data: { nome, email, senha, role: role || 'ADMIN' },
    });

    return NextResponse.json(novoUsuario, { status: 201 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Erro ao criar usuário', { status: 500 });
  }
}
