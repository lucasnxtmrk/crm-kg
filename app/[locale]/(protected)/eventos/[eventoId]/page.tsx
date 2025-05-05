'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'

import RankingLeaderboard from './components/Ranking'
import ListaParticipantesEvento from './components/ListaInfluencers'

interface Participante {
  id: string
  atingido: number
  meta: number
  influenciador: {
    nome: string
    imagem: string
  }
}

export default function EventoPage() {
  const { eventoId } = useParams() as { eventoId: string }
  const [participantes, setParticipantes] = useState<Participante[]>([])

  useEffect(() => {
    fetch(`/api/eventos/${eventoId}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data.participantes)) {
          setParticipantes(data.participantes)
        }
      })
      .catch(err => {
        console.error('Erro ao buscar participantes:', err)
      })
  }, [eventoId])

  const participantesFormatados = participantes.map((p) => ({
    id: p.id,
    nome: p.influenciador.nome,
    imagem: p.influenciador.imagem || '/avatar.png',
    atingido: p.atingido,
    meta: p.meta
  }))

  return (
    <div className="min-h-screen p-4">
      <Tabs defaultValue="ranking" className="w-full h-full">
        <TabsList className="w-full flex justify-center mb-6 bg-gray-900 text-white rounded-lg">
          <TabsTrigger value="ranking" className="px-4 py-2">🏆 Ranking</TabsTrigger>
          <TabsTrigger value="participantes" className="px-4 py-2">👥 Influencers</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="w-full h-full">
          <RankingLeaderboard participantes={participantesFormatados} />
        </TabsContent>

        <TabsContent value="participantes" className="w-full h-full">
          <ListaParticipantesEvento participantes={participantesFormatados} eventoId={eventoId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
