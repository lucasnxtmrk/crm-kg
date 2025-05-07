'use client'

import { useEffect, useState } from 'react'
import { Link } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, Pencil } from 'lucide-react'
import { EventoModal } from '@/components/EventosModal'
import { EventoFormData, Plataforma } from '@/lib/types'

interface Evento {
  id: string
  nome: string
  createdAt: string
  data_evento?: string
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
  const [eventoEditando, setEventoEditando] = useState<EventoFormData | null>(null)
  const [plataformasDisponiveis, setPlataformasDisponiveis] = useState<Plataforma[]>([])
  const [loading, setLoading] = useState(false)

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
    setEventoEditando(null)
    setModalAberto(true)
  }

  const abrirEdicao = (evento: Evento) => {
    const plataformaIds = evento.plataformas.map((p) => p.plataforma.id)
    setEventoEditando({
      id: evento.id,
      nome: evento.nome,
      data: evento.data_evento?.split('T')[0] ?? '', // garantir formato yyyy-mm-dd
      plataformaIds,
    })
    setModalAberto(true)
  }

  const handleSalvar = async (data: EventoFormData) => {
    try {
      setLoading(true)
  
      const isEdicao = !!data.id // Se existe ID, é edição
      const url = isEdicao ? `/api/eventos/${data.id}` : '/api/eventos'
      const method = isEdicao ? 'PATCH' : 'POST'
  
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          data: data.data,
          plataformaIds: data.plataformaIds,
        }),
      })
  
      if (!response.ok) {
        const msg = await response.text()
        throw new Error(`Erro na API: ${msg}`)
      }
  
      const eventoRetornado = await response.json()
  
      if (isEdicao) {
        // Atualizar evento na lista local
        setEventos((prevEventos) =>
          prevEventos.map((ev) => (ev.id === data.id ? eventoRetornado : ev))
        )
      } else {
        // Inserir novo evento na lista
        setEventos((prevEventos) => [...prevEventos, eventoRetornado])
      }
  
      setModalAberto(false)
      setEventoEditando(null)
    } catch (error) {
      console.error('Erro ao salvar evento:', error)
      alert('Falha ao salvar o evento. Verifique os dados e tente novamente.')
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
            <div key={evento.id} className="relative group">
              <Link href={`/eventos/${evento.id}`} className="block">
                <div className="bg-white rounded-lg shadow hover:shadow-md transition p-4 border border-gray-200 cursor-pointer">
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
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/80 hover:bg-gray-600"
                onClick={() => abrirEdicao(evento)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <EventoModal
        open={modalAberto}
        onClose={() => {
          setModalAberto(false)
          setEventoEditando(null)
        }}
        onSave={handleSalvar}
        plataformasDisponiveis={plataformasDisponiveis}
        evento={eventoEditando} // 👈 Passando os dados pro modal
      />
    </div>
  )
}
