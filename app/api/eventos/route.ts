// /app/api/eventos/route.ts
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET() {
  // Seu código GET está bom, mantido como está.
  try {
    const eventos = await prisma.eventos.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        plataformas: {
          include: {
            plataforma: true,
          },
        },
        participantes: { // Adicionar participantes se quiser vê-los na listagem geral
          include: {
            influenciador: true,
          }
        }
      },
    });
    return Response.json(eventos);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return new Response('Erro interno ao buscar eventos.', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body: { nome: string; data: string; plataformaIds: string[] } = await req.json();

    // Validação dos dados recebidos
    if (!body.nome || !body.data || !body.plataformaIds || body.plataformaIds.length === 0) {
      return new Response('Dados incompletos: Nome, data do evento e pelo menos uma plataforma são obrigatórios.', { status: 400 });
    }

    // Verifica se a data é válida antes de tentar criar um new Date
    const dataEventoTimestamp = Date.parse(body.data);
    if (isNaN(dataEventoTimestamp)) {
        return new Response('Formato de data inválido. Use YYYY-MM-DD.', { status: 400 });
    }

    const evento = await prisma.eventos.create({
      data: {
        nome: body.nome,
        data_evento: new Date(dataEventoTimestamp), // <-- Usar o novo campo e converter string para Date
                                                  // createdAt será preenchido automaticamente pelo Prisma
        plataformas: { // 'plataformas' é a relação em 'eventos' para 'EventoPlataforma[]'
          create: body.plataformaIds.map((idDaPlataforma: string) => ({
            // 'plataforma' é a relação em 'EventoPlataforma' para o modelo 'plataformas'
            plataforma: {
              connect: { id: idDaPlataforma },
            },
          })),
        },
      },
      include: { // Incluir dados relacionados na resposta
        plataformas: {
          include: {
            plataforma: true,
          },
        },
      },
    });

    return Response.json(evento, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Erro detalhado ao criar evento:', error); // Log completo do erro no backend
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        // Exemplo: se 'nome' do evento for único e houver duplicidade
        const target = Array.isArray(error.meta?.target) ? error.meta.target.join(', ') : error.meta?.target;
        return new Response(`Conflito ao criar evento. O campo '${target}' pode já existir ou violar uma restrição de unicidade.`, { status: 409 });
      }
      // Outros erros do Prisma
      return new Response(`Erro de banco de dados ao processar sua solicitação. Código: ${error.code}`, { status: 400 });
    } else if (error instanceof SyntaxError) {
      return new Response('Erro de Sintaxe: JSON mal formatado na requisição.', { status: 400 });
    }
    // Erros genéricos
    return new Response('Erro interno do servidor ao tentar criar o evento.', { status: 500 });
  }
}