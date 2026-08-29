#!/usr/bin/env node

import 'src/tool/entry'
import { Command } from 'commander'
import { withWorkPath } from 'util/path'
import { printHeader } from 'src/tool/print'
import { readSdinProject } from 'main/config'
import { playSdinProject } from 'main/play'

const cmd = new Command('sdin play')

cmd
  .description('Play project.')
  .argument('[path]', 'Project path')
  .action(action)
  .parse(process.argv)

async function action(path?: string) {
  const root = withWorkPath(path || '')
  const project = await readSdinProject({ root })
  printHeader(project)
  await playSdinProject({ project })
}
