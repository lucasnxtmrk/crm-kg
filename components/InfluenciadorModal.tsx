"use client";

import {
  Dialog,
  DialogContent,
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
import { Influenciador, Recarga, Plataforma } from "@/lib/types";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import RecargasModal from "@/components/RecargasModal";
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { AtSign, ArrowRight } from 'lucide-react';
import RecargaCard from "@/components/RecargaCard"; // (ou o caminho correto que você colocou)
import { motion } from "framer-motion";
import { Loader2 } from 'lucide-react';
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { size } from "@/lib/type";
import SalariosMensaisModal from "@/components/SalariosMensaisModal";




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
  const [instagramHandle, setInstagramHandle] = useState<string>("");
  const [hoverInstagram, setHoverInstagram] = useState(false);
  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>();
  const [status, setStatus] = useState<Influenciador["status"]>("bronze");
  const [motivo_banimento, setmotivo_banimento] = useState("");
  const [openMotivo, setOpenMotivo] = useState(false);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail]       = useState("");
  const [cpf, setCpf]           = useState("");
  const [chavepix, setChavePix] = useState("");
  const [localInfluenciador, setLocalInfluenciador] = useState<Influenciador | null>(null);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
  const [contratado, setContratado] = useState(false);
const [salarioFixo, setSalarioFixo] = useState(false);
const [modalSalariosOpen, setModalSalariosOpen] = useState(false);


  useEffect(() => {
    async function fetchPlataformas() {
      const response = await fetch("/api/plataformas");
      const data = await response.json();
      setPlataformas(data);
    }
    
    fetchPlataformas();
  }, []);
  useEffect(() => {
    setLocalInfluenciador(influenciador);
  }, [influenciador]);

  const platformOptions: OptionType[] = plataformas.map((p) => ({
    value: p.id,
    label: p.nome,
  }));
  
  const [recargaModalOpen, setRecargaModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedOptions = platformOptions.filter((opt) =>
    plataformasSelecionadas.includes(opt.value)
  );
  useEffect(() => {
    if (influenciador) {
      const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        influenciador.nome
      )}&background=random&color=fff`;
        
      setNome(influenciador.nome || "");
      setInstagramHandle(influenciador.instagram.replace(/^@/, ""));
      setEmail(influenciador.email || "");
      setCpf(influenciador.cpf || "");
      setPreviewImage(influenciador.imagem || fallback);
      setChavePix(influenciador.chavepix || "");
      setmotivo_banimento(influenciador.motivo_banimento || "");
      setStatus(influenciador.status);
      setPlataformasSelecionadas(
        influenciador.cadastros_influenciadores.map((c) => c.plataforma_id)
      );
      setContratado(influenciador.contratado ?? false);
setSalarioFixo(influenciador.salario_fixo ?? false);

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

  const handleCloseAndUpdate = async (openState: boolean) => {
    if (!openState && influenciador) {
      setIsSaving(true); // começa salvando
  
      const minimalData = {
        nome,
        imagem: previewImage,
        instagram: `@${instagramHandle}`,
        email,
        telefone: localInfluenciador?.telefone || "",
        cpf,
        chavepix,
        status,
        motivo_banimento,
        contratado: localInfluenciador?.contratado ?? false,
        salario_fixo: localInfluenciador?.salario_fixo ?? false,
        cadastros_influenciadores: localInfluenciador?.cadastros_influenciadores || [],
        salarios_mensais: localInfluenciador?.salarios_mensais || [],

      };
      
  
      try {
        // 1. Primeiro faz o PATCH para atualizar
        const response = await fetch(`/api/influenciadores/${influenciador.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(minimalData),
        });
  
        if (!response.ok) throw new Error("Erro ao salvar influenciador.");
  
        // 2. Depois faz um novo GET para buscar o influenciador atualizado
        const atualizadoResponse = await fetch(`/api/influenciadores/${influenciador.id}`);
        if (!atualizadoResponse.ok) throw new Error("Erro ao buscar influenciador atualizado.");
  
        const atualizado = await atualizadoResponse.json();
  
        // Atualiza tanto o modal quanto o pai
        onUpdate?.(atualizado);
        setLocalInfluenciador(atualizado);
  
      } catch (error) {
        console.error(error);
        alert("Erro ao salvar influenciador. Verifique sua conexão.");
      } finally {
        setIsSaving(false); // sempre libera o botão no final
      }
    }
  };
  
  
  
  
  const [imagemErro, setImagemErro] = useState(false);
  useEffect(() => {
    setImagemErro(false);
  }, [influenciador]);

  const reloadInfluenciador = async () => {
    if (!influenciador) return;
    try {
      const response = await fetch(`/api/influenciadores/${influenciador.id}`);
      if (!response.ok) throw new Error("Erro ao recarregar influenciador.");
      const data = await response.json();
      onUpdate?.(data);
    } catch (error) {
      console.error(error);
      alert("Erro ao recarregar influenciador.");
    }
  };

  function isCacheValid(cached: any): boolean {
    if (!cached?.lastFetched) return false;
    const diffInDays = (Date.now() - cached.lastFetched) / (1000 * 60 * 60 * 24);
    return diffInDays < 30;
  }

  const hoje = new Date().toISOString().split("T")[0];
  const hojeTimestamp = Date.parse(hoje);

  const todasRecargas = useMemo(() => {
    return localInfluenciador?.cadastros_influenciadores.flatMap((c) => c.recargas) || [];
  }, [localInfluenciador]);
  
  const recargasAtivas = useMemo(() => {
    return todasRecargas.filter((rec) => {
      const recTermino = Date.parse(rec.termino);
      const cadastro = localInfluenciador?.cadastros_influenciadores.find(c => c.id === rec.cadastro_id);
      return cadastro && plataformasSelecionadas.includes(cadastro.plataforma_id) && recTermino >= hojeTimestamp;
    });
  }, [todasRecargas, plataformasSelecionadas, hojeTimestamp, localInfluenciador]);
  
  const recargasHistorico = useMemo(() => {
    return todasRecargas.filter((rec) => {
      const recTermino = Date.parse(rec.termino);
      const cadastro = localInfluenciador?.cadastros_influenciadores.find(c => c.id === rec.cadastro_id);
      return cadastro && plataformasSelecionadas.includes(cadastro.plataforma_id) && recTermino < hojeTimestamp;
    });
  }, [todasRecargas, plataformasSelecionadas, hojeTimestamp, localInfluenciador]);
  
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
  }
}, [influenciador]);


// Gera uma imagem "random" baseada no nome (usando ui-avatars.com)
const fallbackImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(
  influenciador.nome
)}&background=random&color=fff`;


const totalAtingido = useMemo(() => {
  return todasRecargas.reduce(
    (sum, rec) => sum + Number(rec.atingido || 0),
    0
  );
}, [todasRecargas]);

const reembolsoPendente = useMemo(() => {
  return todasRecargas
    .filter((rec) => rec.reembolso_status === "pendente")
    .reduce(
      (sum, rec) => sum + Number(rec.reembolso || 0),
      0
    );
}, [todasRecargas]);

const totalDepositantes = useMemo(() => {
  return todasRecargas.reduce((sum, rec) => sum + (rec.depositantes_atingido || 0), 0);
}, [todasRecargas]);


  return (
    <>
<Dialog open={open} onOpenChange={(isOpen) => {
  if (!isOpen) {
    onClose(); // fecha quando clica fora ou no X
  }
}}><DialogContent size="xl">

        <div className="grid grid-cols-[35%_1fr] gap-8">
        <Button
  className={cn(
    "fixed bottom-6 right-6 z-50 flex items-center gap-2",
    isSaving ? "bg-transparent text-primary" : "bg-primary text-white"
  )}
  onClick={async () => {
    await handleCloseAndUpdate(false);
    await reloadInfluenciador();
    onClose();
    setIsSaving(false);
  }}
  disabled={isSaving}
  variant="default"
>
  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
  {isSaving ? "Salvando..." : "Salvar Alterações"}
</Button>




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
                  <Input id="nome" value={nome}   onChange={(e) => setNome(e.target.value)}/>
                </div>
                <div className="space-y-1.5">
  <Label htmlFor="instagram">Instagram</Label>
  <InputGroup>
    <InputGroupText
      className="cursor-pointer select-none"
      onClick={() => window.open(`https://instagram.com/${instagramHandle}`, "_blank")}
      onMouseEnter={() => setHoverInstagram(true)}
      onMouseLeave={() => setHoverInstagram(false)}
    >
      {hoverInstagram
        ? <ArrowRight className="w-4 h-4" />
        : <AtSign className="w-4 h-4" />
      }
    </InputGroupText>
    <Input
      id="instagram"
      value={instagramHandle}
      onChange={e => setInstagramHandle(e.target.value.replace(/^@/, ""))}
      placeholder="username"
    />
  </InputGroup>
</div>

              </div>
            </div>
            <div className="grid grid-cols-[57%_1fr] flex gap-2">
            <div className="space-y-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input
        id="cpf"
        value={cpf}
        onChange={e => setCpf(e.target.value)}
      />            </div>
            <div className="space-y-1.5">
              <Label htmlFor="chavepix">Chave Pix</Label>
              <Input
        id="chavepix"
        value={chavepix}
        onChange={e => setChavePix(e.target.value)}
      />            </div>
            </div>

            <div className="grid grid-cols-[57%_1fr] flex gap-2">
  
            <div className="space-y-1.5">
              <Label htmlFor="email">E-mail</Label>
              <Input
        id="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />            </div>
            <div className="space-y-1.5">
              <Label>Data de Cadastro</Label>
              <Input
  value={
    influenciador.data_cadastro
      ? format(new Date(influenciador.data_cadastro), "dd/MM/yyyy")
      : ""
  }
  readOnly
/>
            </div>
            </div>

            <div className="space-y-1.5">
              <Label>Status</Label>
              <div className="flex items-center gap-2">
  {/* 1) faz o select ocupar todo o espaço livre */}
  <div className="flex-1">
  <ShadSelect
  value={status}
  onValueChange={(value) => setStatus(value as Influenciador["status"])}
>  <SelectTrigger>
    <SelectValue placeholder="Selecione o status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="bronze">Bronze</SelectItem>
    <SelectItem value="prata">Prata</SelectItem>
    <SelectItem value="ouro">Ouro</SelectItem>
    <SelectItem value="diamante">Diamante</SelectItem>
    <SelectItem value="banido">Banido</SelectItem>
  </SelectContent>
</ShadSelect>
  </div>
  <div className="flex gap-4">



  {/* 2) só renderiza o botão de Motivo quando banido, sem ocupar espaço antes disso */}
  {status === "banido" && (
    <Button
      type="button"
      onClick={() => setOpenMotivo(true)}
      variant="ghost"
      className="text-xs px-2 py-1 border border-destructive text-destructive hover:bg-destructive hover:text-white"
    >
      <AlertCircle className="w-4 h-4 mr-1" />
      Motivo
    </Button>
  )}
</div>

            </div>

            <InnerDialog open={openMotivo} onOpenChange={setOpenMotivo}>
              <InnerContent>
                <div className="space-y-2">
                  <Label>Motivo do Banimento</Label>
                  <Textarea value={motivo_banimento} onChange={(e) => setmotivo_banimento(e.target.value)} placeholder="Descreva o motivo..." />
                </div>
              </InnerContent>
            </InnerDialog>
            <div className="grid grid-cols-[50%_1fr] flex gap-2">
            <div className="space-y-1.5 flex-1">
    <Label htmlFor="salario_fixo">Recebe salário fixo?</Label>
    <ShadSelect
      value={String(localInfluenciador?.salario_fixo ?? false)}
      onValueChange={(value) =>
        setLocalInfluenciador((prev) =>
          prev ? { ...prev, salario_fixo: value === "true" } : prev
        )
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">Sim</SelectItem>
        <SelectItem value="false">Não</SelectItem>
      </SelectContent>
    </ShadSelect>
  </div>
  <div className="space-y-1.5 flex-1">
    <Label htmlFor="contratado">Tem contrato com a KG?</Label>
    <ShadSelect
      value={String(localInfluenciador?.contratado ?? false)}
      onValueChange={(value) =>
        setLocalInfluenciador((prev) =>
          prev ? { ...prev, contratado: value === "true" } : prev
        )
      }
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="true">Sim</SelectItem>
        <SelectItem value="false">Não</SelectItem>
      </SelectContent>
    </ShadSelect>
  </div>
            </div>

</div>
{localInfluenciador?.salario_fixo && (
  <Button
    type="button"
    variant="outline"
    className="w-full"
    onClick={() => setModalSalariosOpen(true)}
  >
    Gerenciar Salários
  </Button>
)}
            <div className="space-y-1.5">
  <Label>Plataformas Cadastradas</Label>
  {plataformasSelecionadas.length === 0 ? (
    <div className="text-sm text-muted-foreground">
      Nenhuma plataforma cadastrada.
    </div>
  ) : (
    <div className="flex flex-wrap gap-2">
      {plataformasSelecionadas.map((plataformaId) => {
        const plataforma = plataformas.find(p => p.id === plataformaId);
        if (!plataforma) return null;
        function getPlataformaColor(cor: string) {
          return `bg-[${cor}] text-white border-[${cor}]`;
        }
        
        return (
          <motion.div
  key={plataformaId}
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
  className="flex items-center gap-2 px-3 py-1.5 rounded-md text-sm text-white border"
  style={{
    backgroundColor: plataforma.cor || "#6B7280", // fallback cinza caso não tenha cor
    borderColor: plataforma.cor || "#6B7280"
  }}
  >
  <span>{plataforma.nome}</span>
</motion.div>

        );
      })}
    </div>
  )}
</div>

            {/* Resumo de Performance do Influenciador */}
<div className="mt-6 p-4 rounded-md border bg-muted space-y-2 text-sm">
  <div className="flex justify-between">
  <span className="text-muted-foreground">Total de Recargas:</span>
  <span className="font-medium">{todasRecargas.length}</span>
</div>

<div className="flex justify-between">
  <span className="text-muted-foreground">Valor Total Atingido:</span>
  <span className="font-medium">
    R$ {Number(totalAtingido).toLocaleString('pt-BR')}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-muted-foreground">Reembolso Pendente:</span>
  <span className="font-medium">
    R$ {Number(reembolsoPendente).toLocaleString('pt-BR')}
  </span>
</div>

<div className="flex justify-between">
  <span className="text-muted-foreground">Total de Depositantes:</span>
  <span className="font-medium">
    {Number(totalDepositantes).toLocaleString('pt-BR')}
  </span>
</div>



  <div className="flex justify-between">
  <span className="text-muted-foreground">Última Recarga:</span>
  <span className="font-medium">
    {todasRecargas.length > 0
      ? new Date(
          todasRecargas.reduce((latest, rec) =>
            new Date(rec.inicio).getTime() > new Date(latest.inicio).getTime()
              ? rec
              : latest
          ).inicio
        ).toLocaleDateString('pt-BR')
      : "Sem recargas"}
  </span>
</div>

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
    <div className="flex justify-center items-center h-[565px] text-muted-foreground text-sm text-center">
  Sem recargas ativas no momento.
</div>  ) : (
    <>
      <div className="h-[500px] overflow-hidden">
        {atuaisPag.map((rec: any, idx: number) => (
          <RecargaCard
          key={idx}
          rec={rec}
          cadastro={localInfluenciador?.cadastros_influenciadores.find(c => c.id === rec.cadastro_id)}
          onUpdateRecarga={(updatedRecarga) => {
            if (!localInfluenciador) return;
            
            const novosCadastros = localInfluenciador.cadastros_influenciadores.map(cadastro => {
              if (cadastro.id === updatedRecarga.cadastro_id) {
                return {
                  ...cadastro,
                  recargas: cadastro.recargas.map(r =>
                    r.id === updatedRecarga.id ? updatedRecarga : r
                  )
                };
              }
              return cadastro;
            });
          
            setLocalInfluenciador({
              ...localInfluenciador,
              cadastros_influenciadores: novosCadastros,
            });
          }}
          
        />
        
        
        ))}
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
    <div className="flex items-center justify-center h-[565px] text-muted-foreground text-sm text-center">
      Nenhuma recarga no histórico.
    </div>
  ) : (
    <>
      <div className="h-[500px] overflow-hidden">
      {historicoPag.map((rec: any, idx: number) => (
       <RecargaCard
       key={idx}
       rec={rec}
       cadastro={localInfluenciador?.cadastros_influenciadores.find(c => c.id === rec.cadastro_id)}
       onUpdateRecarga={(updatedRecarga) => {
         if (!localInfluenciador) return;
         
         const novosCadastros = localInfluenciador.cadastros_influenciadores.map(cadastro => {
           if (cadastro.id === updatedRecarga.cadastro_id) {
             return {
               ...cadastro,
               recargas: cadastro.recargas.map(r =>
                 r.id === updatedRecarga.id ? updatedRecarga : r
               )
             };
           }
           return cadastro;
         });
       
         setLocalInfluenciador({
           ...localInfluenciador,
           cadastros_influenciadores: novosCadastros,
         });
       }}
       
     />
     
     
))}

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
    const cadastroExistente = influenciador.cadastros_influenciadores.find(
      (c) => c.id === novaRecarga.cadastro_id
    );
    
    let novosCadastros;
    
    if (cadastroExistente) {
      // Já existe → atualiza o cadastro
      novosCadastros = influenciador.cadastros_influenciadores.map((cadastro) => {
        if (cadastro.id === novaRecarga.cadastro_id) {
          return {
            ...cadastro,
            recargas: [...cadastro.recargas, novaRecarga],
          };
        }
        return cadastro;
      });
    } else {
      // Não existe → cria um novo cadastro
      novosCadastros = [
        ...influenciador.cadastros_influenciadores,
        {
          id: novaRecarga.cadastro_id,
          plataforma_id: novaRecarga.plataformaId,
          influenciador_id: influenciador.id,
          influenciador_plataforma_id: novaRecarga.plataformaInfluencerId || "",
          recargas: [novaRecarga],
        },
      ];
    }
    const influenciadorAtualizado = {
      ...influenciador,
      cadastros_influenciadores: novosCadastros,
    };

    // 1. Atualiza o influenciador principal
    onUpdate?.(influenciadorAtualizado);

    // 2. Atualiza o localInfluenciador no próprio modal!
    setLocalInfluenciador(influenciadorAtualizado);

    setRecargaModalOpen(false);
  }}
  selectedInfluenciador={influenciador}
/>
<SalariosMensaisModal
  open={modalSalariosOpen}
  onClose={() => setModalSalariosOpen(false)}
  salariosExistentes={localInfluenciador?.salarios_mensais || []}
  onSave={(novos) => {
    setLocalInfluenciador((prev) => {
      if (!prev) return prev;

      const existentes = prev.salarios_mensais || [];

      // Substitui salários do mesmo ano+mes com os novos
      const filtrados = existentes.filter(
        (s) => !novos.some(n => n.ano === s.ano && n.mes === s.mes)
      );

      return {
        ...prev,
        salarios_mensais: [...filtrados, ...novos],
      };
    });
  }}
/>



  </>
  
  );
};

export default InfluenciadorModal;
