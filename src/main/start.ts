import { SdinProject } from 'configs/project'
import { checkSdinProject } from 'core/check-project'
import { startSdinApplicationModule } from 'core/start-application-module'
import { SdinStartingError } from 'tools/errors'
import { select } from 'utils/enquire'

const SUPPORTED_MODULE_TYPE = ['application']

export interface SdinProjectStartingOptions {
  /** Sdin 配置 */
  project: SdinProject
  /** 要启动的模块名称 */
  module?: string
}

export async function startSdinProject(options: SdinProjectStartingOptions): Promise<void> {
  const { project } = options
  await checkSdinProject({ project })
  const moduleName = await select({
    key: 'moduleName',
    value: options.module,
    title: 'which project module do you want to start?',
    options: project.modules.map(i => ({
      value: i.name,
      label: i.name,
      disabled: !SUPPORTED_MODULE_TYPE.includes(i.type)
    }))
  })
  const module = project.modules.find(i => i.name === moduleName)
  if (!module) {
    throw new SdinStartingError(SdinStartingError.MISSING_MODULE, 'Missing module.')
  }
  if (module.type === 'application') {
    await startSdinApplicationModule({ module })
  } else {
    throw new SdinStartingError(
      SdinStartingError.UNSUPPORTED_MODULE,
      `Unsupported module ${module.name} under starting command.`
    )
  }
}
