'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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

export default function RankingLeaderboard({ participantes }: Props) {
  const ordenados = [...participantes].sort((a, b) => b.atingido - a.atingido)
  const top3 = ordenados.slice(0, 3)
  const restantes = ordenados.slice(3)

  const calcularEstrelas = (atingido: number, meta: number) => {
    const proporcao = meta > 0 ? atingido / meta : 0
    const estrelas = Math.min(5, Math.floor(proporcao * 5))
    return estrelas
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-800 rounded-xl shadow-lg text-white">
      <h2 className="text-center text-3xl font-bold mb-8">🏆 Ranking do Evento</h2>

      {/* Pódio */}
      <div className="flex justify-center items-end gap-4 mb-12">
        {top3.map((p, index) => {
          const alturas = ['h-48', 'h-64', 'h-40']
          const cores = ['bg-yellow-500', 'bg-gray-400', 'bg-orange-500']
          const posicoes = [1, 0, 2] // Para ordenar: 2º, 1º, 3º

          return (
            <div key={p.id} className="flex flex-col items-center">
              <div
                className={`w-24 ${alturas[posicoes[index]]} ${cores[posicoes[index]]} rounded-t-md flex flex-col items-center justify-end animate-bounce`}
              >
                <Avatar className="mb-2">
                  <AvatarImage src={p.imagem} alt={p.nome} />
                  <AvatarFallback>
                    {p.nome
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-lg font-bold">{p.nome}</span>
                <div className="flex">
                  {Array.from({ length: calcularEstrelas(p.atingido, p.meta) }).map((_, i) => (
                    <span key={i}>⭐</span>
                  ))}
                </div>
                <span className="text-sm">{p.atingido} pts</span>
              </div>
              <span className="mt-2 text-xl">
                {['🥇', '🥈', '🥉'][posicoes[index]]}
              </span>
            </div>
          )
        })}
      </div>

      {/* Demais participantes */}
      <ul className="space-y-4">
        {restantes.map((p, index) => (
          <li
            key={p.id}
            className="flex items-center justify-between bg-white bg-opacity-10 px-4 py-2 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <span className="text-xl font-bold">{index + 4}</span>
              <Avatar>
                <AvatarImage src={p.imagem} alt={p.nome} />
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
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: calcularEstrelas(p.atingido, p.meta) }).map((_, i) => (
                  <span key={i}>⭐</span>
                ))}
              </div>
              <span className="font-bold">{p.atingido} pts</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
