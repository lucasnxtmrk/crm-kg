import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Atualizar uma recarga existente
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json();

  const recargaAtualizada = await prisma.recargas.update({
    where: { id },
    data: {
      inicio: new Date(data.inicio),
      termino: new Date(data.termino),
      salario: data.salario,
      meta: data.meta,
      atingido: data.atingido,
      reembolso: data.reembolso,
      depositantes_meta: data.depositantes_meta,
      depositantes_atingido: data.depositantes_atingido,
      tipo: data.tipo,
      status_meta: data.status_meta,
      reembolso_status: data.reembolso_status,
    },
  });

  return NextResponse.json(recargaAtualizada);
}

// Deletar uma recarga
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  await prisma.recargas.delete({
    where: { id },
  });

  return NextResponse.json({ message: "Recarga deletada com sucesso!" });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await req.json();

  if (!data.reembolso_status) {
    return NextResponse.json({ error: "reembolso_status é obrigatório" }, { status: 400 });
  }

  const recargaAtualizada = await prisma.recargas.update({
    where: { id },
    data: {
      reembolso_status: data.reembolso_status,
    },
  });

  return NextResponse.json(recargaAtualizada);
}