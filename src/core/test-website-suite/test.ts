import type { SdinConfig, SdinWebsiteSuite } from 'core/config'

export interface SdinWebsiteSuiteTestingOptions {
  config: SdinConfig
  suite: SdinWebsiteSuite
}

export async function testSdinWebsiteSuite(options: SdinWebsiteSuiteTestingOptions): Promise<void> {
  console.log(`testing ${options.suite.type} ${options.suite.name}`)
}
