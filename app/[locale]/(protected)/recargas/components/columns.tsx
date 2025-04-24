'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export type RecargaTabela = {
  id: string;
  nome: string;
  imagem?: string;
  plataformaId: string;
  inicio?: string;
  termino?: string;
  valor: number;
  meta: number;
  atingido: number;
  statusMeta: 'completo' | 'incompleto';
};

export const getColumns = (onView?: (id: string) => void): ColumnDef<RecargaTabela>[] => [
  {
    accessorKey: 'nome',
    header: 'Influenciador',
    cell: ({ row }) => {
      const { nome, imagem } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={imagem} />
            <AvatarFallback>{nome[0]}</AvatarFallback>
          </Avatar>
          <span>{nome}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'plataformaId',
    header: 'Plataforma',
    cell: ({ row }) => <span className="capitalize">{row.original.plataformaId}</span>,
  },
  {
    accessorKey: 'inicio',
    header: 'Início',
    cell: ({ row }) => {
      const data = row.original.inicio;
      if (!data) return '-';
      const [ano, mes, dia] = data.split('-');
      return <span>{`${dia}/${mes}/${ano}`}</span>;
    },
  },
  {
    accessorKey: 'termino',
    header: 'Término',
    cell: ({ row }) => {
      const data = row.original.termino;
      if (!data) return '-';
      const [ano, mes, dia] = data.split('-');
      return <span>{`${dia}/${mes}/${ano}`}</span>;
    },
  },
  {
    accessorKey: 'valor',
    header: 'Valor (R$)',
    cell: ({ row }) => `R$ ${Number(row.original.valor)}`,
  },
  {
    accessorKey: 'meta',
    header: 'Meta',
    cell: ({ row }) => `R$ ${Number(row.original.meta)}`,
  },
  {
    accessorKey: 'atingido',
    header: 'Atingido',
    cell: ({ row }) => `R$ ${Number(row.original.atingido)}`,
  },
  {
    accessorKey: 'statusMeta',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.statusMeta;
      return (
        <Badge className={status === 'completo' ? 'bg-green-500' : 'bg-red-500'}>
          {status === 'completo' ? 'Meta batida' : 'Não bateu'}
        </Badge>
      );
    },
  }
];
