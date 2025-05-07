'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PlusCircle, Loader2, Trash2, Pencil, ChevronLeft, ChevronRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import Image from 'next/image'

interface Participante {
  id: string
  influencer_id: string
  nome: string
  imagem: string
  atingido: number
  meta: number
}

interface InfluencerOption {
  id: string
  nome: string | null
  imagem: string | null
}

interface Props {
  participantes: Participante[]
  eventoId: string
  onUpdateParticipantes: () => void
}

export default function ListaParticipantesEvento({ participantes: initialParticipantes, eventoId, onUpdateParticipantes }: Props) {
  const [participantes, setParticipantes] = useState<Participante[]>(initialParticipantes)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [editingParticipant, setEditingParticipant] = useState<Participante | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [newInfluencerForm, setNewInfluencerForm] = useState({ influencer_id: '', meta: 0, atingido: 0 })
  const [isSaving, setIsSaving] = useState(false)
  const [availableInfluencers, setAvailableInfluencers] = useState<InfluencerOption[]>([])
  const [loadingInfluencers, setLoadingInfluencers] = useState(true)
  const [errorLoadingInfluencers, setErrorLoadingInfluencers] = useState<string | null>(null)
  const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] = useState(false)
  const [participantToDelete, setParticipantToDelete] = useState<Participante | null>(null)
  const [busca, setBusca] = useState('')
  const itemsPerPage = 10
  const [pageIndex, setPageIndex] = useState(0)
  const participantesFiltrados = participantes.filter(p =>
  p.nome.toLowerCase().includes(busca.toLowerCase())
)
const pageCount = Math.ceil(participantesFiltrados.length / itemsPerPage)
const paginated = participantesFiltrados.slice(
  pageIndex * itemsPerPage,
  pageIndex * itemsPerPage + itemsPerPage
)

  const table = {
    getPageOptions: () => Array.from({ length: pageCount }, (_, i) => i),
    getState: () => ({ pagination: { pageIndex } }),
    setPageIndex: (index: number) => setPageIndex(index),
    getCanPreviousPage: () => pageIndex > 0,
    getCanNextPage: () => pageIndex < pageCount - 1,
    previousPage: () => setPageIndex(p => Math.max(p - 1, 0)),
    nextPage: () => setPageIndex(p => Math.min(p + 1, pageCount - 1)),
  }

  useEffect(() => {
    const fetchInfluencers = async () => {
      try {
        setLoadingInfluencers(true)
        const res = await fetch('/api/influenciadores')
        const data = await res.json()
        const participantesIds = new Set(participantes.map(p => p.influencer_id))

const filtrados = data.filter((i: any) => !participantesIds.has(i.id))

setAvailableInfluencers(filtrados.map((i: any) => ({
  id: i.id,
  nome: i.nome,
  imagem: i.imagem,
})))
      } catch (err: any) {
        setErrorLoadingInfluencers(err.message)
      } finally {
        setLoadingInfluencers(false)
      }
    }
    fetchInfluencers()
  }, [participantes])

  const handleAddClick = () => {
    setModalMode('add')
    setEditingParticipant(null)
    setNewInfluencerForm({ influencer_id: '', meta: 0, atingido: 0 })
    setIsModalOpen(true)
  }

  const handleEditar = (p: Participante) => {
    console.log('Editando participante:', p)
    setModalMode('edit')
    setEditingParticipant(p)
    setNewInfluencerForm({ influencer_id: p.influencer_id, meta: p.meta, atingido: p.atingido })
    setIsModalOpen(true)
  }

  const handleCloseModal = (open: boolean) => {
    setIsModalOpen(open)
    if (!open) {
      setEditingParticipant(null)
      setNewInfluencerForm({ influencer_id: '', meta: 0, atingido: 0 })
      setModalMode('add')
    }
  }

  const handleSelectInfluencer = (value: string) => {
    setNewInfluencerForm(prev => ({ ...prev, influencer_id: value }))
  }

  const handleNewFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setNewInfluencerForm(prev => ({
      ...prev,
      [name]: +value,
    }))
  }

  const handleSave = async () => {
    if (modalMode === 'edit' && !editingParticipant?.id) {
      alert("Erro: Participante em edição não possui ID válido.")
      return
    }
    const { influencer_id, meta, atingido } = newInfluencerForm
    if (!influencer_id || isNaN(meta) || isNaN(atingido)) return

    const isDuplicate = participantes.some(p => p.influencer_id === influencer_id)
    if (modalMode === 'add' && isDuplicate) {
      alert('Este influenciador já participa deste evento.')
      return
    }

    setIsSaving(true)
    try {
      const method = modalMode === 'add' ? 'POST' : 'PATCH'
      const body = modalMode === 'add'
        ? newInfluencerForm
        : { participante_id: editingParticipant?.id, meta, atingido }

      const res = await fetch(`/api/eventos/${eventoId}/participantes`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()
      if (modalMode === 'add') {
        const info = availableInfluencers.find(i => i.id === influencer_id)
        const novo: Participante = {
          id: data.id,
          influencer_id,
          nome: info?.nome || 'Sem nome',
          imagem: info?.imagem || '',
          meta: data.meta,
          atingido: data.atingido,
        }
        setParticipantes(prev => [...prev, novo])
      } else {
        setParticipantes(prev =>
          prev.map(p => p.id === editingParticipant?.id
            ? { ...p, meta: data.meta, atingido: data.atingido }
            : p))
      }
      console.log("Enviando PATCH:", {
        participante_id: editingParticipant?.id,
        meta,
        atingido,
      })
      handleCloseModal(false)
      onUpdateParticipantes()
    } catch (err: any) {
      alert(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleStartDelete = (p: Participante) => {
    setParticipantToDelete(p)
    setIsConfirmDeleteDialogOpen(true)
  }

  const handleDeleteParticipant = async () => {
    if (!participantToDelete) return
    try {
      await fetch(`/api/eventos/${eventoId}/participantes/${participantToDelete.id}`, {
        method: 'DELETE',
      })
      setParticipantes(prev => prev.filter(p => p.id !== participantToDelete.id))
      onUpdateParticipantes()
      setIsConfirmDeleteDialogOpen(false)
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="bg-[#230621] min-h-[90vh] rounded-xl text-white p-6 w-full overflow-auto">
      <div className="flex justify-between items-center gap-4 flex-wrap mb-4">
        <h2 className="text-2xl font-semibold">🎯 Participantes do Evento</h2>
        <div className='flex justify-between items-center gap-4'>
        <Input
  placeholder="Filtrar pelo nome..."
  value={busca}
  onChange={(e) => setBusca(e.target.value)}
  className="max-w-xs"
/>
        <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
          <DialogTrigger asChild>
            
            <Button size="md" variant={"outline"} className="flex items-center gap-2 bg-white text-black">
              <PlusCircle className="h-4 w-4" /> Adicionar Influencer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{modalMode === 'add' ? 'Novo Participante' : 'Editar Participante'}</DialogTitle>
              <DialogDescription>
                Preencha os dados de meta e atingido para o influenciador
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <Label>Influenciador</Label>
              <Select
                onValueChange={handleSelectInfluencer}
                value={newInfluencerForm.influencer_id}
                disabled={modalMode === 'edit'}
              >
                <SelectTrigger>
                  {newInfluencerForm.influencer_id
                    ? availableInfluencers.find(i => i.id === newInfluencerForm.influencer_id)?.nome
                    : 'Selecione'}
                </SelectTrigger>
                <SelectContent>
                  {availableInfluencers.map((inf) => (
                    <SelectItem key={inf.id} value={inf.id}>
                      {inf.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Label>Meta</Label>
              <Input name="meta" type="number" value={newInfluencerForm.meta} onChange={handleNewFormChange} />
              <Label>Atingido</Label>
              <Input name="atingido" type="number" value={newInfluencerForm.atingido} onChange={handleNewFormChange} />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => handleCloseModal(false)}>Cancelar</Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {modalMode === 'add' ? 'Adicionar' : 'Atualizar'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-[#140512] text-white">
              <th className="px-4 py-2">Nome</th>
              <th className="px-4 py-2 text-center">Atingido</th>
              <th className="px-4 py-2 text-center">Meta</th>
              <th className="px-4 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map(p => (
              <tr key={p.id} className="border-b border-[#3f193c] hover:bg-[#441240]">
                <td className="px-4 py-1.5 align-middle">{p.nome}</td>
                <td className="px-4 py-1.5 text-center align-middle">{p.atingido}</td>
                <td className="px-4 py-1.5 text-center align-middle">{p.meta}</td>
                <td className="px-4 py-1.5 text-right align-middle">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="default" className='bg-transparent' onClick={() => handleEditar(p)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" className="bg-transparent hover:bg-red-700 text-white" onClick={() => handleStartDelete(p)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  Nenhum participante encontrado nesta página.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Paginação com botões numerados */}
        <div className="flex items-center justify-end py-4 px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="w-8 h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {table.getPageOptions().map((page, pageIndex) => (
              <Button
                key={`page-${pageIndex}`}
                onClick={() => table.setPageIndex(pageIndex)}
                size="icon"
                className="w-8 h-8"
                variant={table.getState().pagination.pageIndex === pageIndex ? 'default' : 'outline'}
              >
                {page + 1}
              </Button>
            ))}
            <Button
              variant="default"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="w-8 h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={isConfirmDeleteDialogOpen} onOpenChange={setIsConfirmDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Participante</AlertDialogTitle>
            <AlertDialogDescription>
              Deseja realmente excluir <strong>{participantToDelete?.nome}</strong> deste evento?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteParticipant}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

