import { PluginItem } from '@babel/core'
import { withModulePath } from 'utils/path'
import { SdinConfig } from 'core/config'
import { filterNotNone } from 'utils/array'
import { moduleAliasBabelPlugin } from 'plugins/babel-plugin-module-alias'
import { styleModuleBabelPlugin } from 'plugins/babel-plugin-style-module'
import { codeDefinitionBabelPlugin } from 'plugins/babel-plugin-code-definition'

/**
 * 获取Babel配置
 */
export function getBabelOptions(config: SdinConfig): any {
  return {
    presets: filterNotNone([
      getPresetEnvBabelPlugin(),
      withModulePath('@babel/preset-react'),
      withModulePath('@babel/preset-typescript')
    ]),
    plugins: filterNotNone([
      getModuleAliasBabelPlugin(config),
      getStyleModuleBabelPlugin(),
      getCodeDefinitionBabelPlugin(config),
      withModulePath('@babel/plugin-transform-runtime')
    ])
  }
}

function getPresetEnvBabelPlugin(): PluginItem | undefined {
  return [
    withModulePath('@babel/preset-env'),
    {
      modules: 'cjs',
      targets: ['>= 0.2%', 'not dead', 'node >= 16']
    }
  ]
}

function getModuleAliasBabelPlugin(config: SdinConfig): PluginItem | undefined {
  const testing = config.testing
  if (Object.keys(testing.alias).length <= 0) {
    return
  }
  return [
    moduleAliasBabelPlugin,
    {
      root: config.root,
      alias: testing.alias
    }
  ]
}

function getStyleModuleBabelPlugin(): PluginItem | undefined {
  return [
    styleModuleBabelPlugin,
    {
      styleImports: true
    }
  ]
}

function getCodeDefinitionBabelPlugin(config: SdinConfig): PluginItem | undefined {
  const testing = config.testing
  if (Object.keys(testing.definitions).length <= 0) {
    return
  }
  return [
    codeDefinitionBabelPlugin,
    {
      definitions: testing.definitions
    }
  ]
}
