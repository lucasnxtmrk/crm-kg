import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return new NextResponse("Email é obrigatório", { status: 400 });
  }

  const usuario = await prisma.usuarios.findUnique({ where: { email } });

  // Mesmo que o e-mail não exista, retornamos uma resposta genérica
  if (!usuario) {
    return new NextResponse(null, { status: 204 });
  }

  // Aqui futuramente geramos token e enviamos e-mail
  console.log(`Token de recuperação enviado para: ${email}`);

  return new NextResponse(null, { status: 204 });
}
