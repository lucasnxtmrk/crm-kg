'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Participante {
  id: string
  nome: string
  imagem: string
  atingido: number
  meta: number
}

interface Props {
  participantes: Participante[]
  eventoId: string
}

export default function ListaParticipantesEvento({ participantes }: Props) {
  return (
    <div className="bg-white rounded-lg shadow p-4 w-full h-full overflow-auto">
      <h2 className="text-xl font-bold mb-4">Lista de Influenciadores</h2>
      <table className="w-full text-left border-separate border-spacing-y-2">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Atingido</th>
            <th>Meta</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {participantes.map(p => (
            <tr key={p.id} className="bg-gray-100 rounded">
              <td>{p.nome}</td>
              <td>{p.atingido}</td>
              <td>{p.meta}</td>
              <td>
                <Button size="sm" variant="outline">Editar</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
