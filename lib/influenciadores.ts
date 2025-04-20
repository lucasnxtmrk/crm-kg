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
  { id: 'banido', title: 'Banido', ocultoNoKanban: true }, // apenas para a Lista Negra
];

export type Influenciador = {
  id: string;
  nome: string;
  imagem?: string;
  instagram: string;
  dataCadastro: string;
  cpf: string;
  status: 'lead' | 'contato' | 'negociacao' | 'ativo' | 'banido';
  relacoes: {
    plataformaId: string;
    meta: number;
    atingido: number;
    reembolso: number;
    superouMeta: number;
    statusMeta: 'completo' | 'incompleto';
  }[];
};

  

export const influenciadores: Influenciador[] = [
  {
    id: 'inf-100',
    nome: 'Pedro Henrique',
    imagem: '/images/avatar/avatar-3.png',
    instagram: 'https://instagram.com/pedrohenrique',
    dataCadastro: '2024-07-13',
    cpf: '420.921.747-69',
    relacoes: [
      { plataformaId: 'betano', meta: 0, atingido: 0, reembolso: 0, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'contato',
  },
  {
    id: 'inf-101',
    nome: 'Larissa Silva',
    imagem: '/images/avatar/avatar-1.png',
    instagram: 'https://instagram.com/larissasilva',
    dataCadastro: '2024-11-06',
    cpf: '817.217.864-48',
    relacoes: [
      { plataformaId: 'blaze', meta: 5210, atingido: 6132, reembolso: 0, superouMeta: 922, statusMeta: 'completo' }
    ],
    status: 'lead',
  },
  {
    id: 'inf-102',
    nome: 'Diego Martins',
    imagem: '/images/avatar/avatar-9.png',
    instagram: 'https://instagram.com/diegomartins',
    dataCadastro: '2024-03-15',
    cpf: '195.688.749-89',
    relacoes: [
      { plataformaId: 'blaze', meta: 5657, atingido: 7183, reembolso: 0, superouMeta: 1526, statusMeta: 'completo' }
    ],
    status: 'ativo',
  },
  {
    id: 'inf-103',
    nome: 'Gustavo Rocha',
    imagem: '/images/avatar/avatar-8.png',
    instagram: 'https://instagram.com/gustavorocha',
    dataCadastro: '2024-04-09',
    cpf: '488.292.257-53',
    relacoes: [
      { plataformaId: 'betano', meta: 0, atingido: 0, reembolso: 0, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'contato',
  },
  {
    id: 'inf-104',
    nome: 'Fernanda Rocha',
    imagem: '/images/avatar/avatar-8.png',
    instagram: 'https://instagram.com/fernandarocha',
    dataCadastro: '2024-03-02',
    cpf: '777.348.385-65',
    relacoes: [
      { plataformaId: 'betano', meta: 5770, atingido: 4770, reembolso: 1000, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'contato',
  },
  {
    id: 'inf-105',
    nome: 'Vinicius Dias',
    imagem: '/images/avatar/avatar-4.png',
    instagram: 'https://instagram.com/viniciusdias',
    dataCadastro: '2024-01-08',
    cpf: '846.292.194-51',
    relacoes: [
      { plataformaId: 'blaze', meta: 5356, atingido: 5177, reembolso: 179, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'lead',
  },
  {
    id: 'inf-106',
    nome: 'Bruno Lima',
    imagem: '/images/avatar/avatar-7.png',
    instagram: 'https://instagram.com/brunolima',
    dataCadastro: '2024-02-25',
    cpf: '699.873.726-23',
    relacoes: [
      { plataformaId: 'betano', meta: 1593, atingido: 2062, reembolso: 0, superouMeta: 469, statusMeta: 'completo' },
      { plataformaId: 'blaze', meta: 0, atingido: 0, reembolso: 0, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'ativo',
  },
  {
    id: 'inf-107',
    nome: 'Ana Clara',
    imagem: '/images/avatar/avatar-3.png',
    instagram: 'https://instagram.com/anaclara',
    dataCadastro: '2024-10-20',
    cpf: '707.499.222-63',
    relacoes: [
      { plataformaId: 'betano', meta: 0, atingido: 0, reembolso: 0, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'banido',
  },
  {
    id: 'inf-108',
    nome: 'Tiago Gomes',
    imagem: '/images/avatar/avatar-4.png',
    instagram: 'https://instagram.com/tiagogomes',
    dataCadastro: '2024-08-06',
    cpf: '707.644.445-45',
    relacoes: [
      { plataformaId: 'blaze', meta: 1336, atingido: 2395, reembolso: 0, superouMeta: 1059, statusMeta: 'completo' }
    ],
    status: 'ativo',
  },
  {
    id: 'inf-109',
    nome: 'Camila Brito',
    imagem: '/images/avatar/avatar-6.png',
    instagram: 'https://instagram.com/camilabrito',
    dataCadastro: '2024-03-28',
    cpf: '870.209.354-64',
    relacoes: [
      { plataformaId: 'blaze', meta: 2026, atingido: 2390, reembolso: 0, superouMeta: 364, statusMeta: 'completo' }
    ],
    status: 'lead',
  },
  {
    id: 'inf-110',
    nome: 'Rodrigo Leal',
    imagem: '/images/avatar/avatar-5.png',
    instagram: 'https://instagram.com/rodrigoleal',
    dataCadastro: '2024-02-02',
    cpf: '357.398.843-66',
    relacoes: [
      { plataformaId: 'blaze', meta: 0, atingido: 0, reembolso: 0, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'negociacao',
  },
  {
    id: 'inf-111',
    nome: 'Juliana Nunes',
    imagem: '/images/avatar/avatar-1.png',
    instagram: 'https://instagram.com/juliananunes',
    dataCadastro: '2024-04-10',
    cpf: '214.369.987-14',
    relacoes: [
      { plataformaId: 'betano', meta: 4333, atingido: 2871, reembolso: 1462, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'lead',
  },
  {
    id: 'inf-112',
    nome: 'Carlos Eduardo',
    imagem: '/images/avatar/avatar-8.png',
    instagram: 'https://instagram.com/carloseduardo',
    dataCadastro: '2024-07-26',
    cpf: '798.123.544-21',
    relacoes: [
      { plataformaId: 'blaze', meta: 2310, atingido: 1347, reembolso: 963, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'contato',
  },
  {
    id: 'inf-113',
    nome: 'Amanda Costa',
    imagem: '/images/avatar/avatar-2.png',
    instagram: 'https://instagram.com/amandacosta',
    dataCadastro: '2024-03-11',
    cpf: '123.456.789-00',
    relacoes: [
      { plataformaId: 'betano', meta: 3702, atingido: 5030, reembolso: 0, superouMeta: 1328, statusMeta: 'completo' }
    ],
    status: 'negociacao',
  },
  {
    id: 'inf-114',
    nome: 'Lucas Oliveira',
    imagem: '/images/avatar/avatar-7.png',
    instagram: 'https://instagram.com/lucasoliveira',
    dataCadastro: '2024-01-22',
    cpf: '456.789.123-00',
    relacoes: [
      { plataformaId: 'blaze', meta: 0, atingido: 0, reembolso: 0, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'banido',
  },
  {
    id: 'inf-115',
    nome: 'Mariana Freitas',
    imagem: '/images/avatar/avatar-9.png',
    instagram: 'https://instagram.com/marianafreitas',
    dataCadastro: '2024-11-12',
    cpf: '321.654.987-77',
    relacoes: [
      { plataformaId: 'betano', meta: 2900, atingido: 1500, reembolso: 1400, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'lead',
  },
  {
    id: 'inf-116',
    nome: 'Rafael Souza',
    imagem: '/images/avatar/avatar-6.png',
    instagram: 'https://instagram.com/rafaelsouza',
    dataCadastro: '2024-10-30',
    cpf: '987.321.654-22',
    relacoes: [
      { plataformaId: 'blaze', meta: 4011, atingido: 4011, reembolso: 0, superouMeta: 0, statusMeta: 'completo' }
    ],
    status: 'ativo',
  },
  {
    id: 'inf-117',
    nome: 'Beatriz Ramos',
    imagem: '/images/avatar/avatar-5.png',
    instagram: 'https://instagram.com/beatrizramos',
    dataCadastro: '2024-06-17',
    cpf: '789.654.123-88',
    relacoes: [
      { plataformaId: 'blaze', meta: 6000, atingido: 6800, reembolso: 0, superouMeta: 800, statusMeta: 'completo' }
    ],
    status: 'ativo',
  },
  {
    id: 'inf-118',
    nome: 'João Vitor',
    imagem: '/images/avatar/avatar-2.png',
    instagram: 'https://instagram.com/joaovitor',
    dataCadastro: '2024-05-08',
    cpf: '111.222.333-44',
    relacoes: [
      { plataformaId: 'betano', meta: 0, atingido: 0, reembolso: 0, superouMeta: 0, statusMeta: 'incompleto' }
    ],
    status: 'lead',
  },
  {
    id: 'inf-119',
    nome: 'Isabela Moura',
    imagem: '/images/avatar/avatar-1.png',
    instagram: 'https://instagram.com/isabelamoura',
    dataCadastro: '2024-09-03',
    cpf: '444.555.666-77',
    relacoes: [
      { plataformaId: 'blaze', meta: 1870, atingido: 2210, reembolso: 0, superouMeta: 340, statusMeta: 'completo' }
    ],
    status: 'negociacao',
  }
];



  
export function getInfluenciadoresBySlug(slug: string): Influenciador[] {
  return influenciadores
    .filter((inf) => inf.relacoes.some((rel) => rel.plataformaId === slug))
    .map((inf) => {
      const relacao = inf.relacoes.find((r) => r.plataformaId === slug);
      const meta = relacao?.meta || 0;
      const atingido = relacao?.atingido || 0;
      const reembolso = Math.max(meta - atingido, 0);
      const superouMeta = atingido > meta ? atingido - meta : 0;

      return {
        ...inf,
        meta,
        atingido,
        reembolso,
        superouMeta,
        statusMeta: atingido >= meta ? 'completo' : 'incompleto',
      };
    });
}

  
  

  export default influenciadores;

