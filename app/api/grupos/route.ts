import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
      const body = await req.json();
      const { id, nome, imagem, plataformasSelecionadas } = body;
  
      // Se existir id, é edição
      let grupo;
      if (id) {
        grupo = await prisma.grupos.update({
          where: { id },
          data: { nome, imagem },
        });
      } else {
        grupo = await prisma.grupos.create({
          data: { nome, imagem },
        });
      }
  
      // Limpa todas as plataformas que estavam com este grupo
      await prisma.plataformas.updateMany({
        where: { grupoId: grupo.id },
        data: { grupoId: null },
      });
  
      // Atualiza plataformas selecionadas
      if (plataformasSelecionadas && plataformasSelecionadas.length > 0) {
        await prisma.plataformas.updateMany({
          where: {
            id: { in: plataformasSelecionadas },
          },
          data: {
            grupoId: grupo.id,
          },
        });
      }
  
      return NextResponse.json(grupo);
    } catch (error) {
      console.error("Erro ao salvar grupo:", error);
      return new NextResponse("Erro interno", { status: 500 });
    }
  }
  
  export async function GET() {
    try {
      const grupos = await prisma.grupos.findMany({
        orderBy: { nome: 'asc' },
      });
      return NextResponse.json(grupos);
    } catch (error) {
      console.error("Erro ao buscar grupos:", error);
      return new NextResponse("Erro interno", { status: 500 });
    }
  }
  