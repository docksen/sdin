import { SdinConfig } from 'core/config'
import { buildSdinDefinedModule } from 'core/build-defined-module'
import { buildSdinCompiledModule } from 'core/build-compiled-module'
import { buildSdinPackagedModule } from 'core/build-packaged-module'

export interface BuildSdinProjectOptions {
  /** Sdin 配置 */
  config: SdinConfig
  /** 要构建的模块名称 */
  moduleNames?: string[]
}

export async function buildSdinProject(options: BuildSdinProjectOptions): Promise<void> {
  const { config } = options
  const moduleNames = options.moduleNames || []
  const modules =
    moduleNames.length === 0
      ? config.modules
      : config.modules.filter(i => moduleNames.includes(i.name))
  for (const module of modules) {
    if (module.type === 'defined') {
      await buildSdinDefinedModule({ config, module })
    } else if (module.type === 'compiled') {
      await buildSdinCompiledModule({ config, module })
    } else if (module.type === 'packaged') {
      await buildSdinPackagedModule({ config, module })
    }
  }
}
