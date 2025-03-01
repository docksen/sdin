import { resolve } from 'path'
import { SdinConfig } from './config'
import { readExports } from 'utils/read'
import { SdinBusinessError } from 'utils/error'
import { SdinFoundationModule } from './foundation-module'
import { SdinIntegrationModule } from './integration-module'
import { SdinDeclarationModule } from './declaration-module'
import { SdinModule, SdinModuleParams } from './common-declarations'

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
  await sdinConfig.validate()
  return sdinConfig
}

export function createSdinModule(config: SdinConfig, params: SdinModuleParams): SdinModule {
  if (params.type === 'foundation') {
    return new SdinFoundationModule(config, params)
  } else if (params.type === 'integration') {
    return new SdinIntegrationModule(config, params)
  } else if (params.type === 'declaration') {
    return new SdinDeclarationModule(config, params)
  } else {
    throw new SdinBusinessError(
      SdinBusinessError.MODULE_TYPE_ILLEGAL,
      `Module type ${(params as any).type} is illegal.`
    )
  }
}
