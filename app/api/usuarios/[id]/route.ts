import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

export async function GET(_: NextRequest, { params }: Params) {
  const usuario = await prisma.usuarios.findUnique({
    where: { id: params.id },
  });

  if (!usuario) return new NextResponse('Usuário não encontrado', { status: 404 });

  return NextResponse.json(usuario);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();

    const usuarioAtualizado = await prisma.usuarios.update({
      where: { id: params.id },
      data: body,
    });

    return NextResponse.json(usuarioAtualizado);
  } catch (error) {
    console.error(error);
    return new NextResponse('Erro ao atualizar usuário', { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  try {
    await prisma.usuarios.delete({ where: { id: params.id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return new NextResponse('Erro ao excluir usuário', { status: 500 });
  }
}
