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
