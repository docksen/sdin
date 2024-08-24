import { resolve } from 'path'
import { SdinConfig } from './config'
import { readExports } from 'utils/read'
import { SdinBusinessError } from 'utils/error'

const PROJECT_CONFIG_FILE_PATH = 'pro/configs/project.ts'

export interface SdinConfigReadingParams {
  /** 项目根目录 */
  root: string
}

export async function readSdinConfig(params: SdinConfigReadingParams): Promise<SdinConfig> {
  const configPath = resolve(params.root, PROJECT_CONFIG_FILE_PATH)
  const configExports = await readExports(configPath, true)
  const configParams = configExports?.sdinConfigParams
  if (!configParams) {
    throw new SdinBusinessError(
      SdinBusinessError.READ_CONFIG_FILE_FAILED,
      `Read failed: ${configPath}`
    )
  }
  if (!configParams.root) {
    configParams.root = params.root
  }
  const sdinConfig = new SdinConfig(configParams)
  await sdinConfig.initialize()
  return sdinConfig
}
