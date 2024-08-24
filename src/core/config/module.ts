import { SdinConfig } from './config'
import { SdinFoundationModule, SdinFoundationModuleParams } from './foundation-module'
import { SdinDeclarationModule, SdinDeclarationModuleParams } from './declaration-module'
import { SdinIntegrationModule, SdinIntegrationModuleParams } from './integration-module'

/**
 * Sdin 模块参数
 */
export type SdinModuleParams =
  | SdinFoundationModuleParams
  | SdinIntegrationModuleParams
  | SdinDeclarationModuleParams

/**
 * Sdin 模块配置
 */
export type SdinModule = SdinFoundationModule | SdinIntegrationModule | SdinDeclarationModule

export function createSdinModule(config: SdinConfig, params: SdinModuleParams): SdinModule {
  if (params.type === 'foundation') {
    return new SdinFoundationModule(config, params)
  } else if (params.type === 'integration') {
    return new SdinIntegrationModule(config, params)
  } else if (params.type === 'declaration') {
    return new SdinDeclarationModule(config, params)
  } else {
    throw new Error('模块类型不存在')
  }
}
