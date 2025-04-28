'use client';

import { useEffect, useState } from 'react';

export type Plataforma = {
  id: string;
  nome: string;
  imagem?: string;
};

export function usePlataformas() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlataformas() {
      try {
        const res = await fetch('/api/plataformas');
        const data = await res.json();
        setPlataformas(data);
      } catch (error) {
        console.error('Erro ao buscar plataformas:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchPlataformas();
  }, []);

  return { plataformas, loading };
}


