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

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();

  try {
    const eventoAtualizado = await prisma.eventos.update({
      where: { id },
      data: {
        nome: body.nome,
        data_evento: new Date(body.data),
        plataformas: {
          deleteMany: {}, // remove as atuais
          create: body.plataformaIds.map((plataformaId: string) => ({
            plataforma: { connect: { id: plataformaId } }
          }))
        }
      },
      include: {
        plataformas: {
          include: {
            plataforma: true,
          },
        },
      },
    });

    return Response.json(eventoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return new Response("Erro ao atualizar evento", { status: 500 });
  }
}