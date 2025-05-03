"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputGroup, InputGroupText } from "@/components/ui/input-group";
import {
  Select as ShadSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { plataformas } from "@/lib/data";
import Image from "next/image";
import { Influenciador } from "@/lib/types";

function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function parseCurrency(value: string): number {
  const clean = value.replace(/[^\d,.-]/g, "");
  const noThousand = clean.replace(/\./g, "");
  const normalized = noThousand.replace(/,/g, ".");
  const parsed = parseFloat(normalized);
  return isNaN(parsed) ? 0 : parsed;
}

type CurrencyInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange" | "color"
> & {
  value: number;
  onChange: (num: number) => void;
};

function CurrencyInput({ value, onChange, ...rest }: CurrencyInputProps) {
  const [display, setDisplay] = useState(formatCurrency(value));

  useEffect(() => {
    setDisplay(formatCurrency(value));
  }, [value]);

  return (
    <Input
      {...rest}
      value={display}
      onChange={(e) => setDisplay(e.target.value)}
      onBlur={() => {
        const num = parseCurrency(display);
        onChange(num);
        setDisplay(formatCurrency(num));
      }}
    />
  );
}

interface Props {
  rec: Influenciador["recargas"][0];
  cadastro?: Influenciador["cadastros_influenciadores"][0];
  onUpdateRecarga?: (updated: Influenciador["recargas"][0]) => void;
}

export default function RecargaCard({ rec, cadastro, onUpdateRecarga }: Props) {
  const plataforma = cadastro
    ? plataformas.find((p) => p.id === cadastro.plataforma_id)
    : undefined;
  const tipoMeta = rec.tipo;

  const handleUpdate = (changes: Partial<Influenciador["recargas"][0]>) => {
    const updated = { ...rec, ...changes };

    if (
      Object.prototype.hasOwnProperty.call(changes, "meta") ||
      Object.prototype.hasOwnProperty.call(changes, "atingido")
    ) {
      const diferenca = (updated.meta ?? 0) - (updated.atingido ?? 0);
      updated.reembolso = Math.max(diferenca, 0);
      updated.reembolso_status = updated.reembolso > 0 ? "pendente" : "pago";
    }

    onUpdateRecarga?.(updated);
  };

  return (
    <div className="border border-muted rounded-md m-2 p-4 space-y-3">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {plataforma?.imagem && (
            <Image
              src={plataforma.imagem}
              alt={plataforma.nome}
              width={64}
              height={32}
              className="rounded-md object-contain"
            />
          )}
          <div className="flex flex-col text-xs text-muted-foreground">
            <span>ID Influenciador:</span>
            <span className="font-semibold">
              {cadastro?.influenciador_plataforma_id || "Sem ID"}
            </span>
          </div>
        </div>

        <div className="w-40">
          <Label>Status da Meta</Label>
          <ShadSelect
            value={rec.status_meta}
            onValueChange={(value: "completo" | "incompleto") =>
              handleUpdate({ status_meta: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="completo">Meta Batida</SelectItem>
              <SelectItem value="incompleto">Meta Incompleta</SelectItem>
            </SelectContent>
          </ShadSelect>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm">
        <div className="space-y-1.5">
          <Label>Salário (R$)</Label>
          <InputGroup>
            <InputGroupText>R$</InputGroupText>
            <CurrencyInput
              value={rec.salario}
              onChange={(num) => handleUpdate({ salario: num })}
            />
          </InputGroup>
        </div>

        {tipoMeta === "depositantes" && (
          <>
            <div className="space-y-1.5">
              <Label>Meta (Depositantes)</Label>
              <Input
                type="number"
                value={rec.depositantes_meta ?? ""}
                onChange={(e) =>
                  handleUpdate({
                    depositantes_meta: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Atingido (Depositantes)</Label>
              <Input
                type="number"
                value={rec.depositantes_atingido ?? ""}
                onChange={(e) =>
                  handleUpdate({
                    depositantes_atingido: e.target.value === "" ? undefined : Number(e.target.value),
                  })
                }
              />
            </div>
          </>
        )}

        <div className="space-y-1.5">
          <Label>Meta (R$)</Label>
          <InputGroup>
            <InputGroupText>R$</InputGroupText>
            <CurrencyInput
              value={rec.meta}
              onChange={(num) => handleUpdate({ meta: num })}
            />
          </InputGroup>
        </div>

        <div className="space-y-1.5">
          <Label>Atingido (R$)</Label>
          <InputGroup>
            <InputGroupText>R$</InputGroupText>
            <CurrencyInput
              value={rec.atingido}
              onChange={(num) => handleUpdate({ atingido: num })}
            />
          </InputGroup>
        </div>

        <div className="space-y-1.5">
          <Label>Reembolso (R$)</Label>
          <InputGroup>
            <InputGroupText>R$</InputGroupText>
            <CurrencyInput
              value={rec.reembolso}
              onChange={(num) =>
                handleUpdate({
                  reembolso: num,
                  reembolso_status: num > 0 ? "pendente" : "pago",
                })
              }
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
