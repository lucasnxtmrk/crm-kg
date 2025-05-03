// /app/api/eventos/[id]/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const id = params.id;
  
    try {
      const evento = await prisma.eventos.findUnique({
        where: { id },
        include: {
            participantes: {
              include: {
                influenciador: true,
              },
            },
          },
      });
  
      if (!evento) {
        return new Response("Evento não encontrado", { status: 404 });
      }
  
      return Response.json(evento);
    } catch (error) {
      console.error("Erro ao buscar evento:", error);
      return new Response("Erro ao buscar evento", { status: 500 });
    }
  }

export async function POST(req: Request, { params }: { params: { id: string } }) {
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