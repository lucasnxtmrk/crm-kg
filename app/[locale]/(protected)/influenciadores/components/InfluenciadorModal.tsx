"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { plataformas } from "@/lib/data";
import Image from "next/image";
import { Influenciador } from "@/lib/influenciadores";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef, useState } from "react";
import { Pencil } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  influenciador: Influenciador | null;
};

const InfluenciadorModal = ({ open, onClose, influenciador }: Props) => {
  if (!influenciador) return null;

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

  return (
    <Dialog open={open} onOpenChange={onClose}>
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
              <Select defaultValue={influenciador.status}>
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
              </Select>
            </div>
          </div>

          {/* 🔸 Coluna Direita - Plataformas */}
          <ScrollArea className="max-h-[400px] pr-2">
            <div className="flex flex-col gap-4">
              {influenciador.relacoes.map((rel) => {
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
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {plataforma?.imagem && (
                          <Image
                            src={plataforma.imagem}
                            alt={plataforma.nome}
                            width={24}
                            height={24}
                          />
                        )}
                        <span className="font-medium">
                          {plataforma?.nome || rel.plataformaId}
                        </span>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${statusClass}`}
                      >
                        {statusLabel}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-end text-sm">
                      <div className="space-y-1.5 flex-1 min-w-[80px]">
                        <Label>Meta</Label>
                        <Input type="number" defaultValue={rel.meta} />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-[80px]">
                        <Label>Atingido</Label>
                        <Input type="number" defaultValue={rel.atingido} />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-[80px]">
                        <Label>Reembolso</Label>
                        <Input type="number" defaultValue={rel.reembolso} />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-[80px]">
                        <Label>Superou Meta</Label>
                        <Input type="number" defaultValue={rel.superouMeta} />
                      </div>
                      <div className="space-y-1.5 flex-1 min-w-[80px]">
    <Label>Salário (R$)</Label>
    <Input type="number" defaultValue={rel.salario} />
  </div>
                      <div className="space-y-1.5 flex-1 min-w-[80px]">
    <Label>Início</Label>
    <Input type="date" defaultValue={rel.inicio} />
  </div>
  <div className="space-y-1.5 flex-1 min-w-[80px]">
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
