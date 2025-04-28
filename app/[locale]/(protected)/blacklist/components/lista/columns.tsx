'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Eye, SquarePen, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Influenciador } from '@/lib/types';


type Props = {
  onView: (influenciador: Influenciador) => void;
};

export const getColumns = ({ onView }: Props): ColumnDef<Influenciador>[] => [

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
            {imagem ? <AvatarImage src={imagem} /> : <AvatarFallback>INF</AvatarFallback>}
          </Avatar>
          <span>{nome}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'instagram',
    header: 'Instagram',
    cell: ({ row }) => (
      <a
        href={row.original.instagram}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm"
      >
        {row.original.instagram.replace('https://instagram.com/', '')}
      </a>
    ),
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
      const cadastro = row.original.cadastros_influenciadores?.[0];
const recarga = cadastro?.recargas?.[0];
return <span>R$ {recarga?.meta?.toLocaleString('pt-BR') || '0'}</span>;
    },
  },
  {
    id: 'atingido',
    header: 'Atingido',
    cell: ({ row }) => {
      const cadastro = row.original.cadastros_influenciadores?.[0];
const recarga = cadastro?.recargas?.[0];
return <span>R$ {recarga?.meta?.toLocaleString('pt-BR') || '0'}</span>;
    },
  },
  {
    id: 'reembolso',
    header: 'Reembolso',
    cell: ({ row }) => {
      const cadastro = row.original.cadastros_influenciadores?.[0];
const recarga = cadastro?.recargas?.[0];
      const meta = recarga?.meta || 0;
      const atingido = recarga?.atingido || 0;
      const reembolso = meta > atingido ? meta - atingido : 0;
  
      const reembolsoClass =
        reembolso > 0 ? 'text-red-500 font-medium' : 'text-green-600 font-medium';
  
      return <span className={reembolsoClass}>R$ {reembolso.toLocaleString('pt-BR')}</span>;
    },
  },
  
  {
    id: 'statusMeta',
    header: () => (
      <div className="w-full text-center font-medium">Status da Meta</div>
    ),
    cell: ({ row }) => {
      const cadastro = row.original.cadastros_influenciadores?.[0];
const recarga = cadastro?.recargas?.[0];
      const meta = recarga?.meta || 0;
      const atingido = recarga?.atingido || 0;
  
      const statusLabel =
        meta === 0 && atingido === 0
          ? 'Meta indefinida'
          : atingido >= meta
          ? 'Meta batida'
          : 'Meta pendente';
  
      const statusClass =
        meta === 0 && atingido === 0
          ? 'bg-muted text-muted-foreground'
          : atingido >= meta
          ? 'bg-green-500 text-white'
          : 'bg-yellow-400 text-yellow-900';
  
      return (
        <div
          className={cn(
            'w-[140px] mx-auto flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium text-center whitespace-nowrap transition',
            statusClass
          )}
        >
          {statusLabel}
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
              <Button
                size="icon"
                variant="outline"
                onClick={() => onView(row.original)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Visualizar</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Apagando o botão "Editar" */}

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button size="icon" variant="outline">
                <Trash2 className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Excluir</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    ),
  },
];
