// /app/api/eventos/[id]/participantes/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const participantes = await prisma.participanteEvento.findMany({
      where: { evento_id: id },
      include: { influenciador: true },
    });

    return Response.json(participantes);
  } catch (error) {
    console.error("Erro ao buscar participantes:", error);
    return new Response("Erro ao buscar participantes", { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json(); // { influencer_id, meta, atingido }

  try {
    const participante = await prisma.participanteEvento.create({
      data: {
        evento_id: params.id,
        influencer_id: data.influencer_id,
        meta: data.meta,
        atingido: data.atingido,
      },
    });

    return Response.json(participante);
  } catch (error) {
    console.error("Erro ao adicionar participante:", error);
    return new Response("Erro ao adicionar participante", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const data = await req.json(); // { participante_id, meta, atingido }

  try {
    const participante = await prisma.participanteEvento.update({
      where: {
        id: data.participante_id, // ID do participante, não do evento
      },
      data: {
        meta: data.meta,
        atingido: data.atingido,
      },
    });

    return Response.json(participante);
  } catch (error) {
    console.error("Erro ao atualizar participante:", error);
    return new Response("Erro ao atualizar participante", { status: 500 });
  }
}

