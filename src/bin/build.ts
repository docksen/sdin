#!/usr/bin/env node

import 'tools/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { printHeader } from 'tools/print'
import { readSdinProject } from 'main/config'
import { buildSdinProject } from 'main/build'
import { splitBySeparator } from 'utils/string'

interface SdinBuildingCommandOptions {
  modules: string
}

const cmd = new Command('sdin build')

cmd
  .description('Build project.')
  .argument('[path]', 'Project path')
  .option('-m, --modules <moduleNames>', 'Module names (separate with commas).')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const options: SdinBuildingCommandOptions = {
    modules: cmd.getOptionValue('modules') || ''
  }
  const root = withWorkPath(path || '')
  const project = await readSdinProject({ root })
  printHeader(project)
  await buildSdinProject({ project, modules: splitBySeparator(options.modules) })
}
