export type InfluenciadorLista = {
    id: string;
    nome: string;
    imagem?: string;
    instagram: string;
    cpf: string;
    meta: number;
    atingido: number;
    statusMeta: 'completo' | 'incompleto';
  };
  