#!/usr/bin/env node

import 'tools/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { printHeader } from 'tools/print'
import { readSdinProject } from 'main/config'
import { startSdinProject } from 'main/start'

interface SdinStartingCommandOptions {
  module: string
}

const cmd = new Command('sdin start')

cmd
  .description('Develop project.')
  .argument('[path]', 'Project path')
  .option('-m, --module <moduleName>', 'Module name.')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const options: SdinStartingCommandOptions = {
    module: cmd.getOptionValue('module') || ''
  }
  const root = withWorkPath(path || '')
  const project = await readSdinProject({ root })
  printHeader(project)
  await startSdinProject({ project, module: options.module })
}
