import { emptyDir } from 'fs-extra'
import { SdinProject } from 'configs/project'
import { buildSdinIntegrationModule } from 'core/build-integration-module'
import { SdinTestingError } from 'tools/errors'
import { execute } from 'utils/execute'
import { blue, printInfo } from 'utils/print'

export interface SdinProjectTestingOptions {
  /** Sdin 配置 */
  project: SdinProject
}

export async function testSdinProject(options: SdinProjectTestingOptions): Promise<void> {
  const { project } = options
  const { testing } = project
  if (!testing) {
    throw new SdinTestingError(SdinTestingError.MISSING_MODULE, 'Missing testing module.')
  }
  await emptyDir(testing.tar)
  await buildSdinIntegrationModule({ module: testing, notShowStats: true })
  printInfo(`Testing starts from ${blue(testing.src)}\n`)
  await execute(`node ${testing.getTarIndex()}`, data => {
    process.stdout.write(data)
  })
}
