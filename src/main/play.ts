import { emptyDir } from 'fs-extra'
import { SdinProject } from 'config/project'
import { startSdinApplicationModule } from 'core/start-application-module'
import { SdinPlayingError } from 'src/tool/errors'
import { blue, printInfo } from 'util/print'

export interface SdinProjectPlayingOptions {
  /** Sdin 配置 */
  project: SdinProject
}

export async function playSdinProject(options: SdinProjectPlayingOptions): Promise<void> {
  const { project } = options
  const { playing } = project
  if (!playing) {
    throw new SdinPlayingError(SdinPlayingError.MISSING_MODULE, 'Missing playing module.')
  }
  await emptyDir(playing.tar)
  printInfo(`Playing starts from ${blue(playing.src)}`)
  await startSdinApplicationModule({ module: playing })
}
