"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select as ShadSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { v4 as uuidv4 } from "uuid";

import { CadastroInfluenciadorPlataforma, Influenciador, Plataforma } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (recarga: any) => void;
  selectedInfluenciador?: Influenciador;
}

export default function RecargasModal({
  open,
  onClose,
  onSave,
  selectedInfluenciador,
}: Props) {
  const { toast } = useToast();

  const [influenciadores, setInfluenciadores] = useState<Influenciador[]>([]);
  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);

  const [influenciadorId, setInfluenciadorId] = useState<string | null>(null);
  const [plataformaId, setPlataformaId]       = useState<string | null>(null);
  const [tipo, setTipo]                       = useState<"valor" | "depositantes">("valor");
  const [valor, setValor]                     = useState<number>(0);
  const [depositantes, setDepositantes]       = useState<number>(0);
  const [plataformaInfluencerId, setPlataformaInfluencerId] = useState<string>("");
  const [inicio, setInicio]                   = useState<Date>(new Date());
  const [termino, setTermino]                 = useState<Date>(new Date());

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Buscar dados reais apenas quando abrir
// 1) Resetar formulário e buscar dados reais ao abrir
useEffect(() => {
  if (open) {
    // ——— Reset de estado ———
    setIsSubmitting(false);
    setValor(0);
    setDepositantes(0);
    setPlataformaId(null);
    setInfluenciadorId(selectedInfluenciador?.id ?? null);

    // ——— Buscar influenciadores e plataformas da API ———
    const fetchData = async () => {
      try {
        const [infRes, platRes] = await Promise.all([
          fetch("/api/influenciadores"),
          fetch("/api/plataformas"),
        ]);
        if (!infRes.ok || !platRes.ok) {
          throw new Error("Resposta não OK");
        }
        setInfluenciadores(await infRes.json());
        setPlataformas(await platRes.json());
      } catch {
        toast({
          title: "Erro",
          description: "Falha ao carregar dados.",
          variant: "destructive",
        });
      }
    };

    fetchData();
  }
}, [open, selectedInfluenciador, toast]);

// 2) Ajusta o campo "ID na Plataforma" sempre que mudar influenciador ou plataforma
useEffect(() => {
  if (influenciadorId && plataformaId) {
    const inf =
      selectedInfluenciador ??
      influenciadores.find((i) => i.id === influenciadorId);
    const cadastro = inf?.cadastros_influenciadores.find(
      (c) => c.plataforma_id === plataformaId
    );
    setPlataformaInfluencerId(cadastro?.influenciador_plataforma_id || "");
  }
}, [influenciadorId, plataformaId, selectedInfluenciador, influenciadores]);

// 3) Garante que, ao fechar o Dialog, chamamos onClose corretamente
const handleOpenChange = useCallback(
  (isOpen: boolean) => {
    if (!isOpen) {
      // opcional: aqui poderíamos resetar mais campos, mas já fazemos isso no useEffect acima
      setIsSubmitting(false);
    }
    onClose();
  },
  [onClose]
);

// 4) Se o modal não estiver aberto, não renderiza nada
if (!open) return null;

// 5) Lógica de envio, igual antes, mas já com o guard do cadastro existindo
const handleSubmit = async () => {
  if (isSubmitting) return; // evita reentrância

  // validações básicas
  if (!influenciadorId || !plataformaId) {
    toast({
      title: "Erro",
      description: "Selecione influenciador e plataforma.",
      variant: "destructive",
    });
    return;
  }
  if (
    (tipo === "valor" && valor <= 0) ||
    (tipo === "depositantes" && depositantes <= 0)
  ) {
    toast({
      title: "Erro",
      description: "Preencha valor/depositantes.",
      variant: "destructive",
    });
    return;
  }

  setIsSubmitting(true);
  try {
    // encontra (ou preenche) o cadastro
    let inf =
      selectedInfluenciador ??
      influenciadores.find((i) => i.id === influenciadorId);
    if (!inf) throw new Error("Influenciador não encontrado.");

    let cadastro = inf.cadastros_influenciadores.find(
      (c) => c.plataforma_id === plataformaId
    );

    if (!cadastro) {
      const resp = await fetch("/api/cadastros_influenciadores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          influenciador_id: influenciadorId,
          plataforma_id: plataformaId,
          influenciador_plataforma_id: plataformaInfluencerId,
        }),
      });
      if (!resp.ok) throw new Error();
      cadastro = (await resp.json()) as CadastroInfluenciadorPlataforma;
    }

    // ——— guard: agora TS sabe que cadastro existe ———
    if (!cadastro) {
      throw new Error("Falha inesperada: cadastro indefinido.");
    }

    // monta o objeto da nova recarga
    const novaRecarga = {
      id: uuidv4(),
      cadastro_id: cadastro.id,
      inicio: inicio.toISOString(),
      termino: termino.toISOString(),
      salario: 0,
      meta: tipo === "valor" ? valor : 0,
      atingido: 0,
      reembolso: 0,
      depositantes_meta: tipo === "depositantes" ? depositantes : 0,
      depositantes_atingido: 0,
      tipo,
      status_meta: "incompleto",
      reembolso_status: "pendente",
    };

    // envia para a API de recargas
    const resp = await fetch("/api/recargas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaRecarga),
    });
    if (!resp.ok) throw new Error();

    toast({ title: "Sucesso", description: "Recarga criada!", variant: "default" });
    onSave(novaRecarga);
    onClose();
  } catch (error) {
    console.error(error);
    toast({
      title: "Erro",
      description: "Não foi possível criar recarga.",
      variant: "destructive",
    });
    setIsSubmitting(false);
  }
};


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg w-full">
        <DialogHeader>
          <DialogTitle>Adicionar Recarga</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Influenciador */}
          <div className="space-y-1.5">
            <Label>Influenciador</Label>
            <ShadSelect
              value={influenciadorId ?? ""}
              onValueChange={(v) => setInfluenciadorId(v || null)}
              disabled={!!selectedInfluenciador || isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {influenciadores.map((inf) => (
                  <SelectItem key={inf.id} value={inf.id}>
                    {inf.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadSelect>
          </div>

          {/* Plataforma */}
          <div className="space-y-1.5">
            <Label>Plataforma</Label>
            <ShadSelect
              value={plataformaId ?? ""}
              onValueChange={(v) => setPlataformaId(v || null)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {plataformas.map((pl) => (
                  <SelectItem key={pl.id} value={pl.id}>
                    {pl.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadSelect>
          </div>

          {/* Tipo de Meta */}
          <div className="space-y-1.5">
            <Label>Tipo de Meta</Label>
            <ShadSelect
              value={tipo}
              onValueChange={(v) => setTipo(v as any)}
              disabled={isSubmitting}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="valor">Recarga em R$</SelectItem>
                <SelectItem value="depositantes">Depositantes</SelectItem>
              </SelectContent>
            </ShadSelect>
          </div>

          {/* Valor ou Depositantes */}
          {tipo === "valor" ? (
            <div className="space-y-1.5">
              <Label>Valor da Recarga</Label>
              <InputGroup>
                <InputGroupText>R$</InputGroupText>
                <Input
                  type="number"
                  value={valor || ""}
                  onChange={(e) => setValor(Number(e.target.value))}
                  disabled={isSubmitting}
                />
              </InputGroup>
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label>Quantidade de Depositantes</Label>
              <Input
                type="number"
                value={depositantes || ""}
                onChange={(e) => setDepositantes(Number(e.target.value))}
                disabled={isSubmitting}
              />
            </div>
          )}

          {/* ID na Plataforma */}
          <div className="space-y-1.5">
            <Label>ID na Plataforma</Label>
            <Input
              type="text"
              value={plataformaInfluencerId}
              onChange={(e) => setPlataformaInfluencerId(e.target.value)}
              placeholder="Auto (editável)"
              disabled={isSubmitting}
            />
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-xs text-left justify-start"
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(inicio, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={inicio}
                    onSelect={(d) => d && setInicio(d)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-1.5">
              <Label>Término</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full text-xs text-left justify-start"
                    disabled={isSubmitting}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(termino, "dd/MM/yyyy")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={termino}
                    onSelect={(d) => d && setTermino(d)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Enviando…" : "Adicionar Recarga"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
