'use client';
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

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { getColumns, RecargaTabela } from './columns';
import { influenciadores } from '@/lib/influenciadores';
import TablePagination from './table-pagination';
import RecargasModal from "@/components/RecargasModal";
import React, { useState } from 'react';


function transformarParaRecargas(): RecargaTabela[] {
    return influenciadores.flatMap((inf) =>
      inf.recargas.map((recarga, index) => ({
        id: `${inf.id}-${index}`,
        nome: inf.nome,
        imagem: inf.imagem,
        plataformaId: recarga.plataformaId,
        inicio: recarga.inicio,
        termino: recarga.termino,
        valor: recarga.salario,
        meta: recarga.meta,
        atingido: recarga.atingido,
        statusMeta: recarga.statusMeta,
      }))
    );
  }

  export const RecargaTable = React.memo(function RecargaTable() {
    const data = React.useMemo(() => transformarParaRecargas(), []);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: getColumns(),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });
  const [modalOpen, setModalOpen] = useState(false);
  const handleSaveRecarga = (recarga: {
    influenciadorId: string;
    plataformaId: string;
    valor: number;
    inicio: Date;
    termino: Date;
  }) => {
    console.log("Recarga adicionada:", recarga);
    setModalOpen(false);
    // Aqui você pode salvar no backend ou atualizar o estado global
  };
  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
              <div className="flex-1 text-xl font-medium text-default-900">Histórico de Recargas</div>
              <div className="flex items-center space-x-3 ga-4"> 
                <Input
                  placeholder="Filtrar por nome..."
                  value={(table.getColumn('nome')?.getFilterValue() as string) ?? ''}
                  onChange={(event) =>
                    table.getColumn('nome')?.setFilterValue(event.target.value)
                  }
                  className="max-w-sm"
                />
                  <Button onClick={() => setModalOpen(true)}>Nova Recarga</Button>
              </div>
            </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
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
                <TableCell colSpan={10} className="h-24 text-center">
                  Nenhuma recarga encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination table={table} />
      <RecargasModal
              open={modalOpen}
              onClose={() => setModalOpen(false)}
              onSave={handleSaveRecarga}
              influenciadores={influenciadores}
            />
    </div>
  );
});
