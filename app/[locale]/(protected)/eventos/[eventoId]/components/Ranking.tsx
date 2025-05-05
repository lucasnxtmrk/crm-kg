'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Participante {
  id: string
  nome: string
  imagem: string
  atingido: number
}

interface Props {
  participantes: Participante[]
}

export default function RankingLeaderboard({ participantes }: Props) {
  const ordenados = [...participantes].sort((a, b) => b.atingido - a.atingido)

  const medalhas = ['🥇', '🥈', '🥉']

  return (
    <div className="max-w min-h-[80vh]  mx-auto p-4 bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-800 rounded-xl shadow-lg text-white">
      <h2 className="text-center text-2xl font-bold mb-6">🏆 Ranking do Evento</h2>

      <ul className="space-y-2">
        {ordenados.map((p, index) => (
          <li
            key={p.id}
            className={cn(
              "flex items-center justify-between px-4 py-2 rounded-lg",
              index === 0 ? 'bg-yellow-700 bg-opacity-30' :
              index === 1 ? 'bg-gray-400 bg-opacity-30' :
              index === 2 ? 'bg-orange-700 bg-opacity-30' :
              'bg-white bg-opacity-10'
            )}
          >
            {/* Posição e medalha */}
            <div className="flex items-center gap-2 w-12 font-bold">
              {index < 3 ? medalhas[index] : index + 1}
            </div>

            {/* Imagem e nome */}
            <div className="flex items-center gap-3 flex-1">
            <Avatar className="h-10 w-10 bg-primary text-white font-bold border border-white">
  <AvatarImage
    src={p.imagem}
    alt={p.nome}
    onError={(e) => (e.currentTarget.style.display = 'none')}
  />
  <AvatarFallback>
    {p.nome
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)}
  </AvatarFallback>
</Avatar>
<span className="font-medium">{p.nome}</span>
            </div>

            {/* Estrelas */}
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>{i < Math.round(p.atingido / 1000) ? '⭐' : '☆'}</span>
              ))}
            </div>

            {/* Pontuação */}
            <div className="w-12 text-right font-bold">{p.atingido}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
