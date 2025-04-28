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
import { InputProps as ShadInputProps } from "@/components/ui/input";

/**
 * formata número para moeda BRL com duas casas
 */
function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * converte string "1.234,56" em número 1234.56, tratando NaN como 0
 */
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

function CurrencyInput({
  value,
  onChange,
  ...rest
}: CurrencyInputProps) {
  const [display, setDisplay] = useState(formatCurrency(value));

  // atualiza o display sempre que o prop `value` mudar
  useEffect(() => {
    setDisplay(formatCurrency(value));
  }, [value]);

  return (
    <Input
      {...rest}
      value={display}
      // deixa o usuário digitar livremente
      onChange={(e) => setDisplay(e.target.value)}
      // só converte e formata ao sair do campo
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

export default function RecargaCard({
  rec,
  cadastro,
  onUpdateRecarga,
}: Props) {
  const plataforma = cadastro
    ? plataformas.find((p) => p.id === cadastro.plataforma_id)
    : undefined;
  const tipoMeta = rec.tipo; // "valor" ou "depositantes"

  // helper para atualizar apenas campos modificados
  const handleUpdate = (
    changes: Partial<Influenciador["recargas"][0]>
  ) => {
    onUpdateRecarga?.({ ...rec, ...changes });
  };

  return (
    <div className="border border-muted rounded-md m-2 p-4 space-y-3">
      {/* Cabeçalho */}
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

        {/* Status da meta */}
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

      {/* Grid com inputs */}
      <div className="grid grid-cols-3 gap-4 text-sm">
        {/* Salário */}
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

        {/* Campos de Depositantes (só para tipoMeta="depositantes") */}
        {tipoMeta === "depositantes" && (
          <>
            <div className="space-y-1.5">
              <Label>Meta (Depositantes)</Label>
              <Input
                type="number"
                value={
                  rec.depositantes_meta != null
                    ? rec.depositantes_meta
                    : ""
                }
                onChange={(e) =>
                  handleUpdate({
                    depositantes_meta:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Atingido (Depositantes)</Label>
              <Input
                type="number"
                value={
                  rec.depositantes_atingido != null
                    ? rec.depositantes_atingido
                    : ""
                }
                onChange={(e) =>
                  handleUpdate({
                    depositantes_atingido:
                      e.target.value === ""
                        ? undefined
                        : Number(e.target.value),
                  })
                }
              />
            </div>
          </>
        )}

        {/* Meta (R$) */}
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

        {/* Atingido (R$) */}
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

        {/* Reembolso (R$) */}
        <div className="space-y-1.5">
          <Label>Reembolso (R$)</Label>
          <InputGroup>
            <InputGroupText>R$</InputGroupText>
            <CurrencyInput
              value={rec.reembolso}
              onChange={(num) =>
                handleUpdate({
                  reembolso: num,
                  reembolso_status:
                    num > 0 ? "pendente" : "pago",
                })
              }
            />
          </InputGroup>
        </div>
      </div>
    </div>
  );
}
