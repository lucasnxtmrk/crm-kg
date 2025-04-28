import { prisma } from "@/lib/prisma";

// GET: Buscar influenciador pelo id
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    const influenciador = await prisma.influenciadores.findUnique({
      where: { id },
      include: {
        cadastros_influenciadores: {
          include: {
            recargas: true,
          },
        },
      },
    });

    if (!influenciador) {
      return new Response("Influenciador não encontrado", { status: 404 });
    }

    return Response.json(influenciador);
  } catch (error) {
    console.error("Erro ao buscar influenciador:", error);
    return new Response("Erro ao buscar influenciador", { status: 500 });
  }
}

// PATCH: Atualizar influenciador e suas recargas
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();

  try {
    // Atualiza dados principais do influenciador
    const updatedInfluenciador = await prisma.influenciadores.update({
      where: { id },
      data: {
        nome: data.nome,
        instagram: data.instagram,
        email: data.email,
        cpf: data.cpf,
        chavepix: data.chavepix,
        imagem: data.imagem,
        status: data.status,
        motivo_banimento: data.motivo_banimento,
      },
    });

    // Agora atualiza cada recarga (se vieram recargas no request)
    if (data.cadastros_influenciadores) {
      for (const cadastro of data.cadastros_influenciadores) {
        for (const recarga of cadastro.recargas) {
          await prisma.recargas.update({
            where: { id: recarga.id },
            data: {
              salario: recarga.salario,
              meta: recarga.meta,
              atingido: recarga.atingido,
              reembolso: recarga.reembolso,
              depositantes_meta: recarga.depositantes_meta,
              depositantes_atingido: recarga.depositantes_atingido,
              status_meta: recarga.status_meta,
              reembolso_status: recarga.reembolso_status,
            },
          });
        }
      }
    }

    return Response.json(updatedInfluenciador);
  } catch (error) {
    console.error("Erro ao atualizar influenciador:", error);
    return new Response("Erro ao atualizar influenciador", { status: 500 });
  }
}


// DELETE: Deletar influenciador
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // Primeiro, deletar recargas associadas
    await prisma.recargas.deleteMany({
      where: {
        cadastros_influenciadores: {
          influenciador_id: id,
        },
      },
    });

    // Depois, deletar cadastros_influenciadores
    await prisma.cadastros_influenciadores.deleteMany({
      where: {
        influenciador_id: id,
      },
    });

    // Por último, deletar o influenciador
    await prisma.influenciadores.delete({
      where: { id },
    });

    return new Response("Influenciador deletado com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar influenciador:", error);
    return new Response("Erro ao deletar influenciador", { status: 500 });
  }
}
