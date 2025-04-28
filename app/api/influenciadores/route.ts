import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// Buscar todos os influenciadores
export async function GET() {
  const influenciadores = await prisma.influenciadores.findMany({
    include: {
      cadastros_influenciadores: {
        include: {
          plataformas: true,
          recargas: true,
        },
      },
    },
  });

  return NextResponse.json(influenciadores);
}

// Criar novo influenciador
export async function POST(req: Request) {
  const data = await req.json();
  console.log("🛠️ Payload recebido:", data);

  try {
    const novo = await prisma.influenciadores.create({
      data: {
        id: data.id,
        nome: data.nome,
        imagem: data.imagem,
        instagram: data.instagram,
        email: data.email,
        telefone: data.telefone,
        data_cadastro: new Date(data.data_cadastro),
        cpf: data.cpf,
        chavepix: data.chavepix,
        status: data.status,
        motivo_banimento: data.motivo_banimento,

        cadastros_influenciadores: {
          create: {
            id: uuidv4(),
            influenciador_plataforma_id: data.influenciador_plataforma_id,
            plataformas: {          // conecta à plataforma existente
              connect: { id: data.plataforma_id }
            },
          },
        },
      },
      include: {
        cadastros_influenciadores: {
          include: { plataformas: true }
        },
      },
    });

    return NextResponse.json(novo, { status: 201 });
  } catch (err) {
    console.error("❌ PRISMA ERROR:", err);
    return NextResponse.json(
      {
        message: "Erro ao criar influenciador.",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}