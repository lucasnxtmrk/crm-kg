'use client';

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // 👈 Importar Input
import { Pencil, Plus } from "lucide-react";
import Image from "next/image";
import PlataformaModal from "@/components/PlataformaModal";
import { useLocale } from 'next-intl'; 


interface Plataforma {
  id: string;
  nome: string;
  imagem?: string;
  cor: string;
}

export default function ListaDePlataformas() {
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [plataformaEditando, setPlataformaEditando] = useState<Plataforma | null>(null);
  const [busca, setBusca] = useState(''); // 👈 Novo estado para o filtro de busca
  const locale = useLocale(); // ⬅️ Pegue o locale atual
  const buscarPlataformas = async () => {
    try {
      const res = await fetch('/api/plataformas');
      const data = await res.json();
      setPlataformas(data);
    } catch (error) {
      console.error('Erro ao buscar plataformas:', error);
    }
  };

  useEffect(() => {
    buscarPlataformas();
  }, []);

  const handleSalvar = async (data: { id?: string; nome: string; imagem?: string; cor: string }) => {
    try {
      const response = await fetch('/api/plataformas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: data.nome,
          cor: data.cor,
          imagem: data.imagem,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar plataforma');
      }

      console.log('Plataforma cadastrada com sucesso!');
      await buscarPlataformas();
    } catch (error) {
      console.error('Erro ao salvar plataforma:', error);
    }
  };

  const abrirNovo = () => {
    setPlataformaEditando(null);
    setModalAberto(true);
  };

  const abrirEditar = (plataforma: Plataforma) => {
    setPlataformaEditando(plataforma);
    setModalAberto(true);
  };

  // 👇 Filtro de plataformas baseado no nome digitado
  const plataformasFiltradas = plataformas.filter((plataforma) =>
    plataforma.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
  <CardTitle>Plataformas</CardTitle>

  {/* Div que agrupa o Input e o Botão */}
  <div className="flex items-center gap-3">
    <Input
      placeholder="Filtrar por nome..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      className="max-w-xs"
    />
    <Button size="md" onClick={abrirNovo} className="flex gap-2 items-center">
      <Plus className="w-4 h-4" />
      Nova Plataforma
    </Button>
  </div>
</CardHeader>


        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plataformasFiltradas.map((plataforma) => (
  <div key={plataforma.id} className="relative group">
    <Link
      href={`/${locale}/influenciadores/plataformas/${plataforma.id}`} // <- aqui corrigido
      className="block"
    >
      <Card className="hover:shadow-lg transition cursor-pointer">
        <CardContent className="p-6 text-center space-y-2">
          {plataforma.imagem ? (
            <Image
              src={plataforma.imagem}
              alt={plataforma.nome}
              width={300}
              height={300}
              className="mx-auto mb-2 w-64 h-32 object-contain"
            />
          ) : (
            <div className="w-64 h-32 mx-auto mb-2 bg-muted flex items-center justify-center text-gray-400">
              Sem imagem
            </div>
          )}
          <div className="text-sm font-medium">{plataforma.nome}</div>
        </CardContent>
      </Card>
    </Link>
    <Button
      size="icon"
      variant="ghost"
      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition bg-white/80 hover:bg-gray-600"
      onClick={() => abrirEditar(plataforma)}
    >
      <Pencil className="w-4 h-4" />
    </Button>
  </div>
))}

          </div>
        </CardContent>
      </Card>

      <PlataformaModal
        open={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={handleSalvar}
        plataformaAtual={plataformaEditando}
      />
    </div>
  );
}
