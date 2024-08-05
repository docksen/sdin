import { resolve } from 'path'
import { mapValues } from 'lodash'
import { PluginItem } from '@babel/core'
import { relativePosix, withRootPath } from 'utils/path'
import { SdinFoundationModule, SdinConfig } from 'core/config'
import { filterNotNil } from 'utils/array'
import { executeCode } from 'utils/string'

/**
 * 获取Babel配置
 */
export function getBabelOptions(config: SdinConfig, module: SdinFoundationModule): any {
  const presets: PluginItem[] = [
    [
      withRootPath('node_modules/@babel/preset-env'),
      {
        modules: module.mode === 'cjs' ? 'cjs' : false,
        targets: ['>= 0.2%', 'not dead', 'node >= 16']
      }
    ],
    withRootPath('node_modules/@babel/preset-react'),
    withRootPath('node_modules/@babel/preset-typescript')
  ]
  const variables = mapValues(module.definitions, value => executeCode(value))
  const plugins: PluginItem[] = filterNotNil([
    createBabelModuleAliasPlugin(config),
    [withRootPath('node_modules/babel-plugin-transform-define'), variables],
    withRootPath('node_modules/@babel/plugin-transform-runtime')
  ])
  return { presets, plugins }
}

/**
 * 获取自定义模块别名Babel插件
 */
function createBabelModuleAliasPlugin(config: SdinConfig): PluginItem | undefined {
  const aliasKeys = Object.keys(config.alias)
  if (aliasKeys.length <= 0) {
    return
  }
  const aliasMap = mapValues(config.alias, value => resolve(config.root, value))
  const resolvePath = (source: string, current: string) => {
    let matchedKey: string = ''
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
    withRootPath('node_modules/babel-plugin-module-resolver'),
    {
      resolvePath,
      alias: {
        '\\.s[ac]ss$': '.css'
      }
    }
  ]
}
