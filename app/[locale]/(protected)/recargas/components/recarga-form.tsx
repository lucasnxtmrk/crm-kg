'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

type Plataforma = {
  id: string;
  nome: string;
};

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

  const [plataformas, setPlataformas] = useState<Plataforma[]>([]);

  useEffect(() => {
    const fetchPlataformas = async () => {
      try {
        const res = await fetch('/api/plataformas');
        const data = await res.json();
        setPlataformas(data);
      } catch (err) {
        console.error('Erro ao carregar plataformas:', err);
      }
    };

    fetchPlataformas();
  }, []);

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
        <Select
          value={form.plataformaId}
          onValueChange={(value) => setForm({ ...form, plataformaId: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a plataforma" />
          </SelectTrigger>
          <SelectContent>
            {plataformas.map((plataforma) => (
              <SelectItem key={plataforma.id} value={plataforma.id}>
                {plataforma.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
