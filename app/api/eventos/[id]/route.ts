// /app/api/eventos/[id]/route.ts
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    const evento = await prisma.eventos.findUnique({
      where: { id },
      include: {
        participantes: {
          include: { influenciador: true },
        },
        plataformas: {
          include: {
            plataforma: true,
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
