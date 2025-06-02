#!/usr/bin/env node

import 'tools/entry'
import { Command } from 'commander'
import { withWorkPath } from 'utils/path'
import { printHeader } from 'tools/print'
import { readSdinProject } from 'main/config'
import { testSdinProject } from 'main/test'

const cmd = new Command('sdin test')

cmd
  .description('Test project.')
  .argument('[path]', 'Project path')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const root = withWorkPath(path || '')
  const project = await readSdinProject({ root })
  printHeader(project)
  await testSdinProject({ project })
}
