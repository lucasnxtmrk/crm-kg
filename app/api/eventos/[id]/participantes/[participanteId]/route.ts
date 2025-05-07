// /app/api/eventos/[id]/participantes/[participanteId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

// Função DELETE para excluir um participante específico de um evento
export async function DELETE(
  req: NextRequest, // Use NextRequest para acesso mais fácil aos params
  { params }: { params: { id: string; participanteId: string } } // Note que agora temos 'id' (evento) e 'participanteId' (participante) nos params
) {
  const eventoId = params.id; // ID do evento
  const participanteId = params.participanteId; // ID do participante a ser excluído

  try {
    // Opcional: Verificar se o participante realmente pertence a este evento antes de excluir
    // const participanteExistente = await prisma.participanteEvento.findUnique({
    //   where: { id: participanteId },
    //   select: { evento_id: true }, // Seleciona apenas o ID do evento relacionado
    // });

    // if (!participanteExistente || participanteExistente.evento_id !== eventoId) {
    //   return new Response("Participante não encontrado ou não pertence a este evento", { status: 404 });
    // }

    // Exclui o registro ParticipanteEvento usando o ID do participante
    await prisma.participanteEvento.delete({
      where: {
        id: participanteId, // Use o ID do ParticipanteEvento capturado na URL
      },
    });

    // Resposta de sucesso (sem conteúdo é comum para DELETE)
    return new Response(null, { status: 204 });

  } catch (error: any) {
     // Se o erro for porque o registro não foi encontrado, retorna 404
     if (error.code === 'P2025') { // Código de erro do Prisma para "record not found"
         console.error(`Erro ao excluir participante ${participanteId}: Registro não encontrado.`);
         return new Response("Participante não encontrado", { status: 404 });
     }

    console.error(`Erro ao excluir participante ${participanteId}:`, error);
    return new Response("Erro interno do servidor ao excluir participante", { status: 500 });
  }
}
