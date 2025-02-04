import { run } from 'jest'
import type { SdinConfig, SdinUnitSuite } from 'core/config'

export interface SdinUnitSuiteTestingOptions {
  config: SdinConfig
  suite: SdinUnitSuite
}

export async function testSdinUnitSuite(options: SdinUnitSuiteTestingOptions): Promise<void> {
  const { suite } = options
  const argv = ['--config', suite.jestConfig]
  run(argv, suite.src)
}
