"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { plataformas } from "@/lib/data";
import Image from "next/image";
import { Influenciador } from "@/lib/influenciadores";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { components, OptionProps, GroupBase } from "react-select";
import { AlertCircle } from "lucide-react";
import { Dialog as InnerDialog, DialogContent as InnerContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";


interface OptionType {
  value: string;
  label: string;
  icon?: string; // futuro uso
}

type Props = {
    open: boolean;
    onClose: () => void;
    influenciador: Influenciador | null;
    onUpdate?: (updated: Influenciador) => void;
  };

  const InfluenciadorModal = ({ open, onClose, influenciador, onUpdate }: Props) => {
    if (!influenciador) return null;

  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<string[]>(
    influenciador.relacoes.map((rel) => rel.plataformaId)
  );

  const platformOptions: OptionType[] = plataformas.map((p) => ({
    value: p.id,
    label: p.nome,
  }));

  const selectedOptions = platformOptions.filter((opt) =>
    plataformasSelecionadas.includes(opt.value)
  );

  const [previewImage, setPreviewImage] = useState(influenciador.imagem);
  const inputFileRef = useRef<HTMLInputElement>(null);

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
  // Estado novo
const [status, setStatus] = useState(influenciador.status);
const [motivoBanimento, setMotivoBanimento] = useState(influenciador.motivoBanimento || "");
const [openMotivo, setOpenMotivo] = useState(false);

// Abre automaticamente se o status for alterado para "banido"
useEffect(() => {
  if (status === "banido") {
    setOpenMotivo(true);
  }
}, [status]);
const handleCloseAndUpdate = (openState: boolean) => {
    if (!openState) {
      if (!influenciador) return;
  
      const updated: Influenciador = {
        ...influenciador,
        status,
        motivoBanimento,
        imagem: previewImage,
        relacoes: influenciador.relacoes,
      };
  
      onUpdate?.(updated);
      onClose(); // fecha modal
    }
  };
  return (
<Dialog open={open} onOpenChange={handleCloseAndUpdate}>
<DialogContent size="full">
        <DialogHeader>
          <DialogTitle>Editar Influenciador</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-[35%_1fr] gap-8">
          {/* 🔹 Coluna Esquerda */}
          <div className="space-y-4">
            {/* Imagem + Nome/Instagram */}
            <div className="grid grid-cols-[auto_1fr] gap-4 items-start">
              <div className="relative w-24 h-24 group">
                <Image
                  src={previewImage || "/images/avatar/avatar-default.png"}
                  alt={influenciador.nome}
                  fill
                  className="rounded-full object-cover border"
                />
                <div
                  className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition"
                  onClick={() => inputFileRef.current?.click()}
                >
                  <Pencil className="text-white w-5 h-5" />
                </div>
                <input
                  ref={inputFileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="nome">Nome</Label>
                  <Input id="nome" defaultValue={influenciador.nome} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input id="instagram" defaultValue={influenciador.instagram} />
                </div>
              </div>
            </div>

            {/* Campos adicionais */}
            <div className="space-y-1.5">
              <Label htmlFor="cpf">CPF</Label>
              <Input id="cpf" defaultValue={influenciador.cpf} />
            </div>

            <div className="space-y-1.5">
              <Label>Data de Cadastro</Label>
              <Input value={influenciador.dataCadastro} readOnly />
            </div>

            <div className="space-y-1.5">
  <Label>Status</Label>
  <div className="flex items-center gap-2">
    <div className="w-[70%]">
      <ShadSelect defaultValue={status} onValueChange={setStatus}>
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
      <Button
        type="button"
        onClick={() => setOpenMotivo(true)}
        variant="ghost"
        className="w-[30%] text-xs px-2 py-1 border border-destructive text-destructive hover:bg-destructive hover:text-white transition"
>
        <AlertCircle className="w-4 h-4 mr-1" />
        Motivo
      </Button>
    )}
  </div>
</div>

{/* Modal interno para motivo do banimento */}
<InnerDialog open={openMotivo} onOpenChange={setOpenMotivo}>
  <InnerContent>
    <div className="space-y-2">
      <Label>Motivo do Banimento</Label>
      <Textarea
        placeholder="Descreva o motivo..."
        value={motivoBanimento}
        onChange={(e) => setMotivoBanimento(e.target.value)}
      />
    </div>
  </InnerContent>
</InnerDialog>

            {/* Novo campo com react-select estilizado */}
            <div className="space-y-1.5">
              <Label>Plataformas Ativas</Label>
              <Select
                isMulti
                closeMenuOnSelect={false}
                components={makeAnimated()}
                options={platformOptions}
                value={selectedOptions}
                onChange={(selected) =>
                  setPlataformasSelecionadas(selected.map((opt) => opt.value))
                }
                className="react-select"
                classNamePrefix="select"
                styles={{
                  option: (provided) => ({ ...provided, fontSize: "14px" }),
                  multiValueLabel: (base) => ({ ...base, fontWeight: 500 }),
                }}
              />
            </div>
          </div>

          {/* 🔸 Coluna Direita - Plataformas */}
          <ScrollArea className="max-h-[450px] pr-2">
            <div className="flex flex-col gap-4">
              {influenciador.relacoes
                .filter((rel) => plataformasSelecionadas.includes(rel.plataformaId))
                .map((rel) => {
                  const plataforma = plataformas.find((p) => p.id === rel.plataformaId);

                  const statusLabel =
                    rel.meta === 0 && rel.atingido === 0
                      ? "Meta indefinida"
                      : rel.atingido >= rel.meta
                      ? "Meta Batida"
                      : "Meta Pendente";

                  const statusClass =
                    rel.meta === 0 && rel.atingido === 0
                      ? "bg-muted text-muted-foreground"
                      : rel.atingido >= rel.meta
                      ? "bg-green-500 text-white"
                      : "bg-yellow-400 text-yellow-900";

                  return (
                    <div
                      key={rel.plataformaId}
                      className="border border-muted rounded-md p-4 space-y-3"
                    >
                      {/* 🔹 Logo e status */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {plataforma?.imagem && (
                            <Image
                              src={plataforma.imagem}
                              alt={plataforma.nome}
                              width={40}
                              height={40}
                              className="rounded"
                            />
                          )}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass}`}
                        >
                          {statusLabel}
                        </div>
                      </div>

                      {/* 🔸 Campos */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="space-y-1.5">
                          <Label>Meta</Label>
                          <Input type="number" defaultValue={rel.meta} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Atingido</Label>
                          <Input type="number" defaultValue={rel.atingido} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Reembolso</Label>
                          <Input type="number" defaultValue={rel.reembolso} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Salário (R$)</Label>
                          <Input type="number" defaultValue={rel.salario} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Início</Label>
                          <Input type="date" defaultValue={rel.inicio} />
                        </div>
                        <div className="space-y-1.5">
                          <Label>Término</Label>
                          <Input type="date" defaultValue={rel.fim} />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfluenciadorModal;
