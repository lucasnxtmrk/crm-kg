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
  influencer_id: string // <- adicione este campo corretamente
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
    influencer_id: p.influencer_id, // certo
    nome: p.influenciador.nome,
    imagem: p.influenciador.imagem || '/avatar.png',
    atingido: p.atingido,
    meta: p.meta
  }))
  

  return (
    <div className="min-h-[100vh]">
      <Tabs defaultValue="ranking" className="w-full h-full">
        <TabsList className="w-full flex justify-center bg-[#230621] rounded-xl shadow-lg text-white rounded-lg">
          <TabsTrigger value="ranking" className="px-4 rounded-full data-[state=inactive]:text-white">🏆 Ranking</TabsTrigger>
          <TabsTrigger value="participantes" className="px-4 py-2 rounded-full data-[state=inactive]:text-white">👥 Influencers</TabsTrigger>
        </TabsList>

        <TabsContent value="ranking" className="w-full h-full">
          <RankingLeaderboard participantes={participantesFormatados} />
        </TabsContent>

        <TabsContent value="participantes" className="w-full h-full">
        <ListaParticipantesEvento
          participantes={participantesFormatados}
          eventoId={eventoId}
          onUpdateParticipantes={() => {
          fetch(`/api/eventos/${eventoId}`)
          .then(res => res.json())
          .then(data => {
          if (Array.isArray(data.participantes)) {
          setParticipantes(data.participantes)
        }
      })
  }}
/>        </TabsContent>
      </Tabs>
    </div>
  )
}
