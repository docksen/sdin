import { PluginItem } from '@babel/core'
import { withModulePath } from 'utils/path'
import { filterNotNone } from 'utils/array'
import { moduleAliasBabelPlugin } from 'plugins/babel-plugin-module-alias'
import { styleModuleBabelPlugin } from 'plugins/babel-plugin-style-module'
import { codeDefinitionBabelPlugin } from 'plugins/babel-plugin-code-definition'
import { SdinFoundationModule } from 'configs/foundation-module'

/**
 * 获取Babel配置
 */
export function getBabelOptions(module: SdinFoundationModule): any {
  return {
    presets: filterNotNone([
      getPresetEnvBabelPlugin(module),
      withModulePath('@babel/preset-react'),
      withModulePath('@babel/preset-typescript')
    ]),
    plugins: filterNotNone([
      getModuleAliasBabelPlugin(module),
      getStyleModuleBabelPlugin(module),
      getCodeDefinitionBabelPlugin(module),
      withModulePath('@babel/plugin-transform-runtime')
    ])
  }
}

function getPresetEnvBabelPlugin(module: SdinFoundationModule): PluginItem | undefined {
  return [
    withModulePath('@babel/preset-env'),
    {
      modules: module.mode === 'cjs' ? 'cjs' : false,
      targets: ['>= 0.2%', 'not dead', 'node >= 16']
    }
  ]
}

function getModuleAliasBabelPlugin(module: SdinFoundationModule): PluginItem | undefined {
  if (Object.keys(module.alias).length <= 0) {
    return
  }
  return [
    moduleAliasBabelPlugin,
    {
      root: module.root,
      alias: module.alias
    }
  ]
}

function getStyleModuleBabelPlugin(module: SdinFoundationModule): PluginItem | undefined {
  if (!module.sassModule) {
    return
  }
  return [
    styleModuleBabelPlugin,
    {
      styleImports: module.styleImports
    }
  ]
}

function getCodeDefinitionBabelPlugin(module: SdinFoundationModule): PluginItem | undefined {
  const macros = module.getMacros()
  if (Object.keys(macros).length <= 0) {
    return
  }
  return [
    codeDefinitionBabelPlugin,
    {
      definitions: macros
    }
  ]
}
