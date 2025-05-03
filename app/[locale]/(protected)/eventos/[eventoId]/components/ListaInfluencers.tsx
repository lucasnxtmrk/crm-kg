'use client'

import { useEffect, useState } from 'react'

interface Participante {
  id: string
  influenciador: {
    nome: string
    instagram: string
  }
  meta: number
  atingido: number
}

export default function ListaInfluencers({ eventoId }: { eventoId: string }) {
  const [participantes, setParticipantes] = useState<Participante[]>([])

  useEffect(() => {
    fetch(`/api/eventos/${eventoId}`)
      .then(res => res.json())
      .then(data => setParticipantes(data.participantes_evento))
  }, [eventoId])

  return (
    <table className="w-full mt-4 border">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-2">Influenciador</th>
          <th className="p-2">Instagram</th>
          <th className="p-2">Meta</th>
          <th className="p-2">Atingido</th>
        </tr>
      </thead>
      <tbody>
        {participantes.map(p => (
          <tr key={p.id} className="border-t">
            <td className="p-2">{p.influenciador.nome}</td>
            <td className="p-2">@{p.influenciador.instagram}</td>
            <td className="p-2">{p.meta}</td>
            <td className="p-2">{p.atingido}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
