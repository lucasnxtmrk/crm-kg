'use client';

import React, { useState, useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
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
import { AtSign, ArrowRight, Pencil } from 'lucide-react';
import Image from "next/image";
import {
  Select as ShadSelect,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";


interface NewInfluenciadorModalProps {
  open: boolean;
  onClose: () => void;
  plataformaId: string;  // vindo da página mãe
}

export default function NewInfluenciadorModal({
  open,
  onClose,
  plataformaId,
}: NewInfluenciadorModalProps) {
  // estados para cada campo do form
  const [nome, setNome] = useState("");
  const [instagram, setInstagram] = useState("");
  const [hoverInstagram, setHoverInstagram] = useState(false);
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cpf, setCpf] = useState("");
  const [chavepix, setChavepix] = useState("");
  const [status, setStatus] = useState("");
  const [influenciadorPlatId, setInfluenciadorPlatId] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // limpa tudo quando abrir
  useEffect(() => {
    if (open) {
      setNome("");
      setInstagram("");
      setEmail("");
      setTelefone("");
      setCpf("");
      setChavepix("");
      setStatus("");
      setInfluenciadorPlatId("");
      setFotoPreview(undefined);
    }
  }, [open]);

  // preview da foto
  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  // fecha ao clicar fora
  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) onClose();
  }, [onClose]);
  
  // o POST único para criar influenciador + cadastro na plataforma
  const handleSubmit = async () => {
    if (!nome.trim() || !status || !influenciadorPlatId.trim()) {
      alert("Preencha nome, status e ID na plataforma");
      return;
    }
  
    const novoInfluId = uuidv4();
  
    const resp = await fetch("/api/influenciadores", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: novoInfluId,
        nome,
        imagem: fotoPreview,
        instagram,
        email,
        telefone,
        data_cadastro: new Date().toISOString().split("T")[0],
        cpf,
        chavepix,
        status,
        motivo_banimento: null,
  
        // campos para o nested create
        plataforma_id: plataformaId,
        influenciador_plataforma_id: influenciadorPlatId,
      }),
    });
  
    if (!resp.ok) {
      console.error("Falha ao criar influenciador:", await resp.text());
      alert("Erro ao criar influenciador. Veja console.");
      return;
    }
  
    onClose();
  };
  
  if (!open) return null;
  
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Novo Influenciador</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* FOTO + NOME */}
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border">
              {fotoPreview
                ? <Image src={fotoPreview} alt="Foto" fill className="object-cover"/>
                : <div className="w-full h-full bg-muted flex items-center justify-center text-white">+</div>
              }
              <div
                className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Pencil className="w-5 h-5 text-white"/>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFotoChange}
              />
            </div>
            <div className="flex-1 space-y-1">
              <Label>Nome</Label>
              <Input value={nome} onChange={e => setNome(e.target.value)} />
            </div>
          </div>

          {/* INSTAGRAM */}
          <div className="space-y-1">
            <Label>Instagram</Label>
            <InputGroup>
              <InputGroupText
                className="cursor-pointer select-none"
                onClick={() => window.open(`https://instagram.com/${instagram}`, "_blank")}
                onMouseEnter={() => setHoverInstagram(true)}
                onMouseLeave={() => setHoverInstagram(false)}
              >
                {hoverInstagram
                  ? <ArrowRight className="w-4 h-4"/>
                  : <AtSign className="w-4 h-4"/>
                }
              </InputGroupText>
              <Input
                value={instagram}
                onChange={e => setInstagram(e.target.value.replace(/^@/, ""))}
                placeholder="username"
              />
            </InputGroup>
          </div>

          {/* E-MAIL e TELEFONE */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>E-mail</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Telefone</Label>
              <Input type="tel" value={telefone} onChange={e => setTelefone(e.target.value)} />
            </div>
          </div>

          {/* CPF e PIX */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>CPF</Label>
              <Input value={cpf} onChange={e => setCpf(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Chave Pix</Label>
              <Input value={chavepix} onChange={e => setChavepix(e.target.value)} />
            </div>
          </div>

          {/* ID NA PLATAFORMA */}
          <div className="space-y-1">
            <Label>ID na Plataforma</Label>
            <Input
              value={influenciadorPlatId}
              onChange={e => setInfluenciadorPlatId(e.target.value)}
              placeholder="Ex: SEUNAME123"
            />
          </div>

          {/* STATUS */}
          <div className="space-y-1">
  <Label>Status</Label>
  <ShadSelect value={status} onValueChange={setStatus}>
    <SelectTrigger className="w-full">
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

          {/* BOTÕES */}
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
