const { resolve } = require('path')
const { filterNotNil } = require('../utils/base')
const { moduleAliasBabelPlugin } = require('./plugin')

function getBabelOptions(options) {
  const { config, module } = options
  const presets = [
    [
      resolve(config.root, 'node_modules/@babel/preset-env'),
      {
        modules: module.mode === 'cjs' ? 'cjs' : false,
        targets: ['>= 0.2%, not dead', 'node >= 16']
      }
    ],
    resolve(config.root, 'node_modules/@babel/preset-typescript')
  ]
  const plugins = filterNotNil([
    createBabelModuleAliasPlugin(options),
    resolve(config.root, 'node_modules/@babel/plugin-transform-runtime')
  ])
  return { presets, plugins }
}

function createBabelModuleAliasPlugin(options) {
  const { config } = options
  if (Object.keys(config.alias).length <= 0) {
    return
  }
  return [
    moduleAliasBabelPlugin,
    {
      root: config.root,
      alias: config.alias
    }
  ]
}

module.exports = {
  getBabelOptions
}
