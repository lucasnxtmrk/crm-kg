export type size = "sm" | "default" | "md" | "lg" | "xl" | "full";

// Representa os status usados no Kanban
export type StatusKanban = {
  id: string;
  title: string;
  ocultoNoKanban?: boolean;
};

export const statusKanbanList: StatusKanban[] = [
  { id: 'bronze', title: 'Bronze' },
  { id: 'prata', title: 'Prata' },
  { id: 'ouro', title: 'Ouro' },
  { id: 'diamante', title: 'Diamante' },
  { id: 'banido', title: 'Banido', ocultoNoKanban: true },
];

// Relação entre influenciador e plataforma
export type CadastroInfluenciadorPlataforma = {
  id: string;
  influenciador_id: string;
  plataforma_id: string;
  influenciador_plataforma_id: string;
  recargas: Recarga[]; // 🔥 Cada cadastro pode ter várias recargas!
};

export interface Plataforma {
  id: string;
  nome: string;
  imagem?: string;
  cor: string;
}

// Uma recarga associada a um cadastro
export type Recarga = {
  id: string;
  cadastro_id: string;
  inicio: string; // Date no banco, mas aqui string ISO
  termino: string;
  salario: number;
  meta: number;
  atingido: number;
  reembolso: number;
  depositantes_meta: number;
  depositantes_atingido: number;
  tipo: 'valor' | 'depositantes';
  status_meta: 'completo' | 'incompleto';
  reembolso_status: 'pendente' | 'pago';
};
export interface SalarioMensal {
  ano: number;
  mes: number; // 1 = jan, 12 = dez
  valor: number;
}
// Influenciador principal
export type Influenciador = {
  recargas: any;
  id: string;
  nome: string;
  imagem?: string;
  instagram: string;
  email?: string;
  telefone?: string;
  data_cadastro: string; // Mudança aqui: campo é data_cadastro (não camelCase)
  cpf: string;
  chavepix?: string;
  status: 'bronze' | 'prata' | 'ouro' | 'diamante' | 'banido';
  motivo_banimento?: string;
  contratado?: boolean; 
  salario_fixo?: boolean;
  salarios_mensais?: SalarioMensal[];
  cadastros_influenciadores: CadastroInfluenciadorPlataforma[];
};

// Para usar no Kanban (dados resumidos)
export type InfluenciadorKanban = {
  id: string;
  nome: string;
  imagem?: string;
  instagram: string;
  cpf: string;
  meta: number;
  atingido: number;
  status: string;
  reembolso: number;
};

// Para usar em Listagem de recargas gerais
export type RecargaComInfluenciador = {
  recargaId: string;
  influenciadorId: string;
  nome: string;
  imagem?: string;
  instagram: string;
  cpf: string;
  plataforma: string;
  meta: number;
  atingido: number;
  reembolso: number;
  reembolsoStatus: 'pendente' | 'pago';
};

// Função utilitária para obter influenciadores de uma plataforma
export function getInfluenciadoresBySlug(
  slug: string,
  influenciadores: Influenciador[]
): Influenciador[] {
  return influenciadores
    .filter((inf) => inf.status !== 'banido')
    .filter((inf) =>
      inf.cadastros_influenciadores.some((c) => c.plataforma_id === slug)
    )
    .map((inf) => {
      // Aqui, filtrar as recargas do cadastro relacionado à plataforma
      const cadastrosFiltrados = inf.cadastros_influenciadores.map((cadastro) => ({
        ...cadastro,
        recargas: cadastro.recargas.filter((recarga) => cadastro.plataforma_id === slug)
      }));

      return { ...inf, cadastros_influenciadores: cadastrosFiltrados };
    });
}

// Data de hoje para filtros
export const hoje = new Date().toISOString().split('T')[0];

// export const influenciadores: Influenciador[] = [
//   {
//     id: "inf-200",
//     nome: "Luana Ferreira",
//     imagem: "/images/avatar/avatar-0.png",
//     email: "luana.ferreira@example.com",
//     telefone: "(83) 98887-6543",
//     chavepix: "+55 11 99876-5432",
//     instagram: "luana_ferreira",
//     dataCadastro: "2025-01-15",
//     cpf: "158.963.741-00",
//     status: "ativo",
//     motivo_banimento: undefined,
//     cadastros: [
//       { id: "cad-inf-200-1", influenciadorId: "inf-200", plataformaId: "genio777", influenciadorPlataformaId: "LUFER01" },
//       { id: "cad-inf-200-2", influenciadorId: "inf-200", plataformaId: "sergipeboi", influenciadorPlataformaId: "LUFER_SG" },
//     ],
//     recargas: [
//       {
//         id: "inf-200-rec1",
//         cadastroId: "cad-inf-200-1",
//         inicio: "2025-02-01",
//         termino: "2025-02-28",
//         salario: 2500,
//         meta: 3000,
//         atingido: 2800,
//         reembolso: 200,
//         depositantesMeta: 20,
//         depositantesAtingido: 18,
//         tipo: "valor",
//         statusMeta: "incompleto",
//         reembolsoStatus: "pendente"
//       },
//       {
//         id: "inf-200-rec2",
//         cadastroId: "cad-inf-200-2",
//         inicio: "2025-03-01",
//         termino: "2025-03-31",
//         salario: 2700,
//         meta: 3200,
//         atingido: 3500,
//         reembolso: 0,
//         depositantesMeta: 25,
//         depositantesAtingido: 30,
//         tipo: "depositantes",
//         statusMeta: "completo",
//         reembolsoStatus: "pendente"
//       },
//     ],
//   },
//   {
//     id: "inf-201",
//     nome: "Caio Mendes",
//     imagem: "/images/avatar/avatar-1.png",
//     email: "caio.mendes@contato.com",
//     telefone: "(83) 98765-4321",
//     chavepix: "237.481.965-11",
//     instagram: "caio.mendes",
//     dataCadastro: "2025-02-10",
//     cpf: "237.481.965-11",
//     status: "negociacao",
//     motivo_banimento: undefined,
//     cadastros: [
//       { id: "cad-inf-201-1", influenciadorId: "inf-201", plataformaId: "pgcoelho", influenciadorPlataformaId: "CAIMEN_PG" },
//       { id: "cad-inf-201-2", influenciadorId: "inf-201", plataformaId: "piupiu", influenciadorPlataformaId: "CAIMEN_PP" },
//     ],
//     recargas: [
//       {
//         id: "inf-201-rec1",
//         cadastroId: "cad-inf-201-1",
//         inicio: "2025-02-15",
//         termino: "2025-03-15",
//         salario: 2600,
//         meta: 3000,
//         atingido: 3000,
//         reembolso: 0,
//         depositantesMeta: 15,
//         depositantesAtingido: 15,
//         tipo: "valor",
//         statusMeta: "completo",
//         reembolsoStatus: "pendente"
//       },
//       {
//         id: "inf-201-rec2",
//         cadastroId: "cad-inf-201-2",
//         inicio: "2025-03-16",
//         termino: "2025-04-15",
//         salario: 2800,
//         meta: 3200,
//         atingido: 3100,
//         reembolso: 100,
//         depositantesMeta: 18,
//         depositantesAtingido: 17,
//         tipo: "depositantes",
//         statusMeta: "incompleto",
//         reembolsoStatus: "pendente"
//       },
//     ],
//   },
//   {
//     id: "inf-202",
//     nome: "Eduarda Pires",
//     imagem: "/images/avatar/avatar-2.png",
//     email: "eduarda.pires@mail.com",
//     telefone: "(83) 99654-3210",
//     chavepix: "eduarda.pires@pix.com",
//     instagram: "eduarda.pires",
//     dataCadastro: "2025-01-20",
//     cpf: "478.293.159-88",
//     status: "contato",
//     motivo_banimento: undefined,
//     cadastros: [
//       { id: "cad-inf-202-1", influenciadorId: "inf-202", plataformaId: "piupiu", influenciadorPlataformaId: "EDUPIR_PP" },
//     ],
//     recargas: [
//       {
//         id: "inf-202-rec1",
//         cadastroId: "cad-inf-202-1",
//         inicio: "2025-02-01",
//         termino: "2025-02-28",
//         salario: 2950,
//         meta: 3100,
//         atingido: 3050,
//         reembolso: 50,
//         depositantesMeta: 12,
//         depositantesAtingido: 11,
//         tipo: "valor",
//         statusMeta: "incompleto",
//         reembolsoStatus: "pendente"
//       },
//       {
//         id: "inf-202-rec2",
//         cadastroId: "cad-inf-202-1",
//         inicio: "2025-03-01",
//         termino: "2025-03-31",
//         salario: 3300,
//         meta: 3500,
//         atingido: 3700,
//         reembolso: 0,
//         depositantesMeta: 20,
//         depositantesAtingido: 22,
//         tipo: "depositantes",
//         statusMeta: "completo",
//         reembolsoStatus: "pendente"
//       },
//     ],
//   },
//   {
//     id: "inf-203",
//     nome: "Thiago Santana",
//     imagem: "/images/avatar/avatar-3.png",
//     email: "thiago.santana@service.org",
//     telefone: "(83) 98543-2109",
//     chavepix: "81965432177",
//     instagram: "thiago.santana",
//     dataCadastro: "2024-12-05",
//     cpf: "819.654.321-77",
//     status: "lead",
//     motivo_banimento: undefined,
//     cadastros: [
//       { id: "cad-inf-203-1", influenciadorId: "inf-203", plataformaId: "sergipeboi", influenciadorPlataformaId: "THISAN_SG" },
//       { id: "cad-inf-203-2", influenciadorId: "inf-203", plataformaId: "genio777", influenciadorPlataformaId: "THISAN_G7" },
//     ],
//     recargas: [
//       {
//         id: "inf-203-rec1",
//         cadastroId: "cad-inf-203-1",
//         inicio: "2025-01-10",
//         termino: "2025-02-10",
//         salario: 2800,
//         meta: 3000,
//         atingido: 2900,
//         reembolso: 100,
//         depositantesMeta: 10,
//         depositantesAtingido: 9,
//         tipo: "valor",
//         statusMeta: "incompleto",
//         reembolsoStatus: "pendente"
//       },
//       {
//         id: "inf-203-rec2",
//         cadastroId: "cad-inf-203-2",
//         inicio: "2025-02-11",
//         termino: "2025-03-11",
//         salario: 3000,
//         meta: 3200,
//         atingido: 3300,
//         reembolso: 0,
//         depositantesMeta: 14,
//         depositantesAtingido: 16,
//         tipo: "depositantes",
//         statusMeta: "completo",
//         reembolsoStatus: "pendente"
//       },
//     ],
//   },
//   {
//     id: "inf-204",
//     nome: "Natalia Costa",
//     imagem: "/images/avatar/avatar-4.png",
//     email: "natalia.costa@yahoo.com",
//     telefone: "(83) 99432-1098",
//     chavepix: "+55 11 98765-4321",
//     instagram: "natalia.costa",
//     dataCadastro: "2025-03-01",
//     cpf: "284.136.479-55",
//     status: "ativo",
//     motivo_banimento: undefined,
//     cadastros: [
//       { id: "cad-inf-204-1", influenciadorId: "inf-204", plataformaId: "piupiu", influenciadorPlataformaId: "NATCOS_PP" },
//       { id: "cad-inf-204-2", influenciadorId: "inf-204", plataformaId: "genio777", influenciadorPlataformaId: "NATCOS_G7" },
//     ],
//     recargas: [
//       {
//         id: "inf-204-rec1",
//         cadastroId: "cad-inf-204-1",
//         inicio: "2025-03-10",
//         termino: "2025-04-10",
//         salario: 3100,
//         meta: 3300,
//         atingido: 3900,
//         reembolso: 0,
//         depositantesMeta: 18,
//         depositantesAtingido: 22,
//         tipo: "valor",
//         statusMeta: "completo",
//         reembolsoStatus: "pendente"
//       },
//       {
//         id: "inf-204-rec2",
//         cadastroId: "cad-inf-204-2",
//         inicio: "2025-03-15",
//         termino: "2025-04-15",
//         salario: 3200,
//         meta: 3500,
//         atingido: 3300,
//         reembolso: 100,
//         depositantesMeta: 20,
//         depositantesAtingido: 19,
//         tipo: "depositantes",
//         statusMeta: "incompleto",
//         reembolsoStatus: "pendente"
//       },
//     ],
//   },
// ];

