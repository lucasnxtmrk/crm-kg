'use client';

import { cn } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, SquarePen, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import EditTask from "./edit-task";
import { useState } from "react";
import { Instagram } from 'lucide-react'; // adicione no topo, se ainda não tiver
import type { Influenciador } from '@/lib/influenciadores';


function TaskCard({ task }: { task: Influenciador }) {
  const [open, setOpen] = useState<boolean>(false);
  const [editTaskOpen, setEditTaskOpen] = useState<boolean>(false);

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

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const porcentagem = task.meta
    ? Math.round((task.atingido / task.meta) * 100)
    : 0;

  return (
    <>
      <DeleteConfirmationDialog open={open} onClose={() => setOpen(false)} />
      <EditTask open={editTaskOpen} setOpen={setEditTaskOpen} />

      <Card
        className={cn("shadow", {
          "opacity-20 bg-primary/20": isDragging,
        })}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >

<CardHeader className="flex-row items-center gap-3 pb-2">
  <Avatar className="h-10 w-10">
    <AvatarImage src={task.imagem} />
    <AvatarFallback>{task.nome.charAt(0)}</AvatarFallback>
  </Avatar>
  <div className="flex-1">
    <p className="font-semibold text-sm truncate">{task.nome}</p>
    <a
      href={task.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1 text-xs text-muted-foreground hover:underline"
    >
      <Instagram className="w-3 h-3 text-pink-600" />
      @{task.instagram.replace('https://instagram.com/', '')}
    </a>
  </div>

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        size="icon"
        className="bg-transparent hover:bg-transparent hover:ring-0 hover:ring-transparent w-6"
      >
        <MoreVertical className="h-4 w-4 text-default-900" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="p-0 overflow-hidden" align="end">
      <DropdownMenuItem
        className="py-2 border-b border-default-200 text-default-600 focus:bg-default focus:text-default-foreground rounded-none cursor-pointer"
        onClick={() => setEditTaskOpen(true)}
      >
        <SquarePen className="w-3.5 h-3.5 me-1" />
        Editar
      </DropdownMenuItem>
      <DropdownMenuItem
        className="py-2 bg-destructive/30 text-destructive focus:bg-destructive focus:text-destructive-foreground rounded-none cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Trash2 className="w-3.5 h-3.5 me-1" />
        Excluir
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</CardHeader>


        <CardContent className="text-xs text-muted-foreground space-y-1">
  <p>CPF: {task.cpf}</p>
  <p>
  Meta:{' '}
  {task.meta > 0
    ? `R$ ${task.meta.toLocaleString()}`
    : <span className="text-muted-foreground italic">Não definida</span>}
</p>

<p>
  Atingido:{' '}
  {task.atingido > 0
    ? `R$ ${task.atingido.toLocaleString()}`
    : <span className="text-muted-foreground italic">Não definido</span>}
</p>

<p>
  Reembolso:{' '}
  {(task.meta > 0 || task.atingido > 0)
    ? (
      <span className={task.reembolso > 0 ? 'text-red-600 font-semibold' : 'text-green-600'}>
        R$ {task.reembolso.toLocaleString()}
      </span>
    ) : (
      <span className="text-muted-foreground italic">Não definido</span>
    )}
</p>


<div
  className={cn(
    "inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium border whitespace-nowrap transition",
    task.meta === 0 && task.atingido === 0
      ? "bg-muted text-muted-foreground"
      : task.atingido >= task.meta
      ? "bg-green-500 text-white"
      : "bg-yellow-400 text-yellow-900"
  )}
>
  {task.meta === 0 && task.atingido === 0
    ? "Meta indefinida"
    : task.atingido >= task.meta
    ? "Meta Batida"
    : "Meta Pendente"}
</div>

</CardContent>

      </Card>
    </>
  );
}

export default TaskCard;
