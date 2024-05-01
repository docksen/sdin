#!/usr/bin/env node

import 'utils/entry'
import { resolve } from 'path'
import { Command } from 'commander'
import { CWD_PATH } from 'utils/path'
import { createSdinProject } from 'main/create'

const cmd = new Command('sdin create')

cmd
  .description('create project')
  .argument('[name]', 'project name')
  .option('-p, --path <projectParentPath>', 'project parent path')
  .action(action)
  .parse(process.argv)

interface CreateCommandOptions {
  path: string
}

async function action(name?: string) {
  const options: CreateCommandOptions = {
    path: cmd.getOptionValue('path') || ''
  }
  await createSdinProject({
    templateName: '',
    projectName: name,
    projectParentPath: resolve(CWD_PATH, options.path)
  })
}
