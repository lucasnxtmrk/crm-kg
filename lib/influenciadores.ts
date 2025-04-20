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

export type RelacaoPlataforma = {
  plataformaId: string;
  meta: number;
  atingido: number;
  reembolso: number;
  superouMeta: number;
  statusMeta: 'completo' | 'incompleto';
  inicio: string;
  termino: string;
  salario: number;
};

export type Influenciador = {
  id: string;
  nome: string;
  imagem?: string;
  instagram: string;
  dataCadastro: string;
  cpf: string;
  status: 'lead' | 'contato' | 'negociacao' | 'ativo' | 'banido';
  relacoes: RelacaoPlataforma[];
};

const hoje = new Date().toISOString().slice(0, 10);
  

export const influenciadores: Influenciador[] = [
  {
    "id": "inf-100",
    "nome": "Pedro Henrique",
    "imagem": "/images/avatar/avatar-0.png",
    "instagram": "https://instagram.com/pedrohenrique",
    "dataCadastro": "2024-03-14",
    "cpf": "364.799.000-36",
    "status": "ativo",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 2830,
        "atingido": 1714,
        "reembolso": 1116,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1982
      }
    ]
  },
  {
    "id": "inf-101",
    "nome": "Larissa Silva",
    "imagem": "/images/avatar/avatar-1.png",
    "instagram": "https://instagram.com/larissasilva",
    "dataCadastro": "2024-09-28",
    "cpf": "758.689.001-65",
    "status": "ativo",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 3529,
        "atingido": 1781,
        "reembolso": 1748,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1431
      },
      {
        "plataformaId": "blaze",
        "meta": 2752,
        "atingido": 1386,
        "reembolso": 1366,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1592
      }
    ]
  },
  {
    "id": "inf-102",
    "nome": "Diego Martins",
    "imagem": "/images/avatar/avatar-2.png",
    "instagram": "https://instagram.com/diegomartins",
    "dataCadastro": "2024-06-17",
    "cpf": "798.475.002-24",
    "status": "negociacao",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 1501,
        "atingido": 4473,
        "reembolso": 0,
        "superouMeta": 2972,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1933
      },
      {
        "plataformaId": "betano",
        "meta": 5751,
        "atingido": 4710,
        "reembolso": 1041,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2337
      }
    ]
  },
  {
    "id": "inf-103",
    "nome": "Gustavo Rocha",
    "imagem": "/images/avatar/avatar-3.png",
    "instagram": "https://instagram.com/gustavorocha",
    "dataCadastro": "2024-08-04",
    "cpf": "772.903.003-91",
    "status": "lead",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 3527,
        "atingido": 74,
        "reembolso": 3453,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2101
      },
      {
        "plataformaId": "stake",
        "meta": 5437,
        "atingido": 2117,
        "reembolso": 3320,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1425
      }
    ]
  },
  {
    "id": "inf-104",
    "nome": "Fernanda Rocha",
    "imagem": "/images/avatar/avatar-4.png",
    "instagram": "https://instagram.com/fernandarocha",
    "dataCadastro": "2024-04-24",
    "cpf": "297.319.004-69",
    "status": "lead",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 5144,
        "atingido": 6287,
        "reembolso": 0,
        "superouMeta": 1143,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1472
      }
    ]
  },
  {
    "id": "inf-105",
    "nome": "Vinicius Dias",
    "imagem": "/images/avatar/avatar-5.png",
    "instagram": "https://instagram.com/viniciusdias",
    "dataCadastro": "2024-09-12",
    "cpf": "123.177.005-70",
    "status": "negociacao",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 3084,
        "atingido": 2047,
        "reembolso": 1037,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1737
      },
      {
        "plataformaId": "blaze",
        "meta": 3331,
        "atingido": 1755,
        "reembolso": 1576,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 974
      }
    ]
  },
  {
    "id": "inf-106",
    "nome": "Bruno Lima",
    "imagem": "/images/avatar/avatar-6.png",
    "instagram": "https://instagram.com/brunolima",
    "dataCadastro": "2024-12-10",
    "cpf": "749.362.006-95",
    "status": "ativo",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 2260,
        "atingido": 370,
        "reembolso": 1890,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1208
      },
      {
        "plataformaId": "stake",
        "meta": 5018,
        "atingido": 4322,
        "reembolso": 696,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2496
      }
    ]
  },
  {
    "id": "inf-107",
    "nome": "Ana Clara",
    "imagem": "/images/avatar/avatar-7.png",
    "instagram": "https://instagram.com/anaclara",
    "dataCadastro": "2024-05-13",
    "cpf": "744.872.007-90",
    "status": "lead",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 4462,
        "atingido": 5536,
        "reembolso": 0,
        "superouMeta": 1074,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1363
      },
      {
        "plataformaId": "blaze",
        "meta": 4807,
        "atingido": 2405,
        "reembolso": 2402,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1078
      }
    ]
  },
  {
    "id": "inf-108",
    "nome": "Tiago Gomes",
    "imagem": "/images/avatar/avatar-8.png",
    "instagram": "https://instagram.com/tiagogomes",
    "dataCadastro": "2024-11-08",
    "cpf": "192.456.008-99",
    "status": "contato",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 1785,
        "atingido": 5742,
        "reembolso": 0,
        "superouMeta": 3957,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1020
      },
      {
        "plataformaId": "blaze",
        "meta": 4384,
        "atingido": 2898,
        "reembolso": 1486,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2101
      }
    ]
  },
  {
    "id": "inf-109",
    "nome": "Camila Brito",
    "imagem": "/images/avatar/avatar-9.png",
    "instagram": "https://instagram.com/camilabrito",
    "dataCadastro": "2024-07-14",
    "cpf": "956.600.009-60",
    "status": "banido",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 2594,
        "atingido": 3789,
        "reembolso": 0,
        "superouMeta": 1195,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1538
      }
    ]
  },
  {
    "id": "inf-110",
    "nome": "Rodrigo Leal",
    "imagem": "/images/avatar/avatar-0.png",
    "instagram": "https://instagram.com/rodrigoleal",
    "dataCadastro": "2024-09-20",
    "cpf": "631.664.010-78",
    "status": "negociacao",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 3155,
        "atingido": 4742,
        "reembolso": 0,
        "superouMeta": 1587,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2458
      },
      {
        "plataformaId": "betano",
        "meta": 1372,
        "atingido": 2814,
        "reembolso": 0,
        "superouMeta": 1442,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1738
      }
    ]
  },
  {
    "id": "inf-111",
    "nome": "Juliana Nunes",
    "imagem": "/images/avatar/avatar-1.png",
    "instagram": "https://instagram.com/juliananunes",
    "dataCadastro": "2024-10-08",
    "cpf": "419.271.011-29",
    "status": "negociacao",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 2501,
        "atingido": 1643,
        "reembolso": 858,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1162
      },
      {
        "plataformaId": "stake",
        "meta": 5519,
        "atingido": 5077,
        "reembolso": 442,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1092
      }
    ]
  },
  {
    "id": "inf-112",
    "nome": "Carlos Eduardo",
    "imagem": "/images/avatar/avatar-2.png",
    "instagram": "https://instagram.com/carloseduardo",
    "dataCadastro": "2024-02-24",
    "cpf": "396.269.012-41",
    "status": "contato",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 5766,
        "atingido": 2864,
        "reembolso": 2902,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 971
      },
      {
        "plataformaId": "stake",
        "meta": 4702,
        "atingido": 6680,
        "reembolso": 0,
        "superouMeta": 1978,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1426
      }
    ]
  },
  {
    "id": "inf-113",
    "nome": "Amanda Costa",
    "imagem": "/images/avatar/avatar-3.png",
    "instagram": "https://instagram.com/amandacosta",
    "dataCadastro": "2024-03-04",
    "cpf": "935.129.013-27",
    "status": "ativo",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 5438,
        "atingido": 4857,
        "reembolso": 581,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1936
      }
    ]
  },
  {
    "id": "inf-114",
    "nome": "Lucas Oliveira",
    "imagem": "/images/avatar/avatar-4.png",
    "instagram": "https://instagram.com/lucasoliveira",
    "dataCadastro": "2024-08-28",
    "cpf": "517.917.014-83",
    "status": "ativo",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 4121,
        "atingido": 1641,
        "reembolso": 2480,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1755
      }
    ]
  },
  {
    "id": "inf-115",
    "nome": "Mariana Freitas",
    "imagem": "/images/avatar/avatar-5.png",
    "instagram": "https://instagram.com/marianafreitas",
    "dataCadastro": "2024-07-14",
    "cpf": "228.473.015-31",
    "status": "negociacao",
    "relacoes": [
      {
        "plataformaId": "blaze",
        "meta": 3516,
        "atingido": 3764,
        "reembolso": 0,
        "superouMeta": 248,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2032
      }
    ]
  },
  {
    "id": "inf-116",
    "nome": "Rafael Souza",
    "imagem": "/images/avatar/avatar-6.png",
    "instagram": "https://instagram.com/rafaelsouza",
    "dataCadastro": "2024-02-19",
    "cpf": "280.384.016-64",
    "status": "contato",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 2148,
        "atingido": 4004,
        "reembolso": 0,
        "superouMeta": 1856,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1546
      }
    ]
  },
  {
    "id": "inf-117",
    "nome": "Beatriz Ramos",
    "imagem": "/images/avatar/avatar-7.png",
    "instagram": "https://instagram.com/beatrizramos",
    "dataCadastro": "2024-07-06",
    "cpf": "223.672.017-41",
    "status": "lead",
    "relacoes": [
      {
        "plataformaId": "stake",
        "meta": 1753,
        "atingido": 4414,
        "reembolso": 0,
        "superouMeta": 2661,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1599
      }
    ]
  },
  {
    "id": "inf-118",
    "nome": "Jo\u00e3o Vitor",
    "imagem": "/images/avatar/avatar-8.png",
    "instagram": "https://instagram.com/jo\u00e3ovitor",
    "dataCadastro": "2024-08-18",
    "cpf": "672.415.018-58",
    "status": "ativo",
    "relacoes": [
      {
        "plataformaId": "blaze",
        "meta": 4878,
        "atingido": 5031,
        "reembolso": 0,
        "superouMeta": 153,
        "statusMeta": "completo",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 1748
      }
    ]
  },
  {
    "id": "inf-119",
    "nome": "Isabela Moura",
    "imagem": "/images/avatar/avatar-9.png",
    "instagram": "https://instagram.com/isabelamoura",
    "dataCadastro": "2024-11-03",
    "cpf": "523.394.019-39",
    "status": "lead",
    "relacoes": [
      {
        "plataformaId": "betano",
        "meta": 5889,
        "atingido": 704,
        "reembolso": 5185,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2287
      },
      {
        "plataformaId": "blaze",
        "meta": 5210,
        "atingido": 1710,
        "reembolso": 3500,
        "superouMeta": 0,
        "statusMeta": "incompleto",
        "inicio": "2024-01-01",
        "termino": "2025-04-20",
        "salario": 2189
      }
    ]
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

