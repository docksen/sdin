import { keyBy } from 'lodash'
import { SdinModule } from 'configs/module'
import { SdinProject } from 'configs/project'
import { checkSdinProject } from 'core/check-project'
import { buildSdinFoundationModule } from 'core/build-foundation-module'
import { buildSdinIntegrationModule } from 'core/build-integration-module'
import { buildSdinDeclarationModule } from 'core/build-declaration-module'
import { buildSdinApplicationModule } from 'core/build-application-module'

export interface SdinProjectBuildingOptions {
  /** Sdin 配置 */
  project: SdinProject
  /** 要构建的模块名称 */
  modules?: string[]
}

export async function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void> {
  const { project } = options
  await checkSdinProject({ project })
  let modules: SdinModule[] = project.modules
  if (options.modules && options.modules.length > 0) {
    const nameToModule = keyBy(project.modules, 'name')
    modules = options.modules.map(i => nameToModule[i]).filter(Boolean)
  }
  for (const module of modules) {
    if (module.type === 'foundation') {
      await buildSdinFoundationModule({ module })
    } else if (module.type === 'integration') {
      await buildSdinIntegrationModule({ module })
    } else if (module.type === 'declaration') {
      await buildSdinDeclarationModule({ module })
    } else if (module.type === 'application') {
      await buildSdinApplicationModule({ module })
    }
  }
}
