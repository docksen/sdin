import { emptyDir } from 'fs-extra'
import { SdinProject } from 'config/project'
import { buildSdinIntegrationModule } from 'core/build-integration-module'
import { SdinTestingError } from 'src/tool/errors'
import { execute } from 'util/execute'
import { blue, printInfo } from 'util/print'

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
