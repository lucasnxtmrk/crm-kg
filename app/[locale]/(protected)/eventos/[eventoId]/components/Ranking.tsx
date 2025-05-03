'use client'

import { useEffect, useState } from 'react'

interface Participante {
  id: string
  influenciador: {
    nome: string
    imagem?: string
  }
  atingido: number
}

export default function Ranking({ eventoId }: { eventoId: string }) {
  const [participantes, setParticipantes] = useState<Participante[]>([])

  useEffect(() => {
    fetch(`/api/eventos/${eventoId}`)
      .then(res => res.json())
      .then(data => {
        const sorted = data.participantes_evento.sort((a: Participante, b: Participante) => b.atingido - a.atingido)
        setParticipantes(sorted)
      })
  }, [eventoId])

  return (
    <div className="grid grid-cols-1 gap-4 mt-4">
      {participantes.map((p, index) => (
        <div key={p.id} className="p-4 border rounded shadow">
          <div className="flex items-center gap-4">
            <span className="text-2xl font-bold">#{index + 1}</span>
            <img src={p.influenciador.imagem || '/placeholder.jpg'} className="w-10 h-10 rounded-full" />
            <span>{p.influenciador.nome}</span>
            <span className="ml-auto font-semibold text-green-600">{p.atingido} atingido</span>
          </div>
        </div>
      ))}
    </div>
  )
}
