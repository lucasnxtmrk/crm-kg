'use client'
import { useEffect, useState } from 'react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { DateRange } from "react-day-picker"

interface Influenciador {
  meta: number
  atingido: number
  cadastros_influenciadores: {
    influenciadores: {
      nome: string
      imagem?: string
    }
  }
  inicio: string
}

interface Props {
  intervalo?: DateRange
}

export default function ListaInfluencers({ intervalo }: Props) {
  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([])

  useEffect(() => {
    fetch('/api/recargas')
      .then(res => res.json())
      .then((data) => {
        const from = intervalo?.from ? new Date(intervalo.from) : null
        const to = intervalo?.to ? new Date(intervalo.to) : null
  
        const filtrados = data
          .filter((rec: any) => {
            if (!from || !to) return true
            const dataInicio = new Date(rec.inicio)
            return dataInicio >= from && dataInicio <= to
          })
          .filter((rec: any) => Number(rec.atingido) >= Number(rec.meta))
          .sort((a: any, b: any) => Number(b.meta) - Number(a.meta))
  
        setInfluenciadores(filtrados)
      })
  }, [intervalo])
  

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-4">🏆 Influenciadores com Meta Batida</h3>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {influenciadores.map((inf, idx) => {
          const nome = inf.cadastros_influenciadores?.influenciadores?.nome || "Sem nome"
          const imagem = inf.cadastros_influenciadores?.influenciadores?.imagem
          return (
            <div
              key={idx}
              className="flex items-center gap-4 bg-muted/30 rounded-xl p-4 shadow-sm border"
            >
              <Avatar className="h-10 w-10">
                <AvatarImage src={imagem} />
                <AvatarFallback>{nome.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{nome}</p>
                <p className="text-xs text-muted-foreground">
                  Meta: <strong>R$ {Number(inf.meta).toLocaleString('pt-BR')}</strong> — Atingido:{' '}
                  <strong className="text-green-600">R$ {Number(inf.atingido).toLocaleString('pt-BR')}</strong>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
