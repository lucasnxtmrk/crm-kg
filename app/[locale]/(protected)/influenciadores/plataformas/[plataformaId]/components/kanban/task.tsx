'use client';

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { Instagram, MoreVertical, AlertCircle } from "lucide-react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import MotivoBanimentoDialog from '@/components/MotivoBanimentoDialog'; // importa


type InfluenciadorKanban = {
  id: string;
  nome: string;
  imagem?: string;
  instagram: string;
  cpf: string;
  meta: number;
  atingido: number;
  reembolso: number;
  status: string;
  tipo: "valor" | "depositantes";
  status_meta: "completo" | "incompleto" | "indefinido";
};

type Props = {
  task: InfluenciadorKanban;
  onClick?: () => void;
  onBanido?: () => void; // adiciona isso
};

function TaskCard({ task, onClick, onBanido }: Props) {
  const [open, setOpen] = useState(false);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
  });
  const [openMotivo, setOpenMotivo] = useState(false);
  async function handleBanir(motivo: string) {
    try {
      const response = await fetch(`/api/influenciadores/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "banido",
          motivo_banimento: motivo,
        }),
      });
  
      if (!response.ok) throw new Error("Erro ao banir influenciador.");
  
      console.log("Influenciador banido com sucesso!");
  
      // Aqui: chama o pai pra atualizar
      if (onBanido) {
        onBanido();
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handle = task.instagram
    .replace(/^@/, '')
    .replace(/^https?:\/\/(www\.)?instagram\.com\//, '');
    
  const instagramUrl = task.instagram.startsWith('http')
    ? task.instagram
    : `https://instagram.com/${handle}`;

  return (
    <>
      <DeleteConfirmationDialog open={open} onClose={() => setOpen(false)} />
      <MotivoBanimentoDialog
      open={openMotivo}
      onClose={() => setOpenMotivo(false)}
      onConfirm={handleBanir}
    />

      <Card
        ref={setNodeRef}
        style={style}
        onClick={onClick}
        {...attributes}
        {...listeners}
        className={cn("shadow cursor-pointer", {
          "opacity-20 bg-primary/20": isDragging,
        })}
      >
        <CardHeader className="flex-row items-center gap-3 pb-2">
          <Avatar className="h-10 w-10">
            <AvatarImage src={task.imagem} />
            <AvatarFallback>{task.nome.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-semibold text-sm truncate">{task.nome}</p>
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
            >
              <Instagram className="w-3 h-3 text-pink-600" />
              @{handle}
            </a>
          </div>

          <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="bg-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent w-6"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4 text-default-900" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-0 overflow-hidden" align="end">
        <DropdownMenuItem
          className="py-2 bg-destructive/30 text-destructive focus:bg-destructive focus:text-destructive-foreground rounded-none cursor-pointer"
          onClick={(e) => {
            e.stopPropagation(); // 🔥 impede que o Card abra
            setOpenMotivo(true);
          }}        >
          <AlertCircle className="w-3.5 h-3.5 me-1" />
          Banir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
        </CardHeader>

        <CardContent className="text-xs text-muted-foreground space-y-1">

          {/* Tipo de meta */}
          {/* <p className="font-bold">
            {" "}
            {task.tipo === "valor" ? " Meta por Recarga (R$)" : "Meta por Depositantes"}
          </p> */}

          {/* Meta */}
          <p>
          {task.meta ? (
  <p>
    <span className="font-medium">Meta: </span>
    {task.tipo === "valor"
      ? `R$ ${Number(task.meta).toLocaleString("pt-BR")}`
      : `${task.meta}`}
  </p>
) : (
  <p>
    <span className="font-medium">Meta: </span>
    <span className="italic">Não definida</span>
  </p>
)}


</p>



          {/* Atingido */}
          <p>
          {task.atingido ? (
  <p>
    <span className="font-medium">Atingido: </span>
    {task.tipo === "valor"
      ? `R$ ${Number(task.atingido).toLocaleString("pt-BR")}`
      : `${task.atingido}`}
  </p>
) : (
  <p>
    <span className="font-medium">Atingido: </span>
    <span className="italic">Não definido</span>
  </p>
)}

</p>



          {/* Reembolso */}
          <p>
          {task.reembolso !== undefined ? (
  <p>
    <span className="font-medium">Reembolso: </span>
    <span className={task.reembolso > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
      {`R$ ${Number(task.reembolso).toLocaleString('pt-BR')}`}
    </span>
  </p>
) : (
  <p>
    <span className="font-medium">Reembolso: </span>
    <span className="italic">Não definido</span>
  </p>
)}

</p>



          {/* Status meta */}
          <div
            className={cn(
              "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition",
              task.status_meta === "indefinido"
                ? "bg-muted text-muted-foreground"
                : task.status_meta === "completo"
                ? "bg-green-500 text-white"
                : "bg-yellow-400 text-yellow-900"
            )}
          >
            {task.status_meta === "indefinido"
              ? "Meta indefinida"
              : task.status_meta === "completo"
              ? "Meta Batida"
              : "Meta Pendente"}
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default TaskCard;
