'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'; // Seus componentes de UI
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import ReactSelectOption from '@/components/ui/ReactSelectOption'; // Seu componente de select
import { EventoFormData } from '@/lib/types'; // Seus tipos

// Interface para as opções do ReactSelectOption (deve corresponder ao que seu componente espera)
interface SelectOptionType {
  value: string;
  label: string;
  icon?: string; // Opcional, se seu ReactSelectOption suportar
}

// Interface para as plataformas disponíveis
interface PlataformaDisponivel {
  id: string;
  nome: string;
  // Outros campos da plataforma, se necessário para exibição, mas value/label são os principais
}

type EventoModalProps = {
  open: boolean;
  onClose: () => void;
  onSave: (evento: EventoFormData) => Promise<void>; // onSave agora é uma Promise para lidar com async
  evento?: EventoFormData | null; // Para edição. Use EventoFormData ou um tipo específico para edição se for diferente
  plataformasDisponiveis: PlataformaDisponivel[];
};

export function EventoModal({
  open,
  onClose,
  onSave,
  evento,
  plataformasDisponiveis,
}: EventoModalProps) {
  const [nome, setNome] = useState('');
  // const [descricao, setDescricao] = useState(''); // Descomente se reintroduzir a descrição
  const [data, setData] = useState(''); // Data do evento, formato YYYY-MM-DD
  const [plataformasSelecionadas, setPlataformasSelecionadas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Estado para feedback de carregamento

  useEffect(() => {
    if (open) {
      if (evento) {
        // Modo de edição
        setNome(evento.nome || '');
        // setDescricao(evento.descricao || ''); // Se houver descrição
        setData(evento.data ? evento.data.split('T')[0] : ''); // Formatar para YYYY-MM-DD se vier como ISOString
        setPlataformasSelecionadas(evento.plataformaIds || []);
      } else {
        // Modo de criação (novo evento)
        setNome('');
        // setDescricao('');
        setData('');
        setPlataformasSelecionadas([]);
      }
      setIsLoading(false); // Resetar loading state ao abrir/reabrir
    }
  }, [open, evento]);

  const handleSalvarClick = async () => {
    // Validação básica dos campos
    if (!nome.trim()) {
      alert('Por favor, informe o nome do evento.');
      return;
    }
    if (!data) {
      alert('Por favor, selecione a data do evento.');
      return;
    }
    if (plataformasSelecionadas.length === 0) {
      alert('Por favor, selecione pelo menos uma plataforma.');
      return;
    }

    setIsLoading(true); // Ativar feedback de carregamento

    const eventoFormData: EventoFormData = {
      id: evento?.id || undefined, // Enviar undefined se for novo, ou o ID para edição
      nome: nome.trim(),
      // descricao: descricao.trim(), // Se houver descrição
      data, // Formato "YYYY-MM-DD"
      plataformaIds: plataformasSelecionadas,
    };

    try {
      await onSave(eventoFormData); // Chamar a função onSave (que faz o fetch)
      // onClose(); // Fechar o modal é geralmente responsabilidade da página pai após sucesso ou no finally
    } catch (error) {
      // Erros de onSave (fetch) já devem ser tratados e alertados pela função onSave no componente pai.
      // Se quiser um tratamento adicional aqui, pode adicionar.
      console.error("Falha ao salvar evento (capturado no modal):", error);
    } finally {
      setIsLoading(false); // Desativar feedback de carregamento
    }
  };

  // Função para fechar o modal (controlado pelo Dialog)
  const handleDialogValidOpenChange = useCallback(
    (isOpen: boolean) => {
      if (!isOpen && !isLoading) { // Não fechar se estiver carregando
        onClose();
      }
    },
    [onClose, isLoading]
  );

  // Memoizar as opções para o ReactSelectOption
  const selectOptions: SelectOptionType[] = useMemo(() => {
    return (plataformasDisponiveis ?? []).map((p) => ({
      value: p.id,
      label: p.nome,
    }));
  }, [plataformasDisponiveis]);

  // Memoizar os objetos de valor atualmente selecionados para o ReactSelectOption
  const currentSelectedValueObjectsForSelect: SelectOptionType[] = useMemo(() => {
    return selectOptions.filter((option) =>
      plataformasSelecionadas.includes(option.value)
    );
  }, [selectOptions, plataformasSelecionadas]);

  return (
    <Dialog open={open} onOpenChange={handleDialogValidOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>
            {evento ? 'Editar Evento' : 'Cadastrar Novo Evento'}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="nome-evento">Nome do Evento</Label>
            <Input
              id="nome-evento"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Lançamento Especial"
              disabled={isLoading}
            />
          </div>

          {/* Se você quiser reintroduzir a descrição:
          <div>
            <Label htmlFor="descricao-evento">Descrição (Opcional)</Label>
            <Textarea // Ou Input, se preferir
              id="descricao-evento"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Detalhes sobre o evento..."
              disabled={isLoading}
            />
          </div>
          */}

          <div>
            <Label htmlFor="data-evento">Data do Evento</Label>
            <Input
              id="data-evento"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              disabled={isLoading}
            />
          </div>

          <div>
            <Label htmlFor="plataformas-evento">Plataformas</Label>
            <ReactSelectOption
              // Supondo que seu ReactSelectOption espera estas props
              options={selectOptions}
              value={currentSelectedValueObjectsForSelect}
              onChange={(selectedIds: string[]) => {
                setPlataformasSelecionadas(selectedIds);
              }}
              // Adicione outras props necessárias pelo seu ReactSelectOption (ex: placeholder, isMulti já está nele)
              // placeholder="Selecione as plataformas..."
              //isDisabled={isLoading} // Se o seu ReactSelectOption suportar isDisabled
            />
            {/* Para desabilitar o ReactSelectOption, você pode precisar passar uma prop `isDisabled={isLoading}`
                e garantir que seu componente ReactSelectOption a utilize para desabilitar o Select interno.
                Ex: <Select isDisabled={props.isDisabled} ... /> dentro de ReactSelectOption.tsx
            */}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="ghost"
              onClick={() => !isLoading && onClose()} // Não permitir fechar se estiver carregando
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleSalvarClick} disabled={isLoading}>
              {isLoading
                ? evento
                  ? 'Salvando Alterações...'
                  : 'Cadastrando...'
                : evento
                ? 'Salvar Alterações'
                : 'Cadastrar Evento'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}