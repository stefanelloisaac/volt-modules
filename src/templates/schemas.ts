export const schemaTemplate = (Pascal: string) => `import { z } from 'zod'

export const ${Pascal}Schema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
  active: z.boolean().default(true),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
})

export const Create${Pascal}Schema = ${Pascal}Schema.omit({ 
  id: true, 
  createdAt: true, 
  updatedAt: true 
})

export const Update${Pascal}Schema = Create${Pascal}Schema.partial()

export type ${Pascal} = z.infer<typeof ${Pascal}Schema>
export type Create${Pascal} = z.infer<typeof Create${Pascal}Schema>
export type Update${Pascal} = z.infer<typeof Update${Pascal}Schema>
`;