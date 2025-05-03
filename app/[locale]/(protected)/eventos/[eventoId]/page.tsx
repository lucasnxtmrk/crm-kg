'use client'

import { useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Ranking from './components/Ranking'
import ListaInfluencers from './components/ListaInfluencers'

export default function EventoPage() {
  const { eventoId } = useParams() as { eventoId: string }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Evento #{eventoId}</h1>
      <Tabs defaultValue="ranking">
        <TabsList>
          <TabsTrigger value="ranking">Ranking</TabsTrigger>
          <TabsTrigger value="influencers">Influenciadores</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking">
          <Ranking eventoId={eventoId} />
        </TabsContent>

        <TabsContent value="influencers">
          <ListaInfluencers eventoId={eventoId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
