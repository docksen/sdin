#!/usr/bin/env node

import 'utils/entry'
import { Command } from 'commander'
import { green } from 'utils/print'
import { SELF_PATH } from 'utils/path'
import { PackageInfo } from 'utils/npm'

const pkg: PackageInfo = require(SELF_PATH + '/package.json')
const cmd = new Command()

const HELP_INFO = green(`
Package:
  name:        ${pkg.name}
  version:     ${pkg.version}
  license:     ${pkg.license}
  author:      ${pkg.author}
  description: ${pkg.description}
`)

cmd
  .command('create', 'create project', {
    executableFile: './create'
  })
  .command('build', 'build project to production line', {
    executableFile: './build'
  })
  .name(Object.keys(pkg.bin)[0])
  .version(pkg.name + ' ' + pkg.version, '-v, --version')
  .on('--help', () => console.log(HELP_INFO))
  .parse(process.argv)
