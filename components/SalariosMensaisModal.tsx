'use client';

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select as ShadSelect,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";

import { SalarioMensal } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  anoInicial?: number;
  salariosExistentes?: SalarioMensal[];
  onSave: (novos: SalarioMensal[]) => void;
}

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro"
];

export default function SalariosMensaisModal({
  open,
  onClose,
  anoInicial,
  salariosExistentes = [],
  onSave
}: Props) {
  const anoAtual = new Date().getFullYear();
  const anoPadrao = anoInicial ?? anoAtual;

  const [anoSelecionado, setAnoSelecionado] = useState<number>(anoPadrao);
  const [valoresPorAno, setValoresPorAno] = useState<Record<number, { [mes: number]: string }>>({});

  const anosComDados = useMemo(() => {
    const anos = new Set<number>();
    salariosExistentes.forEach(s => anos.add(s.ano));
    anos.add(anoAtual);
    anos.add(anoAtual - 1);
    return Array.from(anos).sort((a, b) => b - a);
  }, [salariosExistentes]);

  useEffect(() => {
    if (!open) return;

    const novoEstado: Record<number, { [mes: number]: string }> = {};

    anosComDados.forEach(ano => {
      const salariosDoAno = salariosExistentes.filter(s => s.ano === ano);
      const valores: { [mes: number]: string } = {};
      salariosDoAno.forEach(s => {
        valores[s.mes] = String(s.valor);
      });
      novoEstado[ano] = valores;
    });

    setValoresPorAno(novoEstado);
  }, [open, salariosExistentes, anosComDados, anoAtual]);

  const handleChange = (mes: number, valor: string) => {
    setValoresPorAno(prev => ({
      ...prev,
      [anoSelecionado]: {
        ...prev[anoSelecionado],
        [mes]: valor
      }
    }));
  };

  const handleSalvar = () => {
    const valores = valoresPorAno[anoSelecionado] || {};

    const preenchidos: SalarioMensal[] = Object.entries(valores)
      .filter(([_, val]) => val.trim() !== "")
      .map(([mes, val]) => ({
        ano: anoSelecionado,
        mes: Number(mes),
        valor: parseFloat(val.replace(",", "."))
      }));

    onSave(preenchidos); // envia apenas os meses com valor
    onClose();
  };

  const valoresDoAnoAtual = valoresPorAno[anoSelecionado] || {};

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Salários por Mês</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1">
            <Label>Ano</Label>
            <ShadSelect
              value={String(anoSelecionado)}
              onValueChange={(val) => setAnoSelecionado(Number(val))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o ano" />
              </SelectTrigger>
              <SelectContent>
                {anosComDados.map((anoOp) => (
                  <SelectItem key={anoOp} value={String(anoOp)}>
                    {anoOp}
                  </SelectItem>
                ))}
              </SelectContent>
            </ShadSelect>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {meses.map((mes, idx) => (
              <div key={idx} className="space-y-1">
                <Label>{mes}</Label>
                <Input
                  type="number"
                  placeholder="R$"
                  value={valoresDoAnoAtual[idx + 1] || ""}
                  onChange={(e) => handleChange(idx + 1, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-2">
            <Button onClick={handleSalvar}>Salvar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
