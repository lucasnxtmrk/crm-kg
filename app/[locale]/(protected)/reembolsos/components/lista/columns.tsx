import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, MoreVertical, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { color } from "framer-motion";

export type LinhaReembolso = {
  recargaId: string;
  nome: string;
  imagem?: string;
  instagram: string;
  cpf: string;
  plataforma: string;
  inicio: string;
  termino: string;
  meta: number;
  atingido: number;
  reembolso: number;
  reembolsoStatus: "pendente" | "pago";
};

type Props = {
  onUpdateStatus: (recargaId: string, newStatus: "pendente" | "pago") => void;
  onView: (recarga: LinhaReembolso) => void;
};

export const getColumns = ({ onUpdateStatus, onView }: Props): ColumnDef<LinhaReembolso>[] => [
  {
    accessorKey: "nome",
    header: "Influenciador",
    cell: ({ row }) => {
      const { nome, imagem } = row.original;
      return (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8">
            {imagem ? <AvatarImage src={imagem} /> : <AvatarFallback>INF</AvatarFallback>}
          </Avatar>
          <span>{nome}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "instagram",
    header: "Instagram",
    cell: ({ row }) => (
      <a
        href={`https://instagram.com/${row.original.instagram}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline text-sm"
      >
        {row.original.instagram}
      </a>
    ),
  },
  {
    accessorKey: "cpf",
    header: "CPF",
  },
  {
    accessorKey: "plataforma",
    header: "Plataforma",
  },
  {
    accessorKey: "meta",
    header: "Meta (R$)",
    cell: ({ row }) => (
      <span>R$ {row.original.meta.toLocaleString('pt-BR')}</span>
    ),
  },
  {
    accessorKey: "atingido",
    header: "Atingido (R$)",
    cell: ({ row }) => (
      <span>R$ {row.original.atingido.toLocaleString('pt-BR')}</span>
    ),
  },
  {
    accessorKey: "reembolso",
    header: "Reembolso (R$)",
    cell: ({ row }) => (
      <span className={row.original.reembolso > 0 ? "text-red-500" : "text-green-600"}>
        R$ {row.original.reembolso.toLocaleString('pt-BR')}
      </span>
    ),
  },
  {
    accessorKey: "reembolsoStatus",
    header: "Status",
    cell: ({ row }) => (
      <div>
        <span
          className={`px-2 py-1 text-xs rounded-full font-semibold ${
            row.original.reembolsoStatus === "pendente"
              ? "bg-yellow-400/20 text-yellow-600"
              : "bg-green-400/20 text-green-600"
          }`}
        >
          {row.original.reembolsoStatus === "pendente" ? "Pendente" : "Pago"}
        </span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button  variant="ghost" className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors">
            <span className="sr-only">Abrir menu</span>
            <MoreVertical className="h-4 w-4 text-gray-500" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem onClick={() => onView(row.original)}>
            👁 Ver Influenciador
          </DropdownMenuItem>
          {row.original.reembolsoStatus === "pendente" ? (
            <DropdownMenuItem onClick={() => onUpdateStatus(row.original.recargaId, "pago")}>
              ✅ Pago
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={() => onUpdateStatus(row.original.recargaId, "pendente")}>
              ❌ Pendente
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
