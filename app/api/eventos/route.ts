// /app/api/eventos/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const eventos = await prisma.eventos.findMany({
      orderBy: { createdAt: "desc" },
    });
    return Response.json(eventos);
  } catch (error) {
    console.error("Erro ao buscar eventos:", error);
    return new Response("Erro interno", { status: 500 });
  }
}

export async function POST(req: Request) {
  const data = await req.json();

  try {
    const evento = await prisma.eventos.create({
      data: {
        nome: data.nome,
        plataforma: data.plataforma,
      },
    });

    return Response.json(evento);
  } catch (error) {
    console.error("Erro ao criar evento:", error);
    return new Response("Erro ao criar evento", { status: 500 });
  }
}
