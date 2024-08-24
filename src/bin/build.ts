#!/usr/bin/env node

import 'utils/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { readSdinConfig } from 'core/config'
import { buildSdinProject } from 'main/build'

interface SdinBuildingCommandOptions {
  modules: string
}

const cmd = new Command('sdin build')

cmd
  .description('Build project.')
  .argument('[path]', 'Project path')
  .option('-m, --modules [moduleNames]', 'Module names (separate with commas).')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const options: SdinBuildingCommandOptions = {
    modules: cmd.getOptionValue('modules') || ''
  }
  const root = withWorkPath(path || '')
  const config = await readSdinConfig({ root })
  const moduleNames = options.modules ? options.modules.split(',') : undefined
  await buildSdinProject({ moduleNames, config })
}
