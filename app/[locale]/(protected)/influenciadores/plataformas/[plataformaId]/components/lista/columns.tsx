'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Influenciador } from '@/lib/types';

const hojeTimestamp = new Date().getTime();
function getRecargaResumo(
  recargas: Influenciador['cadastros_influenciadores'][number]['recargas']
) {
  if (!recargas || recargas.length === 0) {
    return { meta: 0, atingido: 0, tipo: "valor", status_meta: "indefinido" };
  }

  const hoje = new Date().getTime();
  const ativas = recargas.filter((r) => new Date(r.termino).getTime() >= hoje);

  const selecionadas = ativas.length > 0 ? ativas : recargas.slice(-1);

  const meta = selecionadas.reduce((acc, r) => acc + (r.tipo === "valor" ? (r.meta || 0) : (r.depositantes_meta || 0)), 0);
  const atingido = selecionadas.reduce((acc, r) => acc + (r.tipo === "valor" ? (r.atingido || 0) : (r.depositantes_atingido || 0)), 0);
  const tipo = selecionadas[0]?.tipo || "valor";
  const status_meta = selecionadas[0]?.status_meta || "indefinido";

  return { meta, atingido, tipo, status_meta };
}




type Props = {
  onView: (influenciador: Influenciador) => void;
  plataformaId: string;
};

export const getColumns = ({ onView, plataformaId }: Props): ColumnDef<Influenciador>[] => [
  {
    accessorKey: 'data_cadastro',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center gap-1"
      >
        Data de Cadastro{' '}
        {column.getIsSorted() === 'asc' ? '⬆️' : column.getIsSorted() === 'desc' ? '⬇️' : ''}
      </button>
    ),
    cell: ({ row }) => {
      const data = row.original.data_cadastro;
      if (!data) return <span className="text-muted-foreground">Sem data</span>;

      const dataFormatada = typeof data === 'string' ? new Date(data) : data;
      return (
        <span>
          {String(dataFormatada.getDate()).padStart(2, '0')}/
          {String(dataFormatada.getMonth() + 1).padStart(2, '0')}/
          {dataFormatada.getFullYear()}
        </span>
      );
    },
  },
  {
    accessorKey: 'nome',
    header: ({ column }) => (
      <button
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        className="flex items-center gap-1"
      >
        Nome {column.getIsSorted() === 'asc' ? '⬆️' : column.getIsSorted() === 'desc' ? '⬇️' : ''}
      </button>
    ),
    cell: ({ row }) => {
      const { nome, imagem } = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
  <AvatarImage src={imagem} />
  <AvatarFallback>{nome.charAt(0)}</AvatarFallback>
</Avatar>
          <span>{nome}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'instagram',
    header: 'Instagram',
    cell: ({ row }) => {
      const insta = row.original.instagram;
      const handle = insta?.replace(/^@/, '').replace(/^https?:\/\/(www\.)?instagram\.com\//, '') || '';
      const url = insta?.startsWith('http')
        ? insta
        : `https://instagram.com/${handle}`;

      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline text-sm"
        >
          @{handle}
        </a>
      );
    },
  },
  {
    accessorKey: 'cpf',
    header: 'CPF',
    cell: ({ row }) => <span>{row.original.cpf}</span>,
  },
  {
    id: 'meta',
    header: 'Meta',
    cell: ({ row }) => {
      const cadastro = row.original.cadastros_influenciadores?.find(c => c.plataforma_id === plataformaId);
      const recargas = cadastro?.recargas || [];
      console.log('Recargas desse cadastro:', recargas); // 👈 aqui também
      
      const { meta, tipo } = getRecargaResumo(recargas);
  
      if (recargas.length === 0) {
        return <span className="italic">Não definida</span>;
      }
  
      return tipo === "valor"
  ? `R$ ${Number(meta).toLocaleString('pt-BR')}`
  : `${meta} depositantes`;
    },
  },
  
  {
    id: 'atingido',
    header: 'Atingido',
    cell: ({ row }) => {
      const cadastro = row.original.cadastros_influenciadores?.find(c => c.plataforma_id === plataformaId);
      const recargas = cadastro?.recargas || [];
      const { atingido, tipo } = getRecargaResumo(recargas);
  
      if (recargas.length === 0) {
        return <span className="italic">Não definido</span>;
      }
  
      return tipo === "valor"
  ? `R$ ${Number(atingido).toLocaleString('pt-BR')}`
  : `${atingido} depositantes`;
    },
  },
  
  {
    id: 'reembolso',
    header: 'Reembolso',
    cell: ({ row }) => {
      const cadastro = row.original.cadastros_influenciadores?.find(c => c.plataforma_id === plataformaId);
      const recargas = cadastro?.recargas || [];
            const { meta, atingido } = getRecargaResumo(recargas);
      const reembolso = meta > atingido ? meta - atingido : 0;
      const reembolsoClass = reembolso > 0
        ? 'text-red-500 font-medium'
        : 'text-green-600 font-medium';
      return <span className={reembolsoClass}>R$ {reembolso.toLocaleString('pt-BR')}</span>;
    },
  },
  {
    id: 'statusMeta',
    header: () => <div className="w-full text-center font-medium">Status da Meta</div>,
    cell: ({ row }) => {
      const cadastro = row.original.cadastros_influenciadores?.find(c => c.plataforma_id === plataformaId);
const recargas = cadastro?.recargas || [];
      const { status_meta } = getRecargaResumo(recargas);
  
      let label = "Meta indefinida";
      let statusClass = "bg-muted text-muted-foreground";
  
      if (status_meta === "completo") {
        label = "Meta batida";
        statusClass = "bg-green-500 text-white";
      } else if (status_meta === "incompleto") {
        label = "Meta pendente";
        statusClass = "bg-yellow-400 text-yellow-900";
      }
  
      return (
        <div
          className={cn(
            "w-[140px] mx-auto flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium text-center whitespace-nowrap transition",
            statusClass
          )}
        >
          {label}
        </div>
      );
    },
  },
  
  {
    id: 'actions',
    header: 'Ações',
    cell: ({ row }) => (
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline" onClick={() => onView(row.original)}>
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
