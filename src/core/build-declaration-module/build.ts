import { emptyDir } from 'fs-extra'
import { buildTypeScriptSrcDeclarationFiles, buildTypeScriptContentFiles } from './tasks'
import { ms2s } from 'utils/unit'
import { cyan, green, magenta, printSuccess, yellow } from 'utils/print'
import type { SdinConfig, SdinDeclarationModule } from 'core/config'

export interface SdinDeclarationModuleBuildingOptions {
  config: SdinConfig
  module: SdinDeclarationModule
}

export async function buildSdinDeclarationModule(
  options: SdinDeclarationModuleBuildingOptions
): Promise<void> {
  const { config, module } = options
  const startTime = Date.now()
  await emptyDir(module.tar)
  await Promise.all([
    buildTypeScriptSrcDeclarationFiles(module),
    buildTypeScriptContentFiles(config, module)
  ])
  printSuccess(
    `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
      module.name
    )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
  )
}
