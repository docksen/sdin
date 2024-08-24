#!/usr/bin/env node

process.on('uncaughtException', error => console.error(error))
process.on('unhandledRejection', reason => console.error(reason))

const { build } = require('../scripts/build')
const { getRootPath } = require('../scripts/utils/path')

main()

function main() {
  build({
    root: getRootPath(),
    mode: 'production',
    alias: {
      bin: 'src/bin',
      core: 'src/core',
      main: 'src/main',
      plugins: 'src/plugins',
      utils: 'src/utils'
    },
    modules: [
      {
        type: 'foundation',
        name: 'camille',
        mode: 'cjs',
        src: 'src',
        tar: 'tar/cjs',
        uglify: true,
        minify: true,
        sourceMap: true,
        includes: [],
        excludes: []
      },
      {
        type: 'foundation',
        name: 'elise',
        mode: 'esm',
        src: 'src',
        tar: 'tar/esm',
        uglify: true,
        minify: true,
        sourceMap: true,
        includes: [],
        excludes: []
      },
      {
        type: 'declaration',
        name: 'diana',
        mode: 'dts',
        src: 'src',
        tar: 'tar/dts',
        includes: [],
        excludes: []
      }
    ]
  })
}
