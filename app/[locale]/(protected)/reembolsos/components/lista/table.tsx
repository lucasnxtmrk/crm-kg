'use client';

import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from '@tanstack/react-table';

import { getColumns, LinhaReembolso } from './columns';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import TablePagination from './table-pagination';
import { useState, useEffect } from 'react';
import InfluenciadorModal from '@/components/InfluenciadorModal'; // modal do influenciador
import { Influenciador } from '@/lib/types'; // Importa o tipo certo// <<< modal do influenciador

const ListReembolsos = () => {
  const [data, setData] = useState<LinhaReembolso[]>([]);
  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([]);
  
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const [modalAberto, setModalAberto] = useState(false);
  const [influenciadorSelecionado, setInfluenciadorSelecionado] = useState<Influenciador | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/influenciadores');
        const lista: Influenciador[] = await res.json();
        setInfluenciadores(lista);

        const linhas = lista.flatMap((inf) =>
          inf.cadastros_influenciadores?.flatMap((cadastro) =>
            cadastro.recargas
        .filter((rec) => rec.reembolso > 0)
        .map((rec) => ({
                recargaId: rec.id,
                nome: inf.nome,
                imagem: inf.imagem,
                instagram: inf.instagram,
                cpf: inf.cpf,
                plataforma: cadastro.plataforma_id,
                inicio: rec.inicio,
                termino: rec.termino,
                meta: Number(rec.meta),
                atingido: Number(rec.atingido),
                reembolso: Number(rec.reembolso),
                reembolsoStatus: rec.reembolso_status as "pendente" | "pago",
              }))
          ) || []
        );

        setData(linhas);
      } catch (error) {
        console.error('Erro ao buscar influenciadores:', error);
      }
    }

    fetchData();
  }, []);


  // Função de abrir o modal
  const handleView = (linha: LinhaReembolso) => {
    const influenciador = influenciadores.find((inf) => inf.nome === linha.nome);
    if (influenciador) {
      setInfluenciadorSelecionado(influenciador);
      setModalAberto(true);
    }
  };


  // Função de atualizar o status de reembolso
  const handleUpdateStatus = async (recargaId: string, newStatus: "pendente" | "pago") => {
    try {
      const response = await fetch(`/api/recargas/${recargaId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reembolso_status: newStatus }),
      });
  
      if (!response.ok) throw new Error('Erro ao atualizar o status do reembolso.');
  
      const updatedRecarga = await response.json();
      console.log('Status de reembolso atualizado com sucesso:', updatedRecarga);
  
      setData((prevData) => {
        const updated = prevData.map((linha) =>
          linha.recargaId === recargaId
            ? { ...linha, reembolsoStatus: newStatus }
            : linha
        );
  
        return updated.sort((a, b) => {
          if (a.reembolsoStatus !== b.reembolsoStatus) {
            return a.reembolsoStatus === 'pendente' ? -1 : 1;
          }
          return new Date(a.inicio).getTime() - new Date(b.inicio).getTime();
        });
      });
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar o status do reembolso. Tente novamente.');
    }
  };
  


  const columns = getColumns({ onUpdateStatus: handleUpdateStatus, onView: handleView });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
        <div className="flex-1 text-xl font-medium text-default-900">Reembolsos Pendentes</div>
        <div className="flex-none">
          <Input
            placeholder="Filtrar por nome..."
            value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('nome')?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
        </div>
      </div>

      <Table>
        <TableHeader className="bg-default-200">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                Nenhum reembolso pendente encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination table={table} />

      {/* Modal de visualização do influenciador */}
      <InfluenciadorModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        influenciador={influenciadorSelecionado}
      />
    </div>
  );
};

export default ListReembolsos;
