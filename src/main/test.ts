import { emptyDir } from 'fs-extra'
import { execute } from 'utils/execute'
import { buildSdinFoundationModule } from 'core/build-foundation-module'
import { SdinTestingError } from 'tools/errors'
import { SdinProject } from 'configs/project'
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
  try {
    await buildSdinFoundationModule({ module: testing })
    printInfo(`Testing starts from ${blue(testing.src)}\n`)
    await execute(`node ${testing.getIdxTar()}`, data => {
      process.stdout.write(data)
    })
  } finally {
    await emptyDir(testing.tar)
  }
}
