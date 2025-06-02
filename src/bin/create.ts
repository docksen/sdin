#!/usr/bin/env node

import 'tools/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { createSdinProject } from 'main/create'

interface SdinCreatingCommandOptions {
  output: string
  template: string
}

const cmd = new Command('sdin create')

cmd
  .description('Create project.')
  .argument('[name]', 'Project name.')
  .option('-o, --output <projectParentPath>', 'The path to store project.')
  .option('-t, --template <templateName>', 'Project template.')
  .action(action)
  .parse(process.argv)

async function action(name?: string) {
  const options: SdinCreatingCommandOptions = {
    output: cmd.getOptionValue('output') || '',
    template: cmd.getOptionValue('template') || ''
  }
  await createSdinProject({
    templateName: options.template,
    projectName: name,
    projectParentPath: withWorkPath(options.output)
  })
}
