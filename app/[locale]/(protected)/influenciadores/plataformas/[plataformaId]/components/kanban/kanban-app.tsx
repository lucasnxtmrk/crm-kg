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
import InfluenciadorModal from '@/components/InfluenciadorModal';
import { statusKanbanList, Recarga } from '@/lib/types';
import { Influenciador } from '@/lib/types';
import { useInfluenciadores } from '@/hooks/useInfluenciadores';

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
  tipo: "valor" | "depositantes";
  status_meta: "completo" | "incompleto" | "indefinido";
};

const KanBanApp = () => {
  const t = useTranslations("KanbanApp");
  const params = useParams();
  const { plataformaId } = useParams() as { plataformaId: string };

  const { influenciadores, loading, refetch } = useInfluenciadores();

  const [columns, setColumns] = useState(
    statusKanbanList
      .filter((status) => !status.ocultoNoKanban)
      .map((status) => ({ id: status.id, title: status.title }))
  );

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const influenciadoresKanban = useMemo(() => {
    return influenciadores.filter((inf) =>
      inf.cadastros_influenciadores?.some((cad) => cad.plataforma_id === plataformaId)
    );
  }, [influenciadores, plataformaId]);

  const tasks = useMemo(() => {
    return influenciadoresKanban.map((inf) => {
      const hoje = new Date();
      const recsDaPlataforma = inf.cadastros_influenciadores
        ?.filter((c) => c.plataforma_id === plataformaId)
        .flatMap((cad) => cad.recargas) || [];
  
      const ativas = recsDaPlataforma.filter((r) => new Date(r.termino) >= hoje);
      const dados = ativas.length > 0 ? ativas : recsDaPlataforma.slice(-1);
  
      const ultimaRecarga = dados.length > 0 ? dados[dados.length - 1] : undefined;
  
      const metaTotal = dados.reduce((acc, r) => acc + (r.tipo === "valor" ? Number(r.meta) : r.depositantes_meta || 0), 0);
      const atingidoTotal = dados.reduce((acc, r) => acc + (r.tipo === "valor" ? Number(r.atingido) : r.depositantes_atingido || 0), 0);
  
      const reembolsoTotal = recsDaPlataforma
        .filter(r => 
          new Date(r.termino) >= hoje && 
          r.reembolso_status === "pendente"
        )
        .reduce((acc, r) => acc + Number(r.reembolso || 0), 0);
  
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
        tipo: ultimaRecarga?.tipo || "valor",
        status_meta: ["completo", "incompleto", "indefinido"].includes(ultimaRecarga?.status_meta || "")
        ? (ultimaRecarga?.status_meta as "completo" | "incompleto" | "indefinido")
        : "indefinido",      };
    });
  }, [influenciadoresKanban, plataformaId]);
  
  

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
    // Não precisa fazer nada por enquanto
  }

  return (
    <>
      <div className="pb-4 pr-4 pl-4">
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
                  plataformaId={plataformaId}
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
                plataformaId={plataformaId}
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
        onUpdate={async (updated) => {
          await refetch(); // 🔥 Atualiza os influenciadores
          const atualizado = influenciadores.find((i) => i.id === updated.id);
          if (atualizado) {
            setInfluenciadorSelecionado(atualizado);
          }
        }}
      />
    </>
  );
};

export default KanBanApp;
