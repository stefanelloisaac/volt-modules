export const tableComponentTemplate = (Pascal: string, camel: string, kebab: string) => `'use client'

import { useState } from 'react'
import { Eye, Edit, Trash2 } from 'lucide-react'
import { use${Pascal}List } from '../_api/queries/${kebab}.queries'
import { useDelete${Pascal} } from '../_api/mutations/${kebab}.mutations'
import type { ${Pascal} } from '../_schemas/${Pascal}Schema'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ConfirmationDialog } from '@/components/custom/ConfirmationDialog'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'

interface ${Pascal}TableProps {
  onView: (item: ${Pascal}) => void
  onEdit: (item: ${Pascal}) => void
}

export function ${Pascal}Table({ onView, onEdit }: ${Pascal}TableProps) {
  const [filters, setFilters] = useState({
    search: '',
    active: undefined as boolean | undefined,
  })
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data: ${camel}s = [], isLoading, error } = use${Pascal}List(filters)
  const delete${Pascal} = useDelete${Pascal}()

  const handleDelete = async () => {
    if (!deleteId) return
    
    try {
      await delete${Pascal}.mutateAsync(deleteId)
      setDeleteId(null)
    } catch (error) {
      console.error('Error deleting ${camel}:', error)
    }
  }

  const clearFilters = () => {
    setFilters({ search: '', active: undefined })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Erro ao carregar dados: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex-1">
          <Label htmlFor="search">Buscar</Label>
          <Input
            id="search"
            placeholder="Nome, descrição ou email..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <div className="flex items-center space-x-2">
          <Switch
            id="active-filter"
            checked={filters.active === true}
            onCheckedChange={(checked) => 
              setFilters(prev => ({ ...prev, active: checked ? true : undefined }))
            }
          />
          <Label htmlFor="active-filter">Apenas ativos</Label>
        </div>
        <Button variant="outline" onClick={clearFilters}>
          Limpar filtros
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {${camel}s.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  Nenhum ${camel} encontrado
                </TableCell>
              </TableRow>
            ) : (
              ${camel}s.map((${camel}) => (
                <TableRow key={${camel}.id}>
                  <TableCell className="font-medium">{${camel}.name}</TableCell>
                  <TableCell>{${camel}.description || '-'}</TableCell>
                  <TableCell>{${camel}.email || '-'}</TableCell>
                  <TableCell>{${camel}.phone || '-'}</TableCell>
                  <TableCell>
                    <Badge variant={${camel}.active ? 'default' : 'secondary'}>
                      {${camel}.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {${camel}.createdAt?.toLocaleDateString('pt-BR') || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onView(${camel})}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onEdit(${camel})}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setDeleteId(${camel}.id!)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Confirmation */}
      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        isPending={delete${Pascal}.isPending}
        variant="delete"
        title="Excluir ${Pascal}"
        description="Tem certeza que deseja excluir este ${camel}? Esta ação não pode ser desfeita."
      />
    </div>
  )
}`;

export const formComponentTemplate = (Pascal: string, camel: string, kebab: string) => `'use client'

import { User, Mail, Phone, FileText, ToggleLeft } from 'lucide-react'
import { useFormHook, type FormAction, type FormConfig } from '@/global/hooks/use-form'
import { useCreate${Pascal}, useUpdate${Pascal} } from '../_api/mutations/${kebab}.mutations'
import { ${Pascal}Schema, Create${Pascal}Schema, Update${Pascal}Schema, type ${Pascal} } from '../_schemas/${Pascal}Schema'

interface ${Pascal}FormProps {
  action: FormAction
  selectedItem?: ${Pascal}
  closeForm: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  asModal?: boolean
}

export function ${Pascal}Form(props: ${Pascal}FormProps) {
  const { action, selectedItem } = props
  
  const create${Pascal} = useCreate${Pascal}()
  const update${Pascal} = useUpdate${Pascal}()

  const config: FormConfig<${Pascal}> = {
    title: {
      create: 'Criar ${Pascal}',
      read: 'Visualizar ${Pascal}',
      update: 'Editar ${Pascal}',
    },
    description: {
      create: 'Preencha os dados abaixo para criar um novo ${camel}.',
      read: 'Visualize os dados do ${camel} selecionado.',
      update: 'Atualize os dados do ${camel} selecionado.',
    },
    schema: action === 'create' ? Create${Pascal}Schema : action === 'update' ? Update${Pascal}Schema : ${Pascal}Schema,
    gridCols: 2,
    fields: [
      {
        name: 'name' as any,
        label: 'Nome',
        type: 'text',
        placeholder: 'Digite o nome completo',
        icon: <User className="h-4 w-4" />,
        className: 'col-span-2',
      },
      {
        name: 'description' as any,
        label: 'Descrição',
        type: 'textarea',
        placeholder: 'Digite uma descrição opcional',
        icon: <FileText className="h-4 w-4" />,
        className: 'col-span-2',
        rows: 3,
      },
      {
        name: 'email' as any,
        label: 'Email',
        type: 'text',
        placeholder: 'email@exemplo.com',
        icon: <Mail className="h-4 w-4" />,
      },
      {
        name: 'phone' as any,
        label: 'Telefone',
        type: 'text',
        placeholder: '(11) 99999-9999',
        icon: <Phone className="h-4 w-4" />,
      },
      {
        name: 'active' as any,
        label: 'Ativo',
        type: 'switch',
        description: 'Define se o ${camel} está ativo no sistema',
        icon: <ToggleLeft className="h-4 w-4" />,
        className: 'col-span-2',
      },
    ],
    onSubmit: async (data, formAction) => {
      if (formAction === 'create') {
        await create${Pascal}.mutateAsync(data)
      } else if (formAction === 'update' && selectedItem?.id) {
        await update${Pascal}.mutateAsync({
          id: selectedItem.id,
          data: data,
        })
      }
    },
    isPending: create${Pascal}.isPending || update${Pascal}.isPending,
  }

  const { formComponent } = useFormHook({
    ...props,
    config,
  })

  return formComponent
}`;