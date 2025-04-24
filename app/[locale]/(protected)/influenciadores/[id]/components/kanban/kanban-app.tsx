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
import { useTranslations } from 'next-intl';
import { influenciadores, statusKanbanList } from '@/lib/influenciadores';
import InfluenciadorModal from '@/components/InfluenciadorModal';

// Tipos
import type { Influenciador } from '@/lib/influenciadores';

type Column = {
  id: string;
  title: string;
};

type InfluenciadorKanban = {
  id: string;
  nome: string;
  imagem?: string;
  instagram: string;
  cpf: string;
  meta: number;
  atingido: number;
  status: string;
  reembolso: number;
};

const KanBanApp = () => {
  const t = useTranslations("KanbanApp");
  const params = useParams();
  const plataformaId = params?.id as string;

  // 🔹 Dados filtrados só da plataforma para exibir no Kanban
  const influenciadoresKanban = useMemo(
    () => influenciadores.filter((inf) =>
      inf.recargas.some((rec) => rec.plataformaId === plataformaId)
    ),
    [plataformaId]
  );

  const [columns, setColumns] = useState(
    statusKanbanList
      .filter((status) => !status.ocultoNoKanban)
      .map((status) => ({ id: status.id, title: status.title }))
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<InfluenciadorKanban[]>(
    transformarParaKanban(influenciadoresKanban, plataformaId)
  );

  function transformarParaKanban(influenciadores: Influenciador[], plataformaId: string) {
    return influenciadores.map((inf) => {
      const hoje = new Date();
      const recsDaPlataforma = inf.recargas.filter((r) => r.plataformaId === plataformaId);
      const ativas = recsDaPlataforma.filter((r) => new Date(r.termino) >= hoje);

      const dados = ativas.length > 0 ? ativas : recsDaPlataforma.slice(-1);

      const metaTotal = dados.reduce((acc, r) => acc + r.meta, 0);
      const atingidoTotal = dados.reduce((acc, r) => acc + r.atingido, 0);
      const reembolsoTotal = dados.reduce((acc, r) => acc + (r.meta > r.atingido ? r.meta - r.atingido : 0), 0);

      return {
        id: inf.id,
        nome: inf.nome,
        imagem: inf.imagem,
        instagram: inf.instagram,
        cpf: inf.cpf,
        status: inf.status,
        meta: metaTotal,
        atingido: atingidoTotal,
        reembolso: reembolsoTotal,
      };
    });
  }

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<InfluenciadorKanban | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [influenciadorSelecionado, setInfluenciadorSelecionado] = useState<Influenciador | null>(null);

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
            ? {
                ...task,
                status: isOverATask && over.data.current
                  ? over.data.current.task.status
                  : overId,
              }
            : task
        )
      );
    }
  }

  return (
    <>
      <div className="">
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
                  onTaskClick={(inf) => {
                    const completo = influenciadores.find((i) => i.id === inf.id);
                    if (completo) {
                      setInfluenciadorSelecionado(completo);
                      setModalOpen(true);
                    }
                  }}
                />
              ))}
            </SortableContext>
          </div>

          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  tasks={tasks.filter((task) => task.status === activeColumn.id)}
                  onTaskClick={() => {}}
                />
              )}
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>,
            document.body
          )}
        </DndContext>
      </div>

      <InfluenciadorModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        influenciador={influenciadorSelecionado}
        onUpdate={(atualizado) => {
          const atualizadoKanban = transformarParaKanban([atualizado], plataformaId)[0];
          setTasks((prev) =>
            prev.map((i) => (i.id === atualizado.id ? atualizadoKanban : i))
          );
        }}
      />
    </>
  );
};
export default KanBanApp;
