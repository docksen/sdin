#!/usr/bin/env node

import 'utils/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { readSdinConfig } from 'core/config'
import { startSdinProject } from 'main/start'

interface SdinStartingCommandOptions {
  mode: string
}

const cmd = new Command('sdin start')

cmd
  .description('Start project.')
  .argument('[path]', 'Project path')
  .option('-m, --mode <startingMode>', 'Staring mode.')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const options: SdinStartingCommandOptions = {
    mode: cmd.getOptionValue('mode') || ''
  }
  const root = withWorkPath(path || '')
  const config = await readSdinConfig({ root })
  await startSdinProject({ config, mode: options.mode })
}
