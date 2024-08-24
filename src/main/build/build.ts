import { SdinConfig } from 'core/config'
import { checkSdinProject } from 'core/check'
import { buildSdinFoundationModule } from 'core/build-foundation-module'
import { buildSdinIntegrationModule } from 'core/build-integration-module'
import { buildSdinDeclarationModule } from 'core/build-declaration-module'
import { blue, magenta, printInfo } from 'utils/print'

export interface SdinProjectBuildingOptions {
  /** Sdin 配置 */
  config: SdinConfig
  /** 要构建的模块名称 */
  moduleNames?: string[]
}

export async function buildSdinProject(options: SdinProjectBuildingOptions): Promise<void> {
  const { config } = options
  const pkg = config.pkg
  printInfo(`Project ${blue(pkg.name)}, version ${magenta(pkg.version)}.`)
  await checkSdinProject({ config })
  const moduleNames = options.moduleNames || []
  const modules =
    moduleNames.length === 0
      ? config.modules
      : config.modules.filter(i => moduleNames.includes(i.name))
  for (const module of modules) {
    if (module.type === 'foundation') {
      await buildSdinFoundationModule({ config, module })
    } else if (module.type === 'integration') {
      await buildSdinIntegrationModule({ config, module })
    } else if (module.type === 'declaration') {
      await buildSdinDeclarationModule({ config, module })
    }
  }
}
