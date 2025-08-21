#!/usr/bin/env node

import { program } from 'commander'
import { createModule } from './create-module.js'

program
  .name('volt-modules')
  .description('CLI for creating Next.js App Router feature modules')
  .version('1.0.0')

program
  .command('init')
  .description('Create a new feature module')
  .option('-p, --path <path>', 'Path where to create the module', '.')
  .option('-d, --dry-run', 'Show what would be created without actually creating files')
  .action(createModule)

program.parse()