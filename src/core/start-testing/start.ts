import { emptyDir } from 'fs-extra'
import { copyOtherFiles, buildScriptContentFiles } from './tasks'
import { cyan, green, printSuccess } from 'utils/print'
import { ms2s } from 'utils/unit'
import { execute } from 'utils/execute'
import type { SdinConfig } from 'core/config'

export interface SdinTestingStartingOptions {
  config: SdinConfig
}

export async function startSdinTesting(options: SdinTestingStartingOptions): Promise<void> {
  const { config } = options
  const testing = config.testing
  const startTime = Date.now()
  await emptyDir(testing.tar)
  await Promise.all([buildScriptContentFiles(config), copyOtherFiles(config)])
  printSuccess(
    `Successfully built ${green('testing')} files, it took ${cyan(ms2s(Date.now() - startTime))} s.`
  )
  try {
    const command = `node ${testing.withTarPath(testing.entry)}`
    await execute(command, console.log)
  } catch (error: unknown) {
    console.error(error)
  } finally {
    await emptyDir(testing.tar)
  }
}
