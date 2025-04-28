'use client';

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Plataforma {
  id: string;
  nome: string;
  imagem?: string;
  cor: string;
}

export default function PlataformaLogo() {
  const params = useParams();
  const plataformaSlug = params?.id as string;
  const [plataformaAtual, setPlataformaAtual] = useState<Plataforma | null>(null);

  useEffect(() => {
    const fetchPlataforma = async () => {
      try {
        const res = await fetch('/api/plataformas');
        const plataformas: Plataforma[] = await res.json();
        const plataforma = plataformas.find(p => p.id === plataformaSlug);
        setPlataformaAtual(plataforma || null);
      } catch (error) {
        console.error('Erro ao buscar plataformas:', error);
      }
    };

    if (plataformaSlug) {
      fetchPlataforma();
    }
  }, [plataformaSlug]);

  if (!plataformaAtual) {
    return null;
  }

  return (
    <div className="flex justify-center p-4">
      <Image
        src={plataformaAtual.imagem || '/placeholder.png'}
        alt={plataformaAtual.nome}
        width={200}
        height={80}
        className="object-contain"
      />
    </div>
  );
}
