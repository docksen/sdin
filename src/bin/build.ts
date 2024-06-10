#!/usr/bin/env node

import 'utils/entry'
import { resolve } from 'path'
import { Command } from 'commander'
import { CWD_PATH } from 'utils/path'
import { buildSdinProject } from 'main/build'
import { readSdinConfig } from 'core/config'

const cmd = new Command('sdin build')

cmd
  .description('create project')
  .argument('[path]', 'Project path')
  .option('-m, --modules [moduleNames]', 'Module names (separate with commas).')
  .action(action)
  .parse(process.argv)

interface CreateCommandOptions {
  modules: string
}

async function action(path?: string) {
  const options: CreateCommandOptions = {
    modules: cmd.getOptionValue('modules') || ''
  }
  const root = resolve(CWD_PATH, path || '')
  const config = await readSdinConfig({ root })
  const moduleNames = options.modules ? options.modules.split(',') : undefined
  await buildSdinProject({ moduleNames, config })
}
