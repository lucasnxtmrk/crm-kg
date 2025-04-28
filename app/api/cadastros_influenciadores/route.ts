import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // ⚡ Importa aqui também

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const novoCadastro = await prisma.cadastros_influenciadores.create({
      data: {
        id: uuidv4(), // 🔥 Gera um novo ID único aqui!
        influenciador_id: data.influenciador_id,
        plataforma_id: data.plataforma_id,
        influenciador_plataforma_id: data.influenciador_plataforma_id || "",
      },
    });

    return NextResponse.json(novoCadastro, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Erro ao criar cadastro." }, { status: 500 });
  }
}
