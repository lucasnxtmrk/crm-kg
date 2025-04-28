import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Listar todas as recargas
export async function GET() {
  const recargas = await prisma.recargas.findMany({
    include: {
      cadastros_influenciadores: {
        include: {
          influenciadores: true,
          plataformas: true,
        },
      },
    },
  });

  return NextResponse.json(recargas);
}

// Criar uma nova recarga
export async function POST(req: Request) {
  const data = await req.json();

  const novaRecarga = await prisma.recargas.create({
    data: {
      id: data.id,                          // exemplo: "recarga-001"
      cadastro_id: data.cadastro_id,         // ID do cadastro do influenciador
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

  return NextResponse.json(novaRecarga, { status: 201 });
}
