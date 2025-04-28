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

import { getColumns } from './columns'; // ❗ Ajusta se seu `getColumns` está correto
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
import InfluenciadorModal from '@/components/InfluenciadorModal';
import { Influenciador } from '@/lib/types'; // tipo certo

const ListaBlacklist = () => {
  const [data, setData] = useState<Influenciador[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  
  const [modalAberto, setModalAberto] = useState(false);
  const [influenciadorSelecionado, setInfluenciadorSelecionado] = useState<Influenciador | null>(null);

  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([]);

  // ⬇️ Buscar da API
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/influenciadores');
        const lista: Influenciador[] = await res.json();
        
        // Filtra apenas banidos
        const banidos = lista.filter(i => i.status === 'banido');
        setData(banidos);

      } catch (error) {
        console.error('Erro ao buscar influenciadores:', error);
      }
    }

    fetchData();
  }, []);

  const handleView = (inf: Influenciador) => {
    setInfluenciadorSelecionado(inf);
    setModalAberto(true);
  };

  const columns = getColumns({ onView: handleView }); // Aqui o seu getColumns precisa esperar onView

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
        <div className="flex-1 text-xl font-medium text-default-900">Lista Negra</div>
        <div className="flex-none">
          <Input
            placeholder="Filtrar por nome..."
            value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn('nome')?.setFilterValue(event.target.value)}
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
                Nenhum influenciador banido encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination table={table} />

      {/* Modal para visualizar o influenciador */}
      <InfluenciadorModal
  open={modalAberto}
  onClose={() => setModalAberto(false)}
  influenciador={influenciadorSelecionado}
  onUpdate={(updated) => {
    setInfluenciadores((prev) =>
      prev.map((inf: Influenciador) => (inf.id === updated.id ? updated : inf))
    );
    setInfluenciadorSelecionado(updated); // também atualiza o modal
  }}
/>
    </div>
  );
};

export default ListaBlacklist;
