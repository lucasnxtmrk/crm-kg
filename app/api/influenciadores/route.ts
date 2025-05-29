import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

// 🔍 Buscar todos os influenciadores (GET)
export async function GET() {
  const influenciadores = await prisma.influenciadores.findMany({
    include: {
      cadastros_influenciadores: {
        include: {
          plataformas: true,
          recargas: true,
        },
      },
      salarios_mensais: true,
    },
  });

  return NextResponse.json(influenciadores);
}

// ✨ Criar novo influenciador (POST)
export async function POST(req: Request) {
  const data = await req.json();
  console.log("🛠️ Payload recebido:", data);

  try {
    // 🛡️ Validação: verificar se a plataforma existe antes de criar
    const plataformaExiste = await prisma.plataformas.findUnique({
      where: { id: data.plataforma_id },
    });

    if (!plataformaExiste) {
      return NextResponse.json(
        { message: "Plataforma não encontrada." },
        { status: 400 }
      );
    }

    // ✅ Criação do influenciador com cadastro na plataforma
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
        contratado: data.contratado,
        salario_fixo: data.salario_fixo,

        cadastros_influenciadores: {
          create: {
            id: uuidv4(),
            influenciador_plataforma_id: data.influenciador_plataforma_id,
            plataforma_id: data.plataforma_id, // ✅ Correto!
          },
        },
      },
      include: {
        cadastros_influenciadores: {
          include: { plataformas: true },
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
