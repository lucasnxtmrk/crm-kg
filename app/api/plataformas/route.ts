import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

// Função para gerar slug baseado no nome
function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')                // separa acentos das letras
    .replace(/[\u0300-\u036f]/g, '')  // remove os acentos
    .replace(/[^a-z0-9]+/g, '-')      // troca tudo que não for letra ou número por "-"
    .replace(/(^-|-$)+/g, '');         // remove hífens do começo e do final
}

export async function GET() {
  try {
    const plataformas = await prisma.plataformas.findMany({
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        imagem: true,
        cor: true,
        grupoId: true, // 👈 adicione isso!
      },
    });
    return NextResponse.json(plataformas);
  } catch (error) {
    console.error("Erro ao buscar plataformas:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { nome, cor, imagem, grupoId } = body;

    if (!nome || !cor) {
      return new NextResponse("Nome e cor são obrigatórios", { status: 400 });
    }

    const id = slugify(nome); // 👈 Gerando ID bonito baseado no nome!
    let imagemPath: string | undefined = undefined;

    if (imagem) {
      const buffer = Buffer.from(imagem.split(",")[1], "base64");
      const filePath = path.join(process.cwd(), "public", "plataformas", `${id}.png`);

      await writeFile(filePath, buffer);

      imagemPath = `/plataformas/${id}.png`;
    }

    const novaPlataforma = await prisma.plataformas.create({
      data: {
        id,
        nome,
        cor,
        imagem: imagemPath,
        grupoId, // ✅ novo campo opcional
      },
    });

    return NextResponse.json(novaPlataforma);
  } catch (error) {
    console.error("Erro ao criar plataforma:", error);
    return new NextResponse("Erro interno", { status: 500 });
  }
}
