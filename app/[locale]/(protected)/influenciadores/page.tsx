'use client';

import { useEffect, useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PlataformaModal from "@/components/PlataformaModal";
import GrupoModal from "@/components/GrupoModal";
import { useLocale } from 'next-intl'; 

interface Plataforma {
  id: string;
  nome: string;
  imagem?: string;
  cor: string;
  grupoId: string | null;
}
interface Grupo {
  id: string;
  nome: string;
  imagem?: string;
}

export default function InfluenciadoresPage() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [busca, setBusca] = useState('');
  const [abaAtiva, setAbaAtiva] = useState('grupos');
  const [modalPlataformaAberto, setModalPlataformaAberto] = useState(false);
  const [modalGrupoAberto, setModalGrupoAberto] = useState(false);
  const [plataformaEditando, setPlataformaEditando] = useState<Plataforma | null>(null);
  const [grupoEditando, setGrupoEditando] = useState<Grupo | null>(null);
  const locale = useLocale(); // ⬅️ Pegue o locale atual

  const buscarPlataformas = async () => {
    const res = await fetch('/api/plataformas');
    const data = await res.json();
    setPlataformas(data);
  };

  const buscarGrupos = async () => {
    const res = await fetch('/api/grupos');
    const data = await res.json();
    setGrupos(data);
  };

  useEffect(() => {
    buscarPlataformas();
  }, []);

  useEffect(() => {
    if (abaAtiva === 'grupos') buscarGrupos();
  }, [abaAtiva]);

  const gruposFiltrados = grupos.filter((g) =>
    g.nome.toLowerCase().includes(busca.toLowerCase())
  );
  const plataformasFiltradas = plataformas.filter((p) =>
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );
  function ImagemComFallback({
    src,
    fallback,
    alt,
    ...props
  }: {
    src?: string
    fallback: string
    alt: string
    [key: string]: any
  }) {
    const [erro, setErro] = useState(false)
  
    return (
      <Image
        src={erro || !src ? fallback : src}
        alt={alt}
        onError={() => setErro(true)}
        {...props}
      />
    )
  }


  return (
    <div className="p-4 space-y-4">
      <Tabs defaultValue="grupos" className="w-full" onValueChange={setAbaAtiva}>
        <div className="relative bg-white rounded-xl shadow-sm p-4 flex items-center justify-between w-full mb-4 min-h-[60px]">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="grupos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-6">Grupos</TabsTrigger>
            <TabsTrigger value="plataformas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-md px-6">Todas as Plataformas</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <Input placeholder="Filtrar por nome..." value={busca} onChange={(e) => setBusca(e.target.value)} className="max-w-xs" />
            <Button className="flex gap-2 items-center" onClick={() => {
              if (abaAtiva === 'grupos') {
                setGrupoEditando(null);
                setModalGrupoAberto(true);
              } else {
                setPlataformaEditando(null);
                setModalPlataformaAberto(true);
              }
            }}>
              <Plus className="w-4 h-4" />
              {abaAtiva === 'grupos' ? 'Novo Grupo' : 'Nova Plataforma'}
            </Button>
          </div>
        </div>

        <TabsContent value="grupos">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {gruposFiltrados.map((grupo) => (
                  <div key={grupo.id} className="relative group">
                    <Link href={`/${locale}/influenciadores/grupos/${grupo.id}`} className="block">
                      <Card className="hover:shadow-lg transition cursor-pointer">
                        <CardContent className="p-6 text-center space-y-2">
                        <ImagemComFallback
  src={grupo.imagem}
  fallback="/images/grupos/default.png"
  alt={grupo.nome}
  width={120}
  height={120}
  className="mx-auto h-32 object-contain"
/>
                          <div className="text-sm font-medium">{grupo.nome}</div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/80 hover:bg-gray-600"
                      onClick={() => {
                        setGrupoEditando(grupo);
                        setModalGrupoAberto(true);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plataformas">
          <Card>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {plataformasFiltradas.map((plataforma) => (
                  <div key={plataforma.id} className="relative group">
                    <Link href={`/${locale}/influenciadores/plataformas/${plataforma.id}`} className="block">
                      <Card className="hover:shadow-lg transition cursor-pointer">
                        <CardContent className="p-6 text-center space-y-2">
                        <ImagemComFallback
  src={plataforma.imagem}
  fallback="/images/plataformas/default.png"
  alt={plataforma.nome}
  width={300}
  height={300}
  className="mx-auto mb-2 w-64 h-32 object-contain"
/>


                          <div className="text-sm font-medium">{plataforma.nome}</div>
                        </CardContent>
                      </Card>
                    </Link>
                    <Button size="icon" variant="ghost" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/80 hover:bg-gray-600" onClick={() => {
                      setPlataformaEditando(plataforma);
                      setModalPlataformaAberto(true);
                    }}>
                      <Pencil className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <PlataformaModal
  open={modalPlataformaAberto}
  onClose={() => {
    setModalPlataformaAberto(false);
    setPlataformaEditando(null);
  }}
  onSave={async (dados) => {
    const isEdicao = !!dados.id;

    const response = await fetch(isEdicao ? `/api/plataformas/${dados.id}` : '/api/plataformas', {
      method: isEdicao ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    if (!response.ok) {
      alert('Erro ao salvar a plataforma');
      return;
    }

    setModalPlataformaAberto(false);
    setPlataformaEditando(null);
    buscarPlataformas();
  }}
  onDelete={buscarPlataformas} // 👈 aqui está o segredo
  plataformaAtual={plataformaEditando}
/>


      <GrupoModal
        open={modalGrupoAberto}
        onClose={() => {
          setModalGrupoAberto(false);
          setGrupoEditando(null);
        }}
        onSave={async (dados) => {
          await fetch('/api/grupos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
          });
          await buscarGrupos();
          await buscarPlataformas();
          setModalGrupoAberto(false);
          setGrupoEditando(null);
        }}
        grupoAtual={grupoEditando}
        plataformasDisponiveis={plataformas.filter(p => !p.grupoId || p.grupoId === grupoEditando?.id)}
      />
    </div>
  );
}
