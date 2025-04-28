'use client';

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MotivoBanimentoDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (motivo: string) => void;
}

export default function MotivoBanimentoDialog({ open, onClose, onConfirm }: MotivoBanimentoDialogProps) {
  const [motivo, setMotivo] = useState("");

  function handleConfirm() {
    onConfirm(motivo);
    setMotivo(""); // limpa
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="space-y-4">
          <Label>Motivo do Banimento</Label>
          <Textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Descreva o motivo..."
          />
          <Button className="w-full" onClick={handleConfirm}>
            Confirmar Banimento
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
