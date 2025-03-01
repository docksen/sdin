import { SdinConfig } from 'core/config'
import { startSdinTesting } from 'core/start-testing'
import { SdinBusinessError } from 'utils/error'
import { blue, magenta, printInfo } from 'utils/print'

export interface SdinProjectStartingOptions {
  /** Sdin 配置 */
  config: SdinConfig
  /** Sdin 启动模式 */
  mode: string
}

enum SdinStartingMode {
  TESTING = 'testing'
}

export async function startSdinProject(options: SdinProjectStartingOptions): Promise<void> {
  const { config, mode } = options
  const pkg = config.pkg
  printInfo(`Project ${blue(pkg.name)}, version ${magenta(pkg.version)}.`)
  if (mode === SdinStartingMode.TESTING) {
    startSdinTesting({ config })
  } else {
    throw new SdinBusinessError(
      SdinBusinessError.STARTING_MODE_ILLEGAL,
      `Starting mode ${mode} is illegal.`
    )
  }
}
