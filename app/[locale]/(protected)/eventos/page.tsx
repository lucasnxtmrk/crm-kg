'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { EventoModal } from '@/components/EventosModal'
import { EventoFormData, Plataforma } from '@/lib/types'

interface Evento {
  id: string
  nome: string
  createdAt: string
  plataformas: {
    plataforma: {
      id: string
      nome: string
      imagem: string | null
    }
  }[]
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const locale = useLocale()
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [plataformasDisponiveis, setPlataformasDisponiveis] = useState<Plataforma[]>([])
  const [loading, setLoading] = useState(false)

  // Buscar eventos
  const buscarEventos = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/eventos')
      const data = await res.json()
      setEventos(data)
    } catch (error) {
      console.error('Erro ao buscar eventos:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Buscar plataformas disponíveis
    async function fetchPlataformas() {
      const response = await fetch('/api/plataformas')
      const data = await response.json()
      setPlataformasDisponiveis(data || [])
    }

    fetchPlataformas()
  }, [])

  useEffect(() => {
    buscarEventos()
  }, [])

  const abrirNovo = () => {
    setModalAberto(true)
  }

  const handleSalvar = async (data: EventoFormData) => {
    try {
      setLoading(true)
      const response = await fetch('/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          plataformaIds: data.plataformaIds, // Certificando que estamos enviando os IDs das plataformas
        }),
      })

      if (!response.ok) throw new Error('Erro ao criar evento')

      // Recarregar os eventos após a criação
      const newEvent = await response.json()
      setEventos((prevEventos) => [...prevEventos, newEvent])

      setModalAberto(false) // Fechar o modal após salvar
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
    } finally {
      setLoading(false)
    }
  }

  const eventosFiltrados = eventos.filter((evento) =>
    evento.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div className="p-4">
      <Card className="flex flex-row items-center p-3 justify-between gap-4 mb-4">
        <h1 className="text-xl font-bold">Eventos</h1>
        <div className="flex gap-3">
          <Input
            placeholder="Filtrar pelo nome do Evento..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="max-w-xs"
          />
          <Button size="md" onClick={abrirNovo} className="flex gap-2 items-center">
            <Plus className="w-4 h-4" />
            Novo Evento
          </Button>
        </div>
      </Card>

      {loading ? (
        <p className="text-gray-500">Carregando eventos...</p>
      ) : eventos.length === 0 ? (
        <p className="text-gray-500">Nenhum evento encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <Link
              key={evento.id}
              href={`/eventos/${evento.id}`}
              className="block"
            >
              <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">{evento.nome}</h2>
                <p className="text-sm text-gray-500">
                  {new Date(evento.createdAt).toLocaleDateString(locale)}
                </p>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {evento.plataformas.map(({ plataforma }) => (
                    <div
                      key={plataforma.id}
                      className="flex items-center gap-2 bg-gray-100 rounded px-2 py-1 text-sm text-gray-600"
                    >
                      {plataforma.imagem && (
                        <img
                          src={plataforma.imagem}
                          alt={plataforma.nome}
                          className="w-4 h-4 rounded"
                        />
                      )}
                      {plataforma.nome}
                    </div>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <EventoModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={handleSalvar}
        plataformasDisponiveis={plataformasDisponiveis || []} // Garantir que nunca seja undefined
      />
    </div>
  )
}
