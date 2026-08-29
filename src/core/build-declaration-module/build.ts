import { emptyDir } from 'fs-extra'
import { buildTypeScriptSrcDeclarationFiles, buildTypeScriptContentFiles } from './tasks'
import { SdinDeclarationModule } from 'config/declaration-module'
import { printBuildingSuccess } from 'tool/print'

export interface SdinDeclarationModuleBuildingOptions {
  module: SdinDeclarationModule
}

export async function buildSdinDeclarationModule(
  options: SdinDeclarationModuleBuildingOptions
): Promise<void> {
  const { module } = options
  const startTime = Date.now()
  module.setEnv('pro')
  await emptyDir(module.tar)
  await Promise.all([
    buildTypeScriptSrcDeclarationFiles(module),
    buildTypeScriptContentFiles(module)
  ])
  printBuildingSuccess(module, startTime)
}
