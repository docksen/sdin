#!/usr/bin/env node

import 'tools/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { createProject } from 'main/create'

interface CreatingCommandOptions {
  output: string
  template: string
}

const cmd = new Command('<%= commandName %> create')

cmd
  .description('Create project.')
  .argument('[name]', 'Project name.')
  .option('-o, --output <projectParentPath>', 'The path to store project.')
  .option('-t, --template <templateName>', 'Project template.')
  .action(action)
  .parse(process.argv)

async function action(name?: string) {
  const options: CreatingCommandOptions = {
    output: cmd.getOptionValue('output') || '',
    template: cmd.getOptionValue('template') || ''
  }
  await createProject({
    templateName: options.template,
    projectName: name,
    projectParentPath: withWorkPath(options.output)
  })
}
