#!/usr/bin/env node

import 'utils/entry'
import { Command } from 'commander'
import { create } from 'main/create'
import { magenta } from 'utils/print'

const cmd = new Command('<%= commandName %> create')

cmd
  .description('Create project.')
  .argument('[name]', 'Project name.')
  .option('-o, --output <projectParentPath>', 'The path to store project.')
  .option('-t, --template <templateName>', 'Project template.')
  .action(action)
  .parse(process.argv)

interface <%= commandName %>CreatingCommandOptions {
  output: string
  template: string
}

async function action(name?: string) {
  const options: <%= commandName %>CreatingCommandOptions = {
    output: cmd.getOptionValue('output') || '',
    template: cmd.getOptionValue('template') || ''
  }
  console.log('The project name is ' + magenta(name || 'unknown'))
  console.log('The project config options is ' + JSON.stringify(options))
  await create(name || 'unknown')
}
