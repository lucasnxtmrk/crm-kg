'use client';

import { useState, useMemo } from "react";
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import EmptyTask from "./empty";
import TaskCard from "./task";
import NewInfluenciadorModal from '@/components/NewInfluenciadorModal';
import { Plus } from "lucide-react";
import type { InfluenciadorKanban } from './task'


type Column = {
  id: string;
  title: string;
};

type Props = {
  column: Column;
  tasks: InfluenciadorKanban[];
  onTaskClick: (task: InfluenciadorKanban) => void;
};

function ColumnContainer({ column, tasks, onTaskClick }: Props) {
  const [editMode, setEditMode] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasksIds = useMemo(() => tasks.map((task) => task.id), [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <DeleteConfirmationDialog
        open={deleteColumn}
        onClose={() => setDeleteColumn(false)}
      />

      <Card
        ref={setNodeRef}
        style={style}
        className={cn(
          "flex-1 w-[280px] bg-default-200 shadow-none app-height flex flex-col relative",
          {
            "opacity-20": isDragging,
          }
        )}
      >
        <CardHeader
          className="flex-none bg-card relative rounded-t-md py-4"
          {...attributes}
          {...listeners}
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 text-lg capitalize text-default-900 font-medium">
              {column.title}
            </div>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    className="w-6 h-6 bg-transparent ring-offset-transparent hover:bg-transparent border border-default-200 text-default-600 hover:ring-0 hover:ring-transparent"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Adicionar Influenciador</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className="flex-1 pt-6 px-3.5 h-full overflow-y-auto no-scrollbar">
          <div className="space-y-6">
            {tasks.length === 0 && <EmptyTask />}
            <SortableContext items={tasksIds}>
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={() => onTaskClick(task)} />
              ))}
            </SortableContext>
          </div>
        </CardContent>
      </Card>
      <NewInfluenciadorModal
  open={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  plataformaId={'o-id-ou-slug-dessa-plataforma'}
/>
    </>
  );
}

export default ColumnContainer;
