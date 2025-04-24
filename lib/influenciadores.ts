export type StatusKanban = {
  id: string;
  title: string;
  ocultoNoKanban?: boolean;
};

export const statusKanbanList: StatusKanban[] = [
  { id: 'lead', title: 'Lead' },
  { id: 'contato', title: 'Em contato' },
  { id: 'negociacao', title: 'Em negociação' },
  { id: 'ativo', title: 'Ativo' },
  { id: 'banido', title: 'Banido', ocultoNoKanban: true },
];

export type Recarga = {
  id: string;
  plataformaId: string;
  inicio: string;
  termino: string;
  salario: number;
  meta: number;
  atingido: number;
  reembolso: number;
  superouMeta: number;
  statusMeta: 'completo' | 'incompleto';
};

export type Influenciador = {
  id: string;
  nome: string;
  imagem?: string;
  instagram: string;
  dataCadastro: string;
  cpf: string;
  status: 'lead' | 'contato' | 'negociacao' | 'ativo' | 'banido';
  motivoBanimento?: string;
  recargas: Recarga[];
};

// Variável global de data de hoje (pode ser usada em filtros)
export const hoje = new Date().toISOString().split('T')[0];

// Função para filtrar influenciadores por plataforma
export function getInfluenciadoresBySlug(slug: string): Influenciador[] {
  return influenciadores
    .filter((inf) => inf.status !== 'banido')
    .filter((inf) => inf.recargas.some((rec) => rec.plataformaId === slug))
    .map((inf) => {
      const recsDaPlataforma = inf.recargas.filter((r) => r.plataformaId === slug);

      return {
        ...inf,
        recargas: recsDaPlataforma,
      };
    });
}


export const influenciadores: Influenciador[] = [
  {
    id: "inf-200",
    nome: "Luana Ferreira",
    imagem: "/images/avatar/avatar-0.png",
    instagram: "https://instagram.com/neymarjr",
    dataCadastro: "2025-01-15",
    cpf: "158.963.741-00",
    status: "banido",
    recargas: [
      // stake → genio777
      {
        id: "inf-200-rec1",
        plataformaId: "genio777",
        inicio: "2025-02-21",
        termino: "2025-03-22",
        salario: 2754,
        meta: 3000,
        atingido: 2800,
        reembolso: 200,
        superouMeta: 0,
        statusMeta: "incompleto",
      },
      {
        id: "inf-200-rec2",
        plataformaId: "genio777",
        inicio: "2025-03-23",
        termino: "2025-04-24",
        salario: 3100,
        meta: 3300,
        atingido: 3600,
        reembolso: 0,
        superouMeta: 300,
        statusMeta: "completo",
      },
      // nova recarga em Sergipe Boi
      {
        id: "inf-200-rec3",
        plataformaId: "sergipeboi",
        inicio: "2025-04-01",
        termino: "2025-04-24",
        salario: 2900,
        meta: 3200,
        atingido: 3100,
        reembolso: 100,
        superouMeta: 0,
        statusMeta: "incompleto",
      },
    ],
  },
  {
    id: "inf-201",
    nome: "Caio Mendes",
    imagem: "/images/avatar/avatar-1.png",
    instagram: "https://instagram.com/neymarjr",
    dataCadastro: "2025-02-04",
    cpf: "237.481.965-11",
    status: "negociacao",
    recargas: [
      // blaze → pgcoelho
      {
        id: "inf-201-rec1",
        plataformaId: "pgcoelho",
        inicio: "2025-02-21",
        termino: "2025-03-23",
        salario: 2600,
        meta: 3000,
        atingido: 2000,
        reembolso: 1000,
        superouMeta: 0,
        statusMeta: "incompleto",
      },
      // stake → genio777
      {
        id: "inf-201-rec69",
        plataformaId: "genio777",
        inicio: "2025-02-21",
        termino: "2025-03-23",
        salario: 2600,
        meta: 4000,
        atingido: 8000,
        reembolso: 0,
        superouMeta: 4000,
        statusMeta: "completo",
      },
      // nova recarga em Sergipe Boi
      {
        id: "inf-201-rec2",
        plataformaId: "sergipeboi",
        inicio: "2025-03-24",
        termino: "2025-04-25",
        salario: 2800,
        meta: 3000,
        atingido: 3000,
        reembolso: 0,
        superouMeta: 0,
        statusMeta: "completo",
      },
      {
        id: "inf-201-rec3",
        plataformaId: "pgcoelho",
        inicio: "2025-03-24",
        termino: "2025-04-26",
        salario: 2800,
        meta: 3000,
        atingido: 3000,
        reembolso: 0,
        superouMeta: 0,
        statusMeta: "completo",
      },
      {
        id: "inf-201-rec4",
        plataformaId: "genio777",
        inicio: "2025-03-24",
        termino: "2025-04-27",
        salario: 2800,
        meta: 3000,
        atingido: 3000,
        reembolso: 0,
        superouMeta: 0,
        statusMeta: "completo",
      },
      {
        id: "inf-201-rec5",
        plataformaId: "piupiu",
        inicio: "2025-03-24",
        termino: "2025-04-28",
        salario: 2800,
        meta: 3000,
        atingido: 3000,
        reembolso: 0,
        superouMeta: 0,
        statusMeta: "completo",
      },
    ],
  },
  {
    id: "inf-202",
    nome: "Eduarda Pires",
    imagem: "/images/avatar/avatar-2.png",
    instagram: "https://instagram.com/neymarjr",
    dataCadastro: "2025-01-10",
    cpf: "478.293.159-88",
    status: "contato",
    recargas: [
      // betano → piupiu
      {
        id: "inf-202-rec1",
        plataformaId: "piupiu",
        inicio: "2025-02-21",
        termino: "2025-03-22",
        salario: 2950,
        meta: 3100,
        atingido: 3050,
        reembolso: 50,
        superouMeta: 0,
        statusMeta: "incompleto",
      },
      // blaze → pgcoelho
      {
        id: "inf-202-rec2",
        plataformaId: "pgcoelho",
        inicio: "2025-03-23",
        termino: "2025-04-22",
        salario: 3300,
        meta: 3400,
        atingido: 3700,
        reembolso: 0,
        superouMeta: 300,
        statusMeta: "completo",
      },
    ],
  },
  {
    id: "inf-203",
    nome: "Thiago Santana",
    imagem: "/images/avatar/avatar-3.png",
    instagram: "https://instagram.com/neymarjr",
    dataCadastro: "2023-12-12",
    cpf: "819.654.321-77",
    status: "lead",
    recargas: [
      // betano → piupiu
      {
        id: "inf-203-rec1",
        plataformaId: "piupiu",
        inicio: "2025-02-21",
        termino: "2025-03-22",
        salario: 2800,
        meta: 3100,
        atingido: 2900,
        reembolso: 200,
        superouMeta: 0,
        statusMeta: "incompleto",
      },
      // nova recarga em Sergipe Boi
      {
        id: "inf-203-rec2",
        plataformaId: "sergipeboi",
        inicio: "2025-03-23",
        termino: "2025-04-24",
        salario: 3000,
        meta: 3200,
        atingido: 3200,
        reembolso: 0,
        superouMeta: 200,
        statusMeta: "completo",
      },
    ],
  },
  {
    id: "inf-204",
    nome: "Natalia Costa",
    imagem: "/images/avatar/avatar-4.png",
    instagram: "https://instagram.com/neymarjr",
    dataCadastro: "2025-03-01",
    cpf: "284.136.479-55",
    status: "banido",
    recargas: [
      // stake → genio777
      {
        id: "inf-204-rec1",
        plataformaId: "genio777",
        inicio: "2025-02-21",
        termino: "2025-03-22",
        salario: 3100,
        meta: 3300,
        atingido: 3900,
        reembolso: 0,
        superouMeta: 600,
        statusMeta: "completo",
      },
      // nova recarga em Sergipe Boi
      {
        id: "inf-204-rec2",
        plataformaId: "sergipeboi",
        inicio: "2025-03-23",
        termino: "2025-04-24",
        salario: 3200,
        meta: 3400,
        atingido: 3300,
        reembolso: 100,
        superouMeta: 0,
        statusMeta: "incompleto",
      },
    ],
  },
];


