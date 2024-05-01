import { resolve } from 'path'
import { printError } from 'utils/print'
import { readExports } from 'utils/read'
import { SdinConfig } from './config'

const PROJECT_CONFIG_FILE_PATH = 'pro/configs/project.ts'

export interface ReadSdinConfigParams {
  root: string
}

export async function readSdinConfig(params: ReadSdinConfigParams): Promise<SdinConfig> {
  const configPath = resolve(params.root, PROJECT_CONFIG_FILE_PATH)
  const configExports = await readExports(configPath, true)
  const configParams = configExports?.sdinConfigParams
  if (!configParams) {
    printError(`Read failed: ${configPath}`, 3028941)
  }
  const sdinConfig = new SdinConfig(configParams)
  await sdinConfig.initialize()
  return sdinConfig
}
