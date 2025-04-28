import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Listar todos os cadastros de influenciadores em plataformas
export async function GET() {
  const cadastros = await prisma.cadastros_influenciadores.findMany({
    include: {
      influenciadores: true,
      plataformas: true,
      recargas: true,
    },
  });

  return NextResponse.json(cadastros);
}

// Criar um novo cadastro
export async function POST(req: Request) {
  const data = await req.json();

  const novoCadastro = await prisma.cadastros_influenciadores.create({
    data: {
      id: data.id,                            // exemplo: "cad-inf-205-1"
      influenciador_id: data.influenciador_id, // ID do influenciador
      plataforma_id: data.plataforma_id,       // ID da plataforma
      influenciador_plataforma_id: data.influenciador_plataforma_id, // ID usado dentro da plataforma
    },
  });

  return NextResponse.json(novoCadastro, { status: 201 });
}
