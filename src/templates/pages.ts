export const pageTemplate = (Pascal: string, camel: string) => `'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { usePage, EMPTY_ACTION } from '@/global/hooks/use-page'
import { ${Pascal}Table } from './_components/${Pascal}Table'
import { ${Pascal}Form } from './_components/${Pascal}Form'
import type { ${Pascal} } from './_schemas/${Pascal}Schema'

export default function ${Pascal}Page() {
  const [selectedItem, setSelectedItem] = useState<${Pascal} | undefined>()
  const [formAction, setFormAction] = useState<'create' | 'read' | 'update'>('create')
  const [isFormOpen, setIsFormOpen] = useState(false)

  const handleCreate = () => {
    setSelectedItem(undefined)
    setFormAction('create')
    setIsFormOpen(true)
  }

  const handleView = (item: ${Pascal}) => {
    setSelectedItem(item)
    setFormAction('read')
    setIsFormOpen(true)
  }

  const handleEdit = (item: ${Pascal}) => {
    setSelectedItem(item)
    setFormAction('update')
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setSelectedItem(undefined)
  }

  const { page } = usePage({
    title: '${Pascal}',
    persistTabs: false,
    tabs: [
      { value: 'list', label: 'Lista' },
    ] as const,
    actions: {
      list: {
        icon: <Plus className="mr-1 h-4 w-4" />,
        label: 'Novo',
        onClick: handleCreate,
      },
    },
    content: {
      list: (
        <${Pascal}Table
          onView={handleView}
          onEdit={handleEdit}
        />
      ),
    },
  })

  return (
    <div className="space-y-4">
      {page}
      
      <${Pascal}Form
        action={formAction}
        selectedItem={selectedItem}
        closeForm={closeForm}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        asModal={true}
      />
    </div>
  )
}`;

export const layoutTemplate = (Pascal: string) => `export default function ${Pascal}Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto p-6">
      <div className="space-y-6">
        {children}
      </div>
    </div>
  )
}`;