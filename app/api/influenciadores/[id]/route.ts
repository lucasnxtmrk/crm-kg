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
        salarios_mensais: true, // ✅ incluído para trazer os salários também
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

// PATCH: Atualizar influenciador, recargas e salários mensais
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;
  const data = await req.json();

  try {
    // 1. Atualiza os dados principais do influenciador
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
        contratado: data.contratado,
        salario_fixo: data.salario_fixo,
      },
    });

    // 2. Atualiza recargas (se houver)
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

    // 3. Atualiza salários mensais (delete + create)
    if (Array.isArray(data.salarios_mensais)) {
      const anos: number[] = [...new Set(
        (data.salarios_mensais as { ano: number }[]).map((s) => s.ano)
      )];
      // Remove salários antigos desses anos
      await prisma.salarios_mensais.deleteMany({
        where: {
          influenciador_id: id,
          ano: { in: anos },
        },
      });

      // Cria apenas os que possuem valor numérico válido
      const preenchidos = data.salarios_mensais.filter(
        (s: any) => typeof s.valor === "number" && !isNaN(s.valor)
      );

      if (preenchidos.length > 0) {
        await prisma.salarios_mensais.createMany({
          data: preenchidos.map((s: any) => ({
            influenciador_id: id,
            ano: s.ano,
            mes: s.mes,
            valor: s.valor,
          })),
        });
      }
    }

    return Response.json(updatedInfluenciador);
  } catch (error) {
    console.error("Erro ao atualizar influenciador:", error);
    return new Response("Erro ao atualizar influenciador", { status: 500 });
  }
}

// DELETE: Deletar influenciador e dados associados
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
    // Deletar recargas associadas
    await prisma.recargas.deleteMany({
      where: {
        cadastros_influenciadores: {
          influenciador_id: id,
        },
      },
    });

    // Deletar cadastros de plataformas
    await prisma.cadastros_influenciadores.deleteMany({
      where: {
        influenciador_id: id,
      },
    });

    // Deletar salários mensais
    await prisma.salarios_mensais.deleteMany({
      where: {
        influenciador_id: id,
      },
    });

    // Deletar influenciador
    await prisma.influenciadores.delete({
      where: { id },
    });

    return new Response("Influenciador deletado com sucesso", { status: 200 });
  } catch (error) {
    console.error("Erro ao deletar influenciador:", error);
    return new Response("Erro ao deletar influenciador", { status: 500 });
  }
}
