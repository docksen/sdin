#!/usr/bin/env node

import 'utils/entry'
import pkg from '../../../package.json'
import { resolve } from 'path'
import { Command } from 'commander'
import { magenta, green } from 'utils/print'

const cmd = new Command()

const VERSION_INFO = `${magenta(pkg.name)} ${green(pkg.version)}`

const HELP_INFO = `
Package:
  name:         ${magenta(pkg.name)}
  version:      ${green(pkg.version)}
  license:      ${pkg.license}
  author:       ${pkg.author}
  description:  ${pkg.description}
`

cmd
  .command('create', 'Create project.', {
    executableFile: resolve(__dirname, './create.js')
  })
  .name(Object.keys(pkg.bin)[0])
  .version(VERSION_INFO, '-v, --version')
  .on('--help', () => console.log(HELP_INFO))
  .action(() => {})
  .parse(process.argv)
