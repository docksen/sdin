import type { SdinConfig, SdinPackagedModule } from 'core/config'

export interface BuildSdinPackagedModuleOptions {
  config: SdinConfig
  module: SdinPackagedModule
}

export async function buildSdinPackagedModule(
  options: BuildSdinPackagedModuleOptions
): Promise<void> {
  console.log(options)
  await Promise.resolve()
}
