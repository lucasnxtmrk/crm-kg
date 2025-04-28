'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { plataformas } from '@/lib/data';
import { Influenciador } from '@/lib/types';

type Props = {
  onCancel: () => void;
};

export function RecargaForm({ onCancel }: Props) {
  const [form, setForm] = useState({
    influenciadorId: '',
    plataformaId: '',
    inicio: '',
    termino: '',
    valor: '',
    meta: '',
    atingido: '',
  });

  return (
    <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <Label>Influenciador</Label>
        <Input
          placeholder="ID ou nome do influenciador"
          value={form.influenciadorId}
          onChange={(e) => setForm({ ...form, influenciadorId: e.target.value })}
        />
      </div>

      <div>
        <Label>Plataforma</Label>
        <Input
          placeholder="ID da plataforma"
          value={form.plataformaId}
          onChange={(e) => setForm({ ...form, plataformaId: e.target.value })}
        />
      </div>

      <div>
        <Label>Início</Label>
        <Input type="date" value={form.inicio} onChange={(e) => setForm({ ...form, inicio: e.target.value })} />
      </div>

      <div>
        <Label>Término</Label>
        <Input type="date" value={form.termino} onChange={(e) => setForm({ ...form, termino: e.target.value })} />
      </div>

      <div>
        <Label>Valor Recarregado</Label>
        <Input
          type="number"
          value={form.valor}
          onChange={(e) => setForm({ ...form, valor: e.target.value })}
        />
      </div>

      <div>
        <Label>Meta</Label>
        <Input
          type="number"
          value={form.meta}
          onChange={(e) => setForm({ ...form, meta: e.target.value })}
        />
      </div>

      <div>
        <Label>Valor Atingido</Label>
        <Input
          type="number"
          value={form.atingido}
          onChange={(e) => setForm({ ...form, atingido: e.target.value })}
        />
      </div>

      <div className="col-span-full flex gap-2">
        <Button type="submit">Salvar</Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}