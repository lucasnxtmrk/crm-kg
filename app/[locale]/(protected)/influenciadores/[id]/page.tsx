'use client';

import { useParams } from 'next/navigation';
import React from 'react';
import ListaInfluenciadores from './components/lista/table';
import KanbanInfluenciadores from './components/kanban/kanban-app';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent } from '@/components/ui/card';
import KanbanWrapper from './components/kanban';

export default function PaginaPlataforma() {
  const params = useParams();
  const plataformaSlug = params?.id as string;

  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="kanban" className="w-full">
        <TabsList className="flex-wrap">
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
        <TabsContent value="kanban">
  <Card>
    <KanbanWrapper />
  </Card>
        </TabsContent>
        <TabsContent value="lista">
          <Card>
            <ListaInfluenciadores plataformaSlug={plataformaSlug} />
          </Card>
        </TabsContent>


      </Tabs>
    </div>
  );
}
