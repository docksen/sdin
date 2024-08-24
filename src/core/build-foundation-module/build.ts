import { emptyDir } from 'fs-extra'
import { copyOtherFiles, buildSassFiles, buildScriptContentFiles } from './tasks'
import { cyan, green, magenta, printSuccess, yellow } from 'utils/print'
import { ms2s } from 'utils/unit'
import type { SdinConfig, SdinFoundationModule } from 'core/config'

export interface SdinFoundationModuleBuildingOptions {
  config: SdinConfig
  module: SdinFoundationModule
}

export async function buildSdinFoundationModule(
  options: SdinFoundationModuleBuildingOptions
): Promise<void> {
  const { config, module } = options
  const startTime = Date.now()
  await emptyDir(module.tar)
  await Promise.all([
    buildScriptContentFiles(config, module),
    buildSassFiles(config, module),
    copyOtherFiles(module)
  ])
  printSuccess(
    `Successfully built ${green(module.type)} ${magenta(module.mode)} module ${yellow(
      module.name
    )}, it took ${cyan(ms2s(Date.now() - startTime))} s.`
  )
}
