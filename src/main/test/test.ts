import { SdinConfig } from 'core/config'
import { testSdinUnitSuite } from 'core/test-unit-suite'
import { testSdinWebsiteSuite } from 'core/test-website-suite'
import { blue, magenta, printInfo } from 'utils/print'

export interface SdinProjectTestingOptions {
  /** Sdin 配置 */
  config: SdinConfig
  /** 测试时使用的模式名称 */
  suiteNames?: string[]
}

export async function testSdinProject(options: SdinProjectTestingOptions): Promise<void> {
  const { config } = options
  const pkg = config.pkg
  printInfo(`Project ${blue(pkg.name)}, version ${magenta(pkg.version)}.`)
  const suiteNames = options.suiteNames || []
  const suites =
    suiteNames.length === 0 ? config.suites : config.suites.filter(i => suiteNames.includes(i.name))
  for (const suite of suites) {
    if (suite.type === 'unit') {
      await testSdinUnitSuite({ config, suite })
    } else if (suite.type === 'website') {
      await testSdinWebsiteSuite({ config, suite })
    }
  }
}
