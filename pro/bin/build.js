#!/usr/bin/env node

process.on('uncaughtException', error => console.error(error))
process.on('unhandledRejection', reason => console.error(reason))

const { build } = require('../script/build')
const { getRootPath } = require('../script/util/path')

main()

/**
 * 构建本项目代码
 */
function main() {
  build({
    root: getRootPath(),
    mode: 'production',
    alias: {
      bin: 'src/bin',
      config: 'src/config',
      core: 'src/core',
      main: 'src/main',
      plugin: 'src/plugin',
      tool: 'src/tool',
      util: 'src/util'
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
