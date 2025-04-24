"use client";

import React, { useState, useCallback } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

import {
  Select as ShadSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import { Influenciador } from "@/lib/influenciadores";
import { plataformas } from "@/lib/data";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (recarga: {
    influenciadorId: string;
    plataformaId: string;
    valor: number;
    inicio: Date;
    termino: Date;
  }) => void;
  influenciadores: Influenciador[];
}

export default function RecargasModal({
  open,
  onClose,
  onSave,
  influenciadores,
}: Props) {
  // Estados locais
  const [influenciadorId, setInfluenciadorId] = useState<string | null>(null);
  const [plataformaId, setPlataformaId]       = useState<string | null>(null);
  const [valor, setValor]                     = useState<number>(0);
  const [inicio, setInicio]                   = useState<Date>(new Date());
  const [termino, setTermino]                 = useState<Date>(new Date());

  // Callback para fechar o Dialog apenas quando isOpen ficar false
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) onClose();
  }, [onClose]);

  // Impede renderização quando fechado
  if (!open) return null;

  // Envio do formulário
  const handleSubmit = () => {
    if (!influenciadorId || !plataformaId || valor <= 0) return;
    onSave({ influenciadorId, plataformaId, valor, inicio, termino });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        aria-describedby="descricao-recarga"
        className="max-w-lg w-full"
      >
        <DialogHeader>
          <DialogTitle>Adicionar Recarga</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Influenciador */}
          <div className="space-y-1.5">
            <Label>Influenciador</Label>
            <ShadSelect
              value={influenciadorId ?? ""}
              onValueChange={(val) => setInfluenciadorId(val || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione um influenciador" />
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
              onValueChange={(val) => setPlataformaId(val || null)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a plataforma" />
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

          {/* Valor */}
          <div className="space-y-1.5">
            <Label>Valor da Recarga</Label>
            <InputGroup>
              <InputGroupText>R$</InputGroupText>
              <Input
                type="number"
                value={valor}
                onChange={(e) => setValor(Number(e.target.value))}
              />
            </InputGroup>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Início</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    color="secondary"
                    variant="outline"
                    className="w-full text-xs justify-start text-left"
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
                  color="secondary"
                    variant="outline"
                    className="w-full text-xs justify-start text-left"
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
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Adicionar Recarga</Button>
          </div>
        </div>

        {/* Descrição para acessibilidade */}
        <p id="descricao-recarga" className="sr-only">
          Modal para adicionar nova recarga no sistema
        </p>
      </DialogContent>
    </Dialog>
  );
}
