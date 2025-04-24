"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import Image from "next/image";
import { Pencil, AlertCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { Dialog as InnerDialog, DialogContent as InnerContent } from "@/components/ui/dialog";
import { plataformas } from "@/lib/data";
import { Influenciador } from "@/lib/influenciadores";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import RecargasModal from "@/components/RecargasModal";
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'



interface OptionType {
  value: string;
  label: string;
  icon?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  influenciador: Influenciador | null;
  onUpdate?: (updated: Influenciador) => void;
}

const InfluenciadorModal = ({ open, onClose, influenciador, onUpdate }: Props) => {
  if (!influenciador) return null;

  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [status, setStatus] = useState<Influenciador["status"]>("lead");
  const [motivoBanimento, setMotivoBanimento] = useState("");
  const [openMotivo, setOpenMotivo] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);

  const platformOptions: OptionType[] = plataformas.map((p) => ({
    value: p.id,
    label: p.nome,
  }));
  
  const [recargaModalOpen, setRecargaModalOpen] = useState(false);

  const selectedOptions = platformOptions.filter((opt) =>
    plataformasSelecionadas.includes(opt.value)
  );

  useEffect(() => {
    if (influenciador) {
      setPlataformasSelecionadas(influenciador.recargas.map((r) => r.plataformaId));
      setPreviewImage(influenciador.imagem);
      setStatus(influenciador.status);
      setMotivoBanimento(influenciador.motivoBanimento || "");
    }
  }, [influenciador]);

  useEffect(() => {
    if (status === "banido") {
      setOpenMotivo(true);
    }
  }, [status]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCloseAndUpdate = (openState: boolean) => {
    if (!openState && influenciador) {
      const updated: Influenciador = {
        ...influenciador,
        imagem: previewImage,
        status,
        motivoBanimento,
        recargas: influenciador.recargas,
      };
      onUpdate?.(updated);
      onClose();
    }
  };
  const [followersCount, setFollowersCount] = useState<number | null>(null);
  const [imagemErro, setImagemErro] = useState(false);
  useEffect(() => {
    setImagemErro(false);
  }, [influenciador]);

  function isCacheValid(cached: any): boolean {
    if (!cached?.lastFetched) return false;
    const diffInDays = (Date.now() - cached.lastFetched) / (1000 * 60 * 60 * 24);
    return diffInDays < 30;
  }
  const fetchInstagramData = async (username: string, cacheKey: string) => {
    try {
      const response = await fetch(`/api/instagram/profile?username=${username}`);
      const data = await response.json();
  
      const profilePic = data.profile_pic_url_hd;
      const followers = data.edge_followed_by.count;
  
      setPreviewImage(profilePic);
      setFollowersCount(followers);
  
      localStorage.setItem(cacheKey, JSON.stringify({
        profile_pic_url_hd: profilePic,
        followers_count: followers,
        lastFetched: Date.now()
      }));
    } catch (error) {
      console.error('Erro ao buscar dados do Instagram:', error);
    }
  };

  const hoje = new Date().toISOString().split("T")[0];
  const hojeTimestamp = Date.parse(hoje);

  const recargasAtivas = influenciador.recargas.filter((rec) => {
    const recTermino = Date.parse(rec.termino);
    return plataformasSelecionadas.includes(rec.plataformaId) && recTermino >= hojeTimestamp;
  });

  const recargasHistorico = influenciador.recargas.filter((rec) => {
    const recTermino = Date.parse(rec.termino);
    return plataformasSelecionadas.includes(rec.plataformaId) && recTermino < hojeTimestamp;
  });
// —————— A PARTIR DAQUI ——————
// quantos cards por página
const pageSize = 2;

// controle de página atual
const [pageAtivas, setPageAtivas] = useState(0);
const [pageHistorico, setPageHistorico] = useState(0);

// quantas páginas existem
const pageCountAtivas = Math.ceil(recargasAtivas.length / pageSize);
const pageCountHistorico = Math.ceil(recargasHistorico.length / pageSize);

// fatias paginadas
const atuaisPag = useMemo(() =>
  recargasAtivas.slice(
    pageAtivas * pageSize,
    pageAtivas * pageSize + pageSize
  ),
  [recargasAtivas, pageAtivas]
);
const historicoPag = useMemo(() =>
  recargasHistorico.slice(
    pageHistorico * pageSize,
    pageHistorico * pageSize + pageSize
  ),
  [recargasHistorico, pageHistorico]
);
// —————— ATÉ AQUI ——————

// agora sim você pode resetar
useEffect(() => {
  setPageAtivas(0);
}, [recargasAtivas.length]);

useEffect(() => {
  setPageHistorico(0);
}, [recargasHistorico.length]);




  useEffect(() => {
    const username = influenciador?.instagram?.replace(/\/$/, "").split("/").pop()?.replace("@", "");
    if (!username) return;

  const cacheKey = `insta_${username}`;
  const cached = JSON.parse(localStorage.getItem(cacheKey) || "null");

  if (isCacheValid(cached)) {
    setPreviewImage(cached.profile_pic_url_hd);
    setFollowersCount(cached.followers_count);
    return;
  }

  fetchInstagramData(username, cacheKey);
}, [influenciador]);

// Gera uma imagem "random" baseada no nome (usando ui-avatars.com)
const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
  influenciador.nome
)}&background=random&color=fff`;

  return (
    <>
    <Dialog open={open} onOpenChange={handleCloseAndUpdate}>
      <DialogContent size="full">

        <div className="grid grid-cols-[35%_1fr] gap-8">
          {/* Esquerda */}
          <div className="space-y-4">
            <div className="grid grid-cols-[auto_1fr] items-center gap-4 items-start">
              <div className="relative w-16 h-16 group">
              <Image
  src={
    imagemErro
      ? "/images/avatar/placeholder.png"
      : previewImage || "/images/avatar/placeholder.png"
  }
  alt={influenciador.nome}
  fill
  onError={() => setImagemErro(true)}
  unoptimized
  className="rounded-full object-cover border"
/>
                <div
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition"
                  onClick={() => inputFileRef.current?.click()}
                >
                  <Pencil className="text-white w-5 h-5" />
                </div>
                <input ref={inputFileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>
              <div className="grid grid-cols-2 flex gap-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nome">Nome do Blogueiro</Label>
                  <Input id="nome" value={influenciador.nome} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="instagram">Instagram</Label>
                  <InputGroup>
                  <InputGroupText>@</InputGroupText>
                    <Input id="instagram" value={influenciador.instagram} />
                    </InputGroup>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-[57%_1fr] flex gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" value={influenciador.cpf} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpf">Chave Pix</Label>
              <Input id="chavepix" value={influenciador.cpf} />
            </div>
            </div>
            <div className="space-y-1.5">
              <Label>Data de Cadastro</Label>
              <Input value={influenciador.dataCadastro} readOnly />
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
                <div className="w-[70%]">
                  <ShadSelect value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lead">Lead</SelectItem>
                      <SelectItem value="contato">Em contato</SelectItem>
                      <SelectItem value="negociacao">Em negociação</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="banido">Banido</SelectItem>
                    </SelectContent>
                  </ShadSelect>
                </div>
                {status === "banido" && (
                  <Button type="button" onClick={() => setOpenMotivo(true)} variant="ghost" className="w-[30%] text-xs px-2 py-1 border border-destructive text-destructive hover:bg-destructive hover:text-white">
                    <AlertCircle className="w-4 h-4 mr-1" /> Motivo
                  </Button>
                )}
              </div>
            </div>

            <InnerDialog open={openMotivo} onOpenChange={setOpenMotivo}>
              <InnerContent>
                <div className="space-y-2">
                  <Label>Motivo do Banimento</Label>
                  <Textarea value={motivoBanimento} onChange={(e) => setMotivoBanimento(e.target.value)} placeholder="Descreva o motivo..." />
                </div>
              </InnerContent>
            </InnerDialog>

            <div className="space-y-1.5">
              <Label>Plataformas</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                components={makeAnimated()}
                options={platformOptions}
                value={selectedOptions}
                onChange={(selected) => setPlataformasSelecionadas(selected.map((s) => s.value))}
              />
            </div>
          </div>

          {/* Direita */}
          <Tabs defaultValue="ativas" className="w-full">
          <div className="flex items-center mb-4 space-x-2">
          <Button
              variant="outline"
              size="icon"
              onClick={() => setRecargaModalOpen(true)}
              className="w-6 h-6 bg-transparent ring-offset-transparent hover:bg-transparent border border-default-200 hover:text-gray-400"
              aria-label="Nova recarga"
  >
    +
  </Button>
            <TabsList className="">
              <TabsTrigger value="ativas">Recargas  Ativas</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="ativas">
  {recargasAtivas.length === 0 ? (
    <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm text-center">
      Nenhuma recarga ativa no momento.
    </div>
  ) : (
    <>
      {/* container fixo, sem scroll */}
      <div className="h-[450px] overflow-hidden">
    {atuaisPag.map((rec, idx) =>
      renderRecargaCard(rec, idx)
    )}
  </div>

      {/* controles de paginação */}
      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPageAtivas(old => Math.max(old - 1, 0))}
          disabled={pageAtivas === 0}
          className="w-8 h-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* botões de página */}
        {Array.from({ length: pageCountAtivas }).map((_, i) => (
          <Button
            key={i}
            size="icon"
            variant={i === pageAtivas ? 'default' : 'outline'}
            onClick={() => setPageAtivas(i)}
            className="w-8 h-8"
          >
            {i + 1}
          </Button>
        ))}

        <Button
          variant="outline"
          size="icon"
          onClick={() => setPageAtivas(old => Math.min(old + 1, pageCountAtivas - 1))}
          disabled={pageAtivas >= pageCountAtivas - 1}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </>
  )}
</TabsContent>

<TabsContent value="historico">
  {recargasHistorico.length === 0 ? (
    <div className="flex items-center justify-center h-[300px] text-muted-foreground text-sm text-center">
      Nenhuma recarga no histórico.
    </div>
  ) : (
    <>
      <div className="h-[450px] overflow-hidden">
        {historicoPag.map((rec, idx) =>
            renderRecargaCard(rec, idx)
          )}
      </div>

      <div className="flex items-center justify-center gap-2 py-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPageHistorico(old => Math.max(old - 1, 0))}
          disabled={pageHistorico === 0}
          className="w-8 h-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: pageCountHistorico }).map((_, i) => (
          <Button
            key={i}
            size="icon"
            variant={i === pageHistorico ? 'default' : 'outline'}
            onClick={() => setPageHistorico(i)}
            className="w-8 h-8"
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setPageHistorico(old => Math.min(old + 1, pageCountHistorico - 1))}
          disabled={pageHistorico >= pageCountHistorico - 1}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </>
  )}
</TabsContent>

          </Tabs>
        </div>
      </DialogContent>
    </Dialog>

      {/* 2) RecargasModal irmão do Dialog */}
      <RecargasModal
      open={recargaModalOpen}
      onClose={() => setRecargaModalOpen(false)}
      onSave={(novaRecarga) => {
        const updated: Influenciador = {
          ...influenciador!,
          recargas: [
            ...influenciador!.recargas,
            {
              plataformaId: novaRecarga.plataformaId,
              valor: novaRecarga.valor,
              inicio: novaRecarga.inicio,
              termino: novaRecarga.termino,
              meta: 0,
              atingido: 0,
              statusMeta: "incompleto",
              salario: novaRecarga.valor,
            },
          ],
        };
        onUpdate?.(updated);
        setRecargaModalOpen(false);
      }}
      influenciadores={[influenciador!]}
    />
  </>
  );

  function renderRecargaCard(rec: Influenciador["recargas"][0], index: number) {
    const plataforma = plataformas.find((p) => p.id === rec.plataformaId);
    const statusLabel =
      rec.meta === 0 && rec.atingido === 0
        ? "Meta indefinida"
        : rec.atingido >= rec.meta
        ? "Meta Batida"
        : "Meta Pendente";
    const statusClass =
      rec.meta === 0 && rec.atingido === 0
        ? "bg-muted text-muted-foreground"
        : rec.atingido >= rec.meta
        ? "bg-green-500 text-white"
        : "bg-yellow-400 text-yellow-900";

    return (
      <div key={index} className="border border-muted rounded-md m-2 p-4 space-y-3 h-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-">
            {plataforma?.imagem && (
              <Image src={plataforma.imagem} alt={plataforma.nome} width={64} height={32} className="" />
            )}
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>{statusLabel}</div>
        </div>
        <div className="grid grid-cols-6 gap-2 text-sm">
  <div className="space-y-1.5">
    <Label>Meta</Label>
    <InputGroup>
      <InputGroupText>R$</InputGroupText>
      <Input type="number" value={rec.meta} />
    </InputGroup>
  </div>

  <div className="space-y-1.5">
    <Label>Atingido</Label>
    <InputGroup>
      <InputGroupText>R$</InputGroupText>
      <Input type="number" value={rec.atingido} />
    </InputGroup>
  </div>

  <div className="space-y-1.5">
    <Label>Reembolso</Label>
    <InputGroup>
      <InputGroupText>R$</InputGroupText>
      <Input type="number" value={rec.reembolso} />
    </InputGroup>
  </div>

  <div className="space-y-1.5">
    <Label>Salário</Label>
    <InputGroup>
      <InputGroupText>R$</InputGroupText>
      <Input type="number" value={rec.salario} />
    </InputGroup>
  </div>

  <div className="space-y-1.5">
    <Label>Início</Label>
    <Input type="date" value={rec.inicio} />
  </div>

  <div className="space-y-1.5">
    <Label>Término</Label>
    <Input type="date" value={rec.termino} />
  </div>
</div>
      </div>
    );
  }
};

export default InfluenciadorModal;
