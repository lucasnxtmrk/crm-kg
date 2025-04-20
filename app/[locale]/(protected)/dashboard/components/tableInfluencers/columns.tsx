"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"

export type Influencer = {
  id: string;
  nome: string;
  plataforma: string;
  meta: number;
  salario: number;
  status: "Ativo" | "Inativo" | "Banido";
}

export const columns: ColumnDef<Influencer>[] = [
  {
    accessorKey: "nome",
    header: "Nome",
  },
  {
    accessorKey: "plataforma",
    header: "Plataforma",
  },
  {
    accessorKey: "meta",
    header: "Meta R$",
    cell: ({ row }) => {
      const value = row.getValue("meta") as number | undefined;
      return value !== undefined
        ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00";
    },
  },
  {
    accessorKey: "salario",
    header: "Salário R$",
    cell: ({ row }) => {
      const value = row.getValue("salario") as number | undefined;
      return value !== undefined
        ? `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00";
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;

      const colorMap = {
        Ativo: "green",
        Inativo: "yellow",
        Banido: "red",
      };

      const color = colorMap[status as keyof typeof colorMap] || "gray";

      return (
        <Badge className={`text-${color}-600 border-${color}-600`}>
          {status}
        </Badge>
      );
    },
  },
];
