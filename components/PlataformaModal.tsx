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
import { Pencil, Trash2 } from 'lucide-react';
import Image from 'next/image';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface PlataformaModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: { id?: string; nome: string; imagem?: string; cor: string }) => void;
  onDelete?: () => void; // 👈 nova prop opcional
  plataformaAtual?: {
    id: string;
    nome: string;
    imagem?: string;
    cor: string;
  } | null;
}

export default function PlataformaModal({
  open,
  onClose,
  onSave,
  onDelete,
  plataformaAtual,
}: PlataformaModalProps) {
  const [nome, setNome] = useState('');
  const [cor, setCor] = useState('#000000'); // cor padrão: preto
  const [imagemPreview, setImagemPreview] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    if (open && plataformaAtual) {
      setNome(plataformaAtual.nome);
      setImagemPreview(plataformaAtual.imagem);
      setCor(plataformaAtual.cor || '#000000');
    } else if (open) {
      setNome('');
      setImagemPreview(undefined);
      setCor('#000000');
    }
  }, [open, plataformaAtual]);

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. Verificar o tipo da imagem
      const tiposPermitidos = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!tiposPermitidos.includes(file.type)) {
        alert('Formato inválido. Apenas PNG, JPG ou JPEG são permitidos.');
        return;
      }
  
      // 2. Verificar o tamanho da imagem
      const tamanhoMaximo = 6 * 1024 * 1024; // 6MB
      if (file.size > tamanhoMaximo) {
        alert('Imagem muito grande. O tamanho máximo permitido é 6MB.');
        return;
      }
  
      // 3. Se passou nas validações, carregar a imagem
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
      id: plataformaAtual?.id,
      nome,
      imagem: imagemPreview,
      cor,
    });

    onClose();
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>{plataformaAtual ? 'Editar Plataforma' : 'Nova Plataforma'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Imagem grande no topo */}
          <div className="relative w-full h-[160px] rounded-md overflow-hidden border">
            {imagemPreview ? (
              <Image src={imagemPreview} alt="Imagem Plataforma" fill className="object-cover" />
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

          {/* Nome da plataforma e Cor */}
          <div className="flex gap-4">
  <div className="flex-1 space-y-2" style={{ flexBasis: '65%' }}>
    <Label>Nome da Plataforma</Label>
    <Input
      value={nome}
      onChange={(e) => setNome(e.target.value)}
      placeholder="Digite o nome da plataforma"
    />
  </div>

  <div className="flex-shrink-0 space-y-2" style={{ flexBasis: '25%' }}>
    <Label>Cor</Label>
    <Input
      type="color"
      value={cor}
      onChange={(e) => setCor(e.target.value)}
      className="h-10 p-1"
    />
  </div>
</div>
          {/* Botões */}
          <div className="flex justify-between gap-2 pt-2">
            {plataformaAtual && (
  <div className="flex justify-start">
    <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button
      variant="default"
      style={{ backgroundColor: '#870D0E' }}
      className="flex gap-1 items-center"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Deseja realmente excluir esta plataforma?</AlertDialogTitle>
      <AlertDialogDescription>
        Essa ação não pode ser desfeita. A plataforma será permanentemente removida do sistema.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancelar</AlertDialogCancel>
      <AlertDialogAction
        className="bg-destructive hover:bg-destructive/90"
        onClick={async () => {
          const response = await fetch(`/api/plataformas/${plataformaAtual?.id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
  if (onDelete) onDelete(); // 👈 atualiza a lista no front
  onClose();
} else {
  alert('Erro ao excluir plataforma.');
}
        }}
      >
        Confirmar
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
  </div>
)}
<div className='flex justify-end gap-2'>
  <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              {plataformaAtual ? 'Salvar Alterações' : 'Cadastrar Plataforma'}
            </Button>
</div>
            
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
