'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import ListaInfluenciadores from './components/lista/table';
import KanbanWrapper from './components/kanban';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from '@/components/ui/card';
import Image from "next/image";

interface Plataforma {
  id: string;
  nome: string;
  imagem?: string;
  cor: string;
}

export default function PaginaPlataforma() {
  const params = useParams();
  const { plataformaId } = useParams() as { plataformaId: string };
  const [plataformaAtual, setPlataformaAtual] = useState<Plataforma | null>(null);

useEffect(() => {
  const fetchPlataforma = async () => {
    try {
      const res = await fetch('/api/plataformas');
      const plataformas: Plataforma[] = await res.json();
      const plataforma = plataformas.find(p => p.id === plataformaId);
      setPlataformaAtual(plataforma || null);
    } catch (error) {
      console.error('Erro ao buscar plataformas:', error);
    }
  };

  if (plataformaId) fetchPlataforma();
}, [plataformaId]);

  return (
    <div className="p-4 space-y-4">
      
      {/* ⬇️ Agora TUDO dentro de 1 único Tabs */}
      <Tabs defaultValue="kanban" className="w-full">

        {/* Caixa branca: Tabs + Logo */}
        <div className="relative bg-white rounded-xl shadow-sm p-4 flex items-center justify-between w-full mb-4 min-h-[60px]">
          
          {/* Botões Kanban/Lista */}
          <TabsList className="flex">
            <TabsTrigger
              value="kanban"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-6"
            >
              Kanban
            </TabsTrigger>
            <TabsTrigger
              value="lista"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-6"
            >
              Lista
            </TabsTrigger>
          </TabsList>

          {/* Logo da plataforma centralizada */}
          {plataformaAtual && (
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Image
                src={plataformaAtual.imagem || '/placeholder.png'}
                alt={plataformaAtual.nome}
                width={120}
                height={50}
                className="object-contain"
              />
            </div>
          )}

        </div>

        {/* Conteúdo */}
        <TabsContent value="kanban">
          <Card>
            <KanbanWrapper />
          </Card>
        </TabsContent>

        <TabsContent value="lista">
          <Card>
            <ListaInfluenciadores plataformaSlug={plataformaId} />
          </Card>
        </TabsContent>

      </Tabs>

    </div>
  );
}
