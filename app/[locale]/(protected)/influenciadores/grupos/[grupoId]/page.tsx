'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link'; // 👈 importar Link
import { useLocale } from 'next-intl'; 

interface Plataforma {
  id: string;
  nome: string;
  imagem?: string;
  grupoId: string | null;
}

interface Grupo {
  id: string;
  nome: string;
}

export default function GrupoPage() {
  const { grupoId } = useParams() as { grupoId: string };
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [grupo, setGrupo] = useState<Grupo | null>(null);
  const locale = useLocale(); // ⬅️ Pegue o locale atual

  useEffect(() => {
    const buscarPlataformasEGrupo = async () => {
      const [resPlataformas, resGrupos] = await Promise.all([
        fetch('/api/plataformas'),
        fetch('/api/grupos'),
      ]);
      const plataformas: Plataforma[] = await resPlataformas.json();
      const grupos: Grupo[] = await resGrupos.json();

      setPlataformas(plataformas.filter(p => p.grupoId === grupoId));
      const encontrado = grupos.find(g => g.id === grupoId) || null;
      setGrupo(encontrado);
    };

    if (grupoId) buscarPlataformasEGrupo();
  }, [grupoId]);

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">
        Plataformas do grupo: {grupo?.nome || grupoId}
      </h1>

      {plataformas.length === 0 ? (
        <p className="text-gray-500">Nenhuma plataforma encontrada.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plataformas.map((plataforma) => (
            <Link
              key={plataforma.id}
              href={`/${locale}/influenciadores/plataformas/${plataforma.id}`}
              className="block"
            >
              <Card className="hover:shadow-md transition cursor-pointer">
                <CardContent className="p-4 text-center space-y-2">
                  {plataforma.imagem ? (
                    <Image
                      src={plataforma.imagem}
                      alt={plataforma.nome}
                      width={300}
                      height={150}
                      unoptimized
                      className="mx-auto h-24 object-contain"
                    />
                  ) : (
                    <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-gray-400">
                      Sem imagem
                    </div>
                  )}
                  <p className="text-sm font-medium">{plataforma.nome}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
