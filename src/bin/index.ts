#!/usr/bin/env node

import 'utils/entry'
import { Command } from 'commander'
import { magenta, green } from 'utils/print'
import { SELF_PATH } from 'utils/path'
import { PackageInfo } from 'utils/npm'

const pkg: PackageInfo = require(SELF_PATH + '/package.json')
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
    executableFile: './create'
  })
  .command('build', 'Build project in production environment.', {
    executableFile: './build'
  })
  .name(Object.keys(pkg.bin)[0])
  .version(VERSION_INFO, '-v, --version')
  .on('--help', () => console.log(HELP_INFO))
  .parse(process.argv)
