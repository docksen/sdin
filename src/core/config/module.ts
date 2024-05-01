import { SdinConfig } from './config'
import { SdinCompiledModule, SdinCompiledModuleParams } from './compiled-module'
import { SdinDefinedModule, SdinDefinedModuleParams } from './defined-module'
import { SdinPackagedModule, SdinPackagedModuleParams } from './packaged-module'

/**
 * Sdin 模块选项
 */
export type SdinModuleParams =
  | SdinCompiledModuleParams
  | SdinPackagedModuleParams
  | SdinDefinedModuleParams

/**
 * Sdin 模块配置
 */
export type SdinModule = SdinCompiledModule | SdinPackagedModule | SdinDefinedModule

export function createSdinModule(config: SdinConfig, params: SdinModuleParams): SdinModule {
  if (params.type === 'compiled') {
    return new SdinCompiledModule(config, params)
  } else if (params.type === 'packaged') {
    return new SdinPackagedModule(config, params)
  } else if (params.type === 'defined') {
    return new SdinDefinedModule(config, params)
  } else {
    throw new Error('模块类型不存在')
  }
}
