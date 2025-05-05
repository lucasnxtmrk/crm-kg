'use client'

import { Link } from '@/i18n/routing';
import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'; 


interface Evento {
  id: string
  nome: string
  createdAt: string
}

export default function EventosPage() {
  const [eventos, setEventos] = useState<Evento[]>([])
  const locale = useLocale(); // ⬅️ Pegue o locale atual


  useEffect(() => {
    fetch('/api/eventos')
      .then(res => res.json())
      .then(setEventos)
      .catch(() => alert("Erro ao carregar eventos"))
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Eventos</h1>
      <ul className="space-y-2">
        {eventos.map(evento => (
          <li key={evento.id}>
            <Link href={`/eventos/${evento.id}`} className="text-blue-600 hover:underline">
              {evento.nome} – {new Date(evento.createdAt).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
