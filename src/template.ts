import { schemaTemplate } from './templates/schemas.js'
import { apiQueriesTemplate } from './templates/api-queries.js'
import { apiMutationsTemplate } from './templates/api-mutations.js'
import { tableComponentTemplate, formComponentTemplate } from './templates/components.js'
import { pageTemplate, layoutTemplate } from './templates/pages.js'

// Helper functions for case transformations
const pascalCase = (str: string) => str.replace(/(?:^|[-_\s])(\w)/g, (_, char) => char.toUpperCase()).replace(/[-_\s]/g, '')
const camelCase = (str: string) => str.replace(/(?:^|[-_\s])(\w)/g, (_, char, index) => 
  index === 0 ? char.toLowerCase() : char.toUpperCase()).replace(/[-_\s]/g, '')
const kebabCase = (str: string) => str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase().replace(/[\s_]/g, '-')

export interface TemplateFile {
  path: string
  content: string
}

export function featureModuleTemplate(moduleName: string): TemplateFile[] {
  const Pascal = pascalCase(moduleName)
  const camel = camelCase(moduleName)
  const kebab = kebabCase(moduleName)

  return [
    // Schema
    {
      path: `_schemas/${Pascal}Schema.ts`,
      content: schemaTemplate(Pascal)
    },
    // API Queries
    {
      path: `_api/queries/${kebab}.queries.ts`,
      content: apiQueriesTemplate(Pascal, camel, kebab)
    },
    // API Mutations
    {
      path: `_api/mutations/${kebab}.mutations.ts`,
      content: apiMutationsTemplate(Pascal, camel, kebab)
    },
    // Table Component
    {
      path: `_components/${Pascal}Table.tsx`,
      content: tableComponentTemplate(Pascal, camel, kebab)
    },
    // Form Component
    {
      path: `_components/${Pascal}Form.tsx`,
      content: formComponentTemplate(Pascal, camel, kebab)
    },
    // Page Component
    {
      path: `page.tsx`,
      content: pageTemplate(Pascal, camel)
    },
    // Layout Component
    {
      path: `layout.tsx`,
      content: layoutTemplate(Pascal)
    },
  ]
}