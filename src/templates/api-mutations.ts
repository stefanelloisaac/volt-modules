export const apiMutationsTemplate = (Pascal: string, camel: string, kebab: string) => `import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { ${Pascal}, Create${Pascal}, Update${Pascal} } from '../../_schemas/${Pascal}Schema'
import { ${camel}Keys } from '../queries/${kebab}.queries'

export function useCreate${Pascal}() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: Create${Pascal}): Promise<${Pascal}> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const new${Pascal}: ${Pascal} = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      console.log('Creating ${camel}:', new${Pascal})
      return new${Pascal}
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${camel}Keys.lists() })
    },
    onError: (error) => {
      console.error('Error creating ${camel}:', error)
    },
  })
}

export function useUpdate${Pascal}() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Update${Pascal} }): Promise<${Pascal}> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const updated${Pascal}: ${Pascal} = {
        id,
        name: data.name || '',
        description: data.description,
        email: data.email,
        phone: data.phone,
        active: data.active ?? true,
        updatedAt: new Date(),
        createdAt: new Date(), // This would come from existing data
      }
      
      console.log('Updating ${camel}:', updated${Pascal})
      return updated${Pascal}
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ${camel}Keys.lists() })
      queryClient.invalidateQueries({ queryKey: ${camel}Keys.detail(data.id!) })
    },
    onError: (error) => {
      console.error('Error updating ${camel}:', error)
    },
  })
}

export function useDelete${Pascal}() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Deleting ${camel}:', id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ${camel}Keys.lists() })
    },
    onError: (error) => {
      console.error('Error deleting ${camel}:', error)
    },
  })
}
`;