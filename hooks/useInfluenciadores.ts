'use client';

import { useEffect, useState, useCallback } from 'react';
import { Influenciador } from '@/lib/types';

export function useInfluenciadores() {
  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInfluenciadores = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/influenciadores');
      const data = await res.json();
      setInfluenciadores(data);
    } catch (error) {
      console.error('Erro ao buscar influenciadores:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInfluenciadores();
  }, [fetchInfluenciadores]);

  return { influenciadores, loading, refetch: fetchInfluenciadores };
}
