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

import { getColumns } from './columns';
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
import { Influenciador } from '@/lib/types'; // Apenas o tipo agora
import { useMemo, useState, useEffect } from 'react';
import InfluenciadorModal from '@/components/InfluenciadorModal';
import NewInfluenciadorModal from '@/components/NewInfluenciadorModal';
import { Button } from '@/components/ui/button';

interface Props {
  plataformaSlug: string;
}

const ListaInfluenciadores = ({ plataformaSlug }: Props) => {
  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([]);

  // Novo: carregar da API real
  const fetchInfluenciadores = async () => {
    try {
      const resposta = await fetch('/api/influenciadores');
      const dados = await resposta.json();
      setInfluenciadores(dados);
    } catch (error) {
      console.error('Erro ao buscar influenciadores:', error);
    }
  };
  useEffect(() => {
    fetchInfluenciadores();
  }, []);

  const data = useMemo(() => {
    return influenciadores
      .filter((inf) => inf.status !== "banido") // 🔥 EXCLUI os banidos
      .filter((inf) =>
        inf.cadastros_influenciadores?.some(
          (cadastro) => cadastro.plataforma_id === plataformaSlug
        )
      );
  }, [influenciadores, plataformaSlug]);

  // table state
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  // "view details" modal
  const [modalAberto, setModalAberto] = useState(false);
  const [influenciadorSelecionado, setInfluenciadorSelecionado] = useState<Influenciador | null>(null);

  const handleView = (inf: Influenciador) => {
    setInfluenciadorSelecionado(inf);
    setModalAberto(true);
  };

  const columns = getColumns({
    onView: handleView,
    plataformaId: plataformaSlug, // ou a variável que contém a plataforma clicada
  });
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // "add new influencer" modal
  const [novoOpen, setNovoOpen] = useState(false);
  const handleSaveInfluenciador = (data: {
    nome: string;
    instagram: string;
    email: string;
    telefone: string;
    cpf: string;
    chavePix: string;
    plataformas: string[];
    status: string;
    foto?: string;
  }) => {
    console.log("Novo influenciador:", data);
    setNovoOpen(false);
  };

  return (
    <div className="w-full">
      <div className="flex items-center py-4 px-5">
        <div className="flex-1 text-xl font-medium text-default-900">
          Influenciadores
        </div>
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Filtrar por nome..."
            value={
              (table.getColumn('nome')?.getFilterValue() as string) ?? ''
            }
            onChange={(e) =>
              table.getColumn('nome')?.setFilterValue(e.target.value)
            }
            className="max-w-sm"
          />
          <Button className='bg-primary' onClick={() => setNovoOpen(true)}>
            Adicionar Influenciador
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader className="bg-default-200">
          {table.getHeaderGroups().map((hg) => (
            <TableRow key={hg.id}>
              {hg.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>

        <TableBody>
          {table.getRowModel().rows.length > 0 ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                Nenhum resultado encontrado.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination table={table} />

      {/* detalhes */}
      <InfluenciadorModal
  open={modalAberto}
  onClose={() => setModalAberto(false)}
  influenciador={influenciadorSelecionado}
  onUpdate={async () => {
    await fetchInfluenciadores(); // 🔥 Atualiza a lista inteira!
  }}
/>

      {/* novo influencer */}
      <NewInfluenciadorModal
        open={novoOpen}
        onClose={() => {
          setNovoOpen(false);
          fetchInfluenciadores();      // recarrega após fechar
        }}
        plataformaId={plataformaSlug}  // ⬅️ passe o slug/ID da plataforma
      />
    </div>
  );
};

export default ListaInfluenciadores;
