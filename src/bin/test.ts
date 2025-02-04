#!/usr/bin/env node

import 'utils/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { readSdinConfig } from 'core/config'
import { testSdinProject } from 'main/test'

interface SdinTestingCommandOptions {
  suites: string
}

const cmd = new Command('sdin test')

cmd
  .description('Test project.')
  .argument('[path]', 'Project path')
  .option('-s, --suites [suiteNames]', 'suite Names (separate with commas).')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const options: SdinTestingCommandOptions = {
    suites: cmd.getOptionValue('suites') || ''
  }
  const root = withWorkPath(path || '')
  const config = await readSdinConfig({ root })
  const suiteNames = options.suites ? options.suites.split(',') : undefined
  await testSdinProject({ suiteNames, config })
}
