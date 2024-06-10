import { resolve } from 'path'
import { OrNil } from 'utils/types'
import { filterNotNil } from 'utils/array'
import { SdinBuildMode, SdinConfig } from './config'

export type SdinDefinedModuleType = 'defined'

export interface SdinDefinedModuleDefinitions extends Record<string, string> {
  SDIN_MODE: SdinBuildMode
  SDIN_TYPE: SdinDefinedModuleType
}

/**
 * Sdin 定义式模块选项
 */
export interface SdinDefinedModuleParams {
  /** 模块类型 */
  type: SdinDefinedModuleType
  /** 模块名称 */
  name: string
  /** 输入的源码位置（默认：src，相对项目根目录而言） */
  src?: string
  /** 输出的模块位置（默认：由类型和目标决定，相对项目根目录而言） */
  dist?: string
  /** 包含的文件（默认：src，相对项目根目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（默认：没有，相对项目根目录而言） */
  excludes?: OrNil<string>[]
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  definitions?: Record<string, string>
}

/**
 * Sdin 定义式模块配置
 */
export class SdinDefinedModule {
  /** 上层配置 */
  readonly config: SdinConfig
  /** 原配置选项 */
  readonly params: SdinDefinedModuleParams
  /** 模块类型 */
  readonly type: SdinDefinedModuleType
  /** 模块名称 */
  readonly name: string
  /** 输入的源码位置（默认：src，相对项目根目录而言） */
  readonly src: string
  /** 输出的模块位置 */
  readonly dist: string
  /** 包含的文件 */
  readonly includes: string[]
  /** 不包含的文件 */
  readonly excludes: string[]
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  readonly definitions: SdinDefinedModuleDefinitions

  constructor(config: SdinConfig, params: SdinDefinedModuleParams) {
    this.config = config
    this.params = params
    this.type = 'defined'
    this.name = params.name
    this.src = resolve(config.root, params.src || 'src')
    this.dist = resolve(config.root, params.dist || 'dist/def')
    this.includes = filterNotNil(params.includes)
    this.excludes = filterNotNil(params.excludes)
    this.definitions = {
      ...config.params.definitions,
      ...params.definitions,
      SDIN_MODE: config.mode,
      SDIN_TYPE: this.type
    }
  }
}
