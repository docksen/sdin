#!/usr/bin/env node

import 'utils/entry'
import { resolve } from 'path'
import { Command } from 'commander'
import { getRootPath } from 'utils/path'
import { magenta, green } from 'utils/print'
import { readPackageInfo } from 'utils/npm'

const cmd = new Command()
const pkg = readPackageInfo(getRootPath(), true)

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
  .command('build', 'Build project.', {
    executableFile: resolve(__dirname, './build.js')
  })
  .command('test', 'Test project.', {
    executableFile: resolve(__dirname, './test.js')
  })
  .name(Object.keys(pkg.bin)[0])
  .version(VERSION_INFO, '-v, --version')
  .on('--help', () => console.log(HELP_INFO))
  .action(() => {})
  .parse(process.argv)
