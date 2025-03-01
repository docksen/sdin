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
