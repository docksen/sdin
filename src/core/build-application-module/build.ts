import { emptyDir } from 'fs-extra'
import { SdinApplicationModule } from 'configs/application-module'
import { createCompiler } from './compiler'
import { copyAssetsFiles, createManifest } from './tasks'
import { compile, showStats } from 'tools/webpack'
import { printBuildingSuccess } from 'tools/print'
import { SdinBuildingError } from 'tools/errors'
import { printTask } from 'utils/print'
import { Stats } from 'webpack'

export interface SdinApplicationModuleBuildingOptions {
  module: SdinApplicationModule
}

export async function buildSdinApplicationModule(
  options: SdinApplicationModuleBuildingOptions
): Promise<void> {
  const { module } = options
  const startTime = Date.now()
  module.setEnv('pro')
  await emptyDir(module.tar)
  await createManifest(module)
  await copyAssetsFiles(module)
  const compiler = await createCompiler(module)
  await printTask({
    exitCode: SdinBuildingError.COMPILATION_FAILED,
    task: () => compile(compiler),
    loading: () => `Compiling module ${module.name}.`,
    reject: () => `Failed to compile module ${module.name}.`,
    resolve: (stats: Stats | undefined) => {
      showStats(stats, showDetails => {
        printBuildingSuccess(module, startTime)
        showDetails()
      })
    }
  })
}
