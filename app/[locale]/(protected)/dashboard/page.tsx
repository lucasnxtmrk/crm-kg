'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatusBlock } from '@/components/blocks/status-block'
import ListaInfluencers from './components/tableInfluencers'
import DashboardDropdown from '@/components/dashboard-dropdown'
import HistoryChart from './components/history-chart'
import AccountChart from './components/account-chart'
import FiltroData from './components/FiltroData'
import { DateRange } from 'react-day-picker'

interface Influenciador {
  id: string
  salario_fixo: number | null
  salarios_mensais: {
    valor: number
    mes: number
    ano: number
  }[]
}

interface Recarga {
  inicio: string
  atingido: string
  salario: string
}

interface Evento {
  data_evento: string
  participantes: {
    atingido: number
  }[]
}

const DashboardKG = () => {
  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([])
  const [recargas, setRecargas] = useState<Recarga[]>([])
  const [eventos, setEventos] = useState<Evento[]>([])
  const [intervalo, setIntervalo] = useState<DateRange | undefined>(undefined)

  useEffect(() => {
    fetch('/api/influenciadores')
      .then(res => res.json())
      .then(setInfluenciadores)

    fetch('/api/recargas')
      .then(res => res.json())
      .then(setRecargas)

      fetch('/api/eventos')
      .then(res => res.json())
      .then(data => {
        // Garante que todos os participantes venham preenchidos
        const eventosComParticipantes = data.map((evento: any) => ({
          ...evento,
          participantes: evento.participantes || []
        }))
        setEventos(eventosComParticipantes)
      })
  }, [])

  const dentroDoIntervalo = (dataStr: string) => {
    if (!intervalo?.from || !intervalo?.to) return true
  
    const data = new Date(dataStr)
    const from = new Date(intervalo.from)
    const to = new Date(intervalo.to)
  
    from.setHours(0, 0, 0, 0)
    to.setHours(23, 59, 59, 999)
    data.setHours(12, 0, 0, 0)
  
    return data >= from && data <= to
  }
  
  // Filtragem
  const recFiltradas = recargas.filter(r => dentroDoIntervalo(r.inicio))
  const recargasPorDia: { [dia: string]: number } = {}

recFiltradas.forEach(r => {
  const dia = new Date(r.inicio).toLocaleDateString('pt-BR', {
    weekday: 'short',
    timeZone: 'UTC'
  })

  recargasPorDia[dia] = (recargasPorDia[dia] || 0) + Number(r.atingido)
})

const diasSemana = ['dom.', 'seg.', 'ter.', 'qua.', 'qui.', 'sex.', 'sáb.']

const seriesChart = [
  {
    name: "Recargas",
    data: diasSemana.map(dia => recargasPorDia[dia] || 0)
  }
]

  const eventosFiltrados = eventos.filter(e => dentroDoIntervalo(e.data_evento))
  
  console.log('🟡 Intervalo selecionado:', intervalo)
  console.log('🔵 Recargas filtradas:', recFiltradas.length, recFiltradas)
  console.log('🟣 Eventos filtrados:', eventosFiltrados.length, eventosFiltrados)
  
  const totalSalariosFixosEMensais = influenciadores.reduce((total, inf) => {
    const fixo = Number(inf.salario_fixo) || 0
  
    const mensais = inf.salarios_mensais
      .filter(s => {
        if (!intervalo?.from || !intervalo?.to) return true
        const dataSalario = new Date(s.ano, s.mes - 1, 1)
        return dataSalario >= intervalo.from && dataSalario <= intervalo.to
      })
      .reduce((acc, s) => acc + Number(s.valor), 0)
  
    return total + fixo + mensais
  }, 0)
  
  const totalDespesas = totalSalariosFixosEMensais + recFiltradas.reduce((acc, r) => acc + Number(r.salario), 0)
  const totalArrecadado = recFiltradas.reduce(
    (acc, r) => acc + Number(r.atingido || 0),
    0
  )  
  const arrecadadoEventos = eventosFiltrados.reduce((total, evento) => {
    if (!evento.participantes) return total
    return total + evento.participantes.reduce((soma, p) => soma + Number(p.atingido || 0)    , 0)
  }, 0)
  
  
  console.log('🧾 Total de despesas:', totalDespesas)
  console.log('💸 Total arrecadado:', totalArrecadado)
  console.log('🎯 Arrecadado em eventos:', arrecadadoEventos)

  const formatar = (valor: number) => `R$ ${valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center px-2">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
        <FiltroData className="max-w-sm" onChange={setIntervalo} />
        </div>

      <Card>
        <CardContent className="p-6">
          <div className="grid xl:grid-cols-4 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-5">
            <StatusBlock title="Total de Despesas" total={formatar(totalDespesas)} chartType="bar" />
            <StatusBlock title="Despesas com Salários" total={formatar(totalSalariosFixosEMensais)} chartType="bar" chartColor="#FCDADA" />
            <StatusBlock title="Arrecadado Geral" total={formatar(totalArrecadado)} chartType="bar" chartColor="#80fac1" />
            <StatusBlock title="Arrecadação em Eventos" total={formatar(arrecadadoEventos)} chartType="bar" chartColor="#FFD700" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card>
          <CardContent className="p-0">
          <ListaInfluencers intervalo={intervalo} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row gap-1">
            <CardTitle className="flex-1">Histórico de Movimentações</CardTitle>
            <DashboardDropdown />
          </CardHeader>
          <CardContent>
          <HistoryChart series={seriesChart} categories={diasSemana} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DashboardKG
