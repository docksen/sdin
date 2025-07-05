import { emptyDir } from 'fs-extra'
import { createCompiler } from './compiler'
import { SdinIntegrationModule } from 'configs/integration-module'
import { compile, showStats } from 'tools/webpack'
import { printBuildingSuccess } from 'tools/print'
import { printTask } from 'utils/print'
import { Stats } from 'webpack'
import { SdinBuildingError } from 'tools/errors'

export interface SdinIntegrationModuleBuildingOptions {
  module: SdinIntegrationModule
  /** 不展示打包统计数据 */
  notShowStats?: boolean
}

export async function buildSdinIntegrationModule(
  options: SdinIntegrationModuleBuildingOptions
): Promise<void> {
  const { module, notShowStats } = options
  const startTime = Date.now()
  module.setEnv('pro')
  await emptyDir(module.tar)
  const compiler = createCompiler(module)
  await printTask({
    exitCode: SdinBuildingError.COMPILATION_FAILED,
    task: () => compile(compiler),
    loading: () => `Compiling module ${module.name}.`,
    reject: () => `Failed to compile module ${module.name}.`,
    resolve: (stats: Stats | undefined) => {
      showStats(stats, showDetails => {
        printBuildingSuccess(module, startTime)
        if (!notShowStats) {
          showDetails()
        }
      })
    }
  })
}
