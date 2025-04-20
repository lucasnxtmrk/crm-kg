'use client';

import React, { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import ColumnContainer from './column';
import TaskCard from './task';
import { createPortal } from 'react-dom';
import AddBoard from './add-board';
import CreateTask from './create-task';
import { useTranslations } from 'next-intl';
import { getInfluenciadoresBySlug, statusKanbanList } from '@/lib/influenciadores';

// ❌ REMOVA ISSO:
// type InfluenciadorKanban = { ... }

// ✅ USE ISSO:
import type { Influenciador } from '@/lib/influenciadores';

type Column = {
  id: string;
  title: string;
};
const KanBanApp = () => {
  const t = useTranslations("KanbanApp");
  const params = useParams();
  const plataformaId = params?.id as string;

  const [columns, setColumns] = useState(
    statusKanbanList
      .filter((status) => !status.ocultoNoKanban)
      .map((status) => ({
        id: status.id,
        title: status.title,
      }))
  );
  
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // ✅ Usando tipo completo: Influenciador
  const [tasks, setTasks] = useState<Influenciador[]>(
    getInfluenciadoresBySlug(plataformaId)
  );

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Influenciador | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function onDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveAColumn = active.data.current?.type === 'Column';
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
      const overColumnIndex = columns.findIndex((col) => col.id === overId);
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';
    const isOverAColumn = over.data.current?.type === 'Column';

    if (!isActiveATask) return;

    if (isOverATask || isOverAColumn) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === activeId
            ? { ...task, status: isOverATask && over.data.current ? over.data.current.task.status : overId }
            : task        )
      );
    }
  }

  return (
    <>
      <div className="">
        <div className="flex gap-2 mb-5">
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            <SortableContext items={columnsId}>
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  tasks={tasks.filter((task) => task.status === col.id)}
                  handleOpenTask={() => setOpen(true)}
                />
              ))}
            </SortableContext>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  handleOpenTask={() => setOpen(true)}
                  tasks={tasks.filter((task) => task.status === activeColumn.id)}
                />
              )}
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>
      <CreateTask open={open} setOpen={setOpen} />
    </>
  );
};

export default KanBanApp;
