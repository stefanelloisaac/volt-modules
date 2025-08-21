import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import chalk from 'chalk'
import * as readline from 'readline/promises'
import { featureModuleTemplate } from './template.js'
import { useFormTemplate, usePageTemplate, useUserPreferencesTemplate } from './templates/hooks.js'
import { userPreferencesServiceTemplate } from './templates/services.js'
import { storageKeysTemplate } from './templates/constants.js'

interface CreateOptions {
  path: string
  dryRun?: boolean
}

interface TemplateFile {
  path: string
  content: string
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function getTemplateFiles(): TemplateFile[] {
  return [
    {
      path: 'hooks/use-form.tsx',
      content: useFormTemplate()
    },
    {
      path: 'hooks/use-page.tsx',
      content: usePageTemplate()
    },
    {
      path: 'hooks/use-user-preferences.ts',
      content: useUserPreferencesTemplate()
    },
    {
      path: 'services/user-preferences.ts',
      content: userPreferencesServiceTemplate()
    },
    {
      path: 'constants/storage-keys.ts',
      content: storageKeysTemplate()
    }
  ]
}

export async function createModule(options: CreateOptions) {
  try {
    // Ask about custom hooks
    const useHooks = await rl.question(chalk.blue('? ') + 'Do you want to include custom hooks? (y/N): ')
    const includeHooks = useHooks.toLowerCase().startsWith('y')
    
    // Ask for module name
    const moduleName = await rl.question(chalk.blue('? ') + 'Enter module name: ')
    
    if (!moduleName.trim()) {
      console.log(chalk.red('✗'), 'Module name is required')
      rl.close()
      return
    }
    
    console.log(chalk.blue('ℹ'), `Creating module "${moduleName}"`)
    
    // Create features directory and module directory
    const featuresPath = resolve(options.path, 'features')
    const targetPath = resolve(featuresPath, moduleName)
    
    if (existsSync(targetPath)) {
      console.log(chalk.red('✗'), `Directory "${targetPath}" already exists`)
      rl.close()
      return
    }

    let allFiles = featureModuleTemplate(moduleName)
    
    // Add template files if hooks are requested
    if (includeHooks) {
      const templateFiles = getTemplateFiles()
      allFiles = [...templateFiles, ...allFiles]
    }

    if (options.dryRun) {
      console.log(chalk.blue('ℹ'), 'DRY RUN - Files that would be created:')
      allFiles.forEach(file => {
        console.log(chalk.blue('ℹ'), `  ${join(targetPath, file.path)}`)
      })
      rl.close()
      return
    }

    // Create features directory
    if (!existsSync(featuresPath)) {
      mkdirSync(featuresPath, { recursive: true })
    }
    
    // Create module directory
    mkdirSync(targetPath, { recursive: true })

    for (const file of allFiles) {
      const filePath = join(targetPath, file.path)
      
      // Create directory if it doesn't exist
      const fileDir = join(filePath, '..')
      if (!existsSync(fileDir)) {
        mkdirSync(fileDir, { recursive: true })
      }
      
      writeFileSync(filePath, file.content)
      console.log(chalk.green('✓'), `Created: ${filePath}`)
    }

    console.log(chalk.green('✓'), `Module "${moduleName}" created successfully in features/${moduleName}`)
    console.log(chalk.blue('ℹ'), 'Next steps:')
    console.log(chalk.blue('ℹ'), `  1. Add route: import "./features/${moduleName}/${moduleName}"`)
    console.log(chalk.blue('ℹ'), `  2. Navigate to: /${moduleName}`)
    
  } catch (error) {
    console.error(chalk.red('✗'), 'Error creating module:', error)
  } finally {
    rl.close()
  }
}