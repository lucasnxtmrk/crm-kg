import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Atualizar uma plataforma específica
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { nome, cor, grupoId } = body;

    if (!nome && !cor && grupoId === undefined) {
      return new NextResponse("Nenhum dado fornecido para atualizar", { status: 400 });
    }

    const plataformaAtualizada = await prisma.plataformas.update({
      where: { id: params.id },
      data: {
        ...(nome && { nome }),
        ...(cor && { cor }),
        ...(grupoId !== undefined && { grupoId }),
      },
    });

    return NextResponse.json(plataformaAtualizada);
  } catch (error) {
    console.error("Erro ao atualizar plataforma:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
