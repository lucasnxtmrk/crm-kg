'use client'

import { motion } from 'framer-motion'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Participante {
  id: string
  nome: string
  imagem: string
  atingido: number
  meta: number
}

interface Props {
  participantes: Participante[]
}

export default function PodiumLeaderboard({ participantes }: Props) {
  const ordenados = [...participantes].sort((a, b) => b.atingido - a.atingido)

  const top3 = ordenados.slice(0, 3).map((p, i) => ({ ...p, position: i }))
  const restantes = ordenados.slice(3)

  const getAltura = (position: number) => {
    const base = 80
    return base + (2 - position) * 30 // posição 0 (1º lugar) = maior altura
  }

  return (
    <div className='w-full min-h-[90vh] bg-[#230621] rounded-xl shadow-lg text-white'>
    <div className="max-w-4xl mx-auto p-4 text-white">
      <h2 className="text-center text-2xl font-bold mb-6">🏆 Ranking do Evento</h2>

      {/* Pódio */}
      <div className="flex justify-center items-end gap-6 h-64">
        {top3.map((winner) => (
          <div key={winner.id} className="flex flex-col items-center justify-end">
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: getAltura(winner.position),
                opacity: 1,
              }}
              transition={{ delay: 0.5 + winner.position * 0.2, duration: 1, ease: 'easeOut' }}
              className={cn(
                'w-20 rounded-t-lg flex items-end justify-center text-white font-bold shadow-md',
                winner.position === 0
                  ? 'bg-yellow-400 text-yellow-900'
                  : winner.position === 1
                  ? 'bg-gray-300 text-gray-800'
                  : 'bg-orange-400 text-orange-900'
              )}
            >
              <span className="mb-2 text-xl">{winner.position + 1}</span>
            </motion.div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + winner.position * 0.2 }}
              className="mt-3 flex flex-col items-center"
            >
              <Avatar className="h-12 w-12 border-2 border-white shadow">
                <AvatarImage src={winner.imagem} />
                <AvatarFallback>{winner.nome[0]}</AvatarFallback>
              </Avatar>
              <p className="text-center mt-1 text-sm font-medium">{winner.nome}</p>
              <p className="text-center text-xs">💰R$ {winner.atingido}</p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Lista restante */}
      <ul className="mt-8 space-y-2">
        {restantes.map((p, index) => (
          <li
            key={p.id}
            className="flex items-center justify-between px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition"
          >
            <div className="flex items-center gap-3">
              <span className="w-5 text-sm">{index + 4}</span>
              <Avatar className="h-8 w-8">
                <AvatarImage src={p.imagem} />
                <AvatarFallback>{p.nome[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium">{p.nome}</span>
            </div>
            <span className="text-sm font-bold">R$ {p.atingido}</span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}
