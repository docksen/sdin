const { resolve } = require('path')
const { mapValues } = require('lodash')
const { relativePosix } = require('../utils/path')
const { filterNotNil } = require('../utils/base')

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
  const aliasKeys = Object.keys(config.alias)
  if (aliasKeys.length <= 0) {
    return
  }
  const aliasMap = mapValues(config.alias, value => resolve(config.root, value))
  const resolvePath = (source, current) => {
    let matchedKey = ''
    for (let i = 0; i < aliasKeys.length; i++) {
      const key = aliasKeys[i]
      if (source.startsWith(key)) {
        matchedKey = key
        break
      }
    }
    if (!matchedKey) {
      return source
    }
    return relativePosix(
      current,
      resolve(config.root, source.replace(matchedKey, aliasMap[matchedKey]))
    )
  }
  return [
    resolve(config.root, 'node_modules/babel-plugin-module-resolver'),
    {
      resolvePath
    }
  ]
}

module.exports = {
  getBabelOptions
}
