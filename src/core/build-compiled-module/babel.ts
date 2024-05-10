import { resolve } from 'path'
import { mapValues } from 'lodash'
import { PluginItem } from '@babel/core'
import { SELF_PATH, relativePosix } from 'utils/path'
import { SdinCompiledModule, SdinConfig } from 'core/config'
import { filterNotNil } from 'utils/array'

/**
 * 获取Babel配置
 */
export function getBabelOptions(config: SdinConfig, module: SdinCompiledModule): any {
  const presets: PluginItem[] = [
    [
      resolve(SELF_PATH, 'node_modules/@babel/preset-env'),
      {
        modules: module.target === 'cjs' ? 'cjs' : false
      }
    ],
    resolve(SELF_PATH, 'node_modules/@babel/preset-react'),
    resolve(SELF_PATH, 'node_modules/@babel/preset-typescript')
  ]
  const plugins: PluginItem[] = filterNotNil([
    createBabelModuleAliasPlugin(config),
    resolve(SELF_PATH, 'node_modules/@babel/plugin-transform-runtime')
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
  return [resolve(SELF_PATH, 'node_modules/babel-plugin-module-resolver'), { resolvePath }]
}
