export const apiQueriesTemplate = (Pascal: string, camel: string, kebab: string) => `import { useQuery } from '@tanstack/react-query'
import type { ${Pascal} } from '../../_schemas/${Pascal}Schema'

// Mock data - replace with your API calls
const mock${Pascal}Data: ${Pascal}[] = [
  {
    id: '1',
    name: 'João Silva',
    description: 'Desenvolvedor Full Stack',
    email: 'joao@example.com',
    phone: '(11) 99999-9999',
    active: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Maria Santos',
    description: 'Designer UX/UI',
    email: 'maria@example.com',
    phone: '(11) 88888-8888',
    active: true,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'Pedro Costa',
    description: 'Analista de Sistemas',
    email: 'pedro@example.com',
    phone: '(11) 77777-7777',
    active: false,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
]

export const ${camel}Keys = {
  all: ['${kebab}'] as const,
  lists: () => [...${camel}Keys.all, 'list'] as const,
  list: (filters: any) => [...${camel}Keys.lists(), { filters }] as const,
  details: () => [...${camel}Keys.all, 'detail'] as const,
  detail: (id: string) => [...${camel}Keys.details(), id] as const,
}

export function use${Pascal}List(filters?: { search?: string; active?: boolean }) {
  return useQuery({
    queryKey: ${camel}Keys.list(filters),
    queryFn: async (): Promise<${Pascal}[]> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filtered = mock${Pascal}Data
      
      if (filters?.search) {
        const search = filters.search.toLowerCase()
        filtered = filtered.filter(item =>
          item.name?.toLowerCase().includes(search) ||
          item.description?.toLowerCase().includes(search) ||
          item.email?.toLowerCase().includes(search)
        )
      }
      
      if (filters?.active !== undefined) {
        filtered = filtered.filter(item => item.active === filters.active)
      }
      
      return filtered
    },
  })
}

export function use${Pascal}(id: string) {
  return useQuery({
    queryKey: ${camel}Keys.detail(id),
    queryFn: async (): Promise<${Pascal}> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const item = mock${Pascal}Data.find(item => item.id === id)
      if (!item) {
        throw new Error('${Pascal} não encontrado')
      }
      
      return item
    },
    enabled: !!id,
  })
}
`;