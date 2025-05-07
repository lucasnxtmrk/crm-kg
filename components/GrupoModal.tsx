'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pencil } from 'lucide-react';
import Image from 'next/image';
import ReactSelectOption from "@/components/ui/ReactSelectOption";

interface Plataforma {
  id: string;
  nome: string;
  grupoId: string | null;
}

interface GrupoModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    id?: string;
    nome: string;
    imagem?: string;
    plataformasSelecionadas: string[]; // IDs das plataformas
  }) => void;
  grupoAtual?: {
    id: string;
    nome: string;
    imagem?: string;
    plataformas?: Plataforma[];
  } | null;
  plataformasDisponiveis: Plataforma[]; // todas plataformas do sistema
}

export default function GrupoModal({
  open,
  onClose,
  onSave,
  grupoAtual,
  plataformasDisponiveis,
}: GrupoModalProps) {
  const [nome, setNome] = useState('');
  const [imagemPreview, setImagemPreview] = useState<string | undefined>(undefined);
  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      if (grupoAtual) {
        setNome(grupoAtual.nome || '');
        setImagemPreview(grupoAtual.imagem || '');
  
        // Seleciona as plataformas que pertencem a este grupo
        const plataformasDoGrupo = plataformasDisponiveis
          .filter(p => p.grupoId === grupoAtual.id)
          .map(p => p.id);
  
        setPlataformasSelecionadas(plataformasDoGrupo);
      } else {
        setNome('');
        setImagemPreview(undefined);
        setPlataformasSelecionadas([]);
      }
    }
  }, [open, grupoAtual, plataformasDisponiveis]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagemPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleOpenChange = useCallback((isOpen: boolean) => {
    if (!isOpen) onClose();
  }, [onClose]);

  const handleSubmit = () => {
    if (!nome.trim()) return;
    onSave({
      id: grupoAtual?.id,
      nome,
      imagem: imagemPreview,
      plataformasSelecionadas,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{grupoAtual ? 'Editar Grupo' : 'Novo Grupo'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem */}
          <div className="relative w-full h-[160px] rounded-md overflow-hidden border">
            {imagemPreview ? (
              <Image src={imagemPreview} alt="Imagem Grupo" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center text-gray-500 text-sm">
                Sem imagem
              </div>
            )}
            <div
              className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center cursor-pointer transition"
              onClick={() => fileInputRef.current?.click()}
            >
              <Pencil className="w-6 h-6 text-white" />
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFotoChange}
            />
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label>Nome do Grupo</Label>
            <Input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite o nome do grupo"
            />
          </div>

          {/* Select múltiplo de plataformas */}
          <div className="space-y-2">
            <Label>Plataformas do Grupo</Label>
            <ReactSelectOption
            options={plataformasDisponiveis.map(p => ({ value: p.id, label: p.nome }))}
            value={plataformasDisponiveis
            .filter(p => plataformasSelecionadas.includes(p.id))
            .map(p => ({ value: p.id, label: p.nome }))
            }
  onChange={(selected) => setPlataformasSelecionadas(selected)}
/>

          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>{grupoAtual ? 'Salvar Alterações' : 'Cadastrar Grupo'}</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
