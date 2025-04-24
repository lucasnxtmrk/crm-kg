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

interface PlataformaForm {
  id: string;
  nome: string;
  imagemUrl: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (plataforma: PlataformaForm) => void;
}

export default function PlataformasModal({ open, onClose, onSave }: Props) {
  // Estados do formulário
  const [form, setForm] = useState<PlataformaForm>({ id: "", nome: "", imagemUrl: "" });

  // Callback para fechar o dialog
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) onClose();
  }, [onClose]);

  // Evita render se estiver fechado
  if (!open) return null;

  // Envio do formulário
  const handleSubmit = () => {
    if (!form.id.trim() || !form.nome.trim()) return;
    onSave(form);
    onClose();
    // Reset opcional
    setForm({ id: "", nome: "", imagemUrl: "" });
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Adicionar Plataforma</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* ID da Plataforma */}
          <div className="space-y-1.5">
            <Label htmlFor="plataforma-id">ID</Label>
            <Input
              id="plataforma-id"
              placeholder="Ex: blaze"
              value={form.id}
              onChange={e => setForm({ ...form, id: e.target.value })}
            />
          </div>

          {/* Nome da Plataforma */}
          <div className="space-y-1.5">
            <Label htmlFor="plataforma-nome">Nome</Label>
            <Input
              id="plataforma-nome"
              placeholder="Ex: Blaze"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
            />
          </div>

          {/* URL da Imagem */}
          <div className="space-y-1.5">
            <Label htmlFor="plataforma-imagem">URL da Imagem</Label>
            <Input
              id="plataforma-imagem"
              placeholder="https://.../logo.png"
              value={form.imagemUrl}
              onChange={e => setForm({ ...form, imagemUrl: e.target.value })}
            />
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Adicionar Plataforma</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
