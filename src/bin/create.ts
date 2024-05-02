#!/usr/bin/env node

import 'utils/entry'
import { resolve } from 'path'
import { Command } from 'commander'
import { CWD_PATH } from 'utils/path'
import { createSdinProject } from 'main/create'

const cmd = new Command('sdin create')

cmd
  .description('create project')
  .argument('[name]', 'Project name.')
  .option('-o, --output <projectParentPath>', 'The path to store project.')
  .option('-t, --template <templateName>', 'Project template.')
  .action(action)
  .parse(process.argv)

interface CreateCommandOptions {
  output: string
  template: string
}

async function action(name?: string) {
  const options: CreateCommandOptions = {
    output: cmd.getOptionValue('output') || '',
    template: cmd.getOptionValue('template') || ''
  }
  await createSdinProject({
    templateName: options.template,
    projectName: name,
    projectParentPath: resolve(CWD_PATH, options.output)
  })
}
