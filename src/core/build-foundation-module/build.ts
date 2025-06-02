import { emptyDir } from 'fs-extra'
import { copyOtherFiles, buildSassFiles, buildScriptContentFiles } from './tasks'
import { SdinFoundationModule } from 'configs/foundation-module'
import { printBuildingSuccess } from 'tools/print'

export interface SdinFoundationModuleBuildingOptions {
  module: SdinFoundationModule
}

export async function buildSdinFoundationModule(
  options: SdinFoundationModuleBuildingOptions
): Promise<void> {
  const { module } = options
  const startTime = Date.now()
  module.setEnv('pro')
  await emptyDir(module.tar)
  await Promise.all([
    buildScriptContentFiles(module),
    buildSassFiles(module),
    copyOtherFiles(module)
  ])
  printBuildingSuccess(module, startTime)
}
