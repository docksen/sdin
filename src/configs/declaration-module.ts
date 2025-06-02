import { OrNil } from 'utils/declaration'
import { filterNotNone } from 'utils/array'
import { SdinProject } from './project'
import {
  SdinAbstractModule,
  SdinAbstractModuleDatas,
  SdinAbstractModuleParams
} from './abstract-module'

export type SdinDeclarationModuleType = 'declaration'

export type SdinDeclarationModuleMode = 'dts'

export interface SdinDeclarationModuleDatas extends SdinAbstractModuleDatas {}

/**
 * Sdin 声明模块选项
 */
export interface SdinDeclarationModuleParams
  extends SdinAbstractModuleParams<SdinDeclarationModuleType, SdinDeclarationModuleMode> {
  /** 模块构建模式（默认：dts） */
  mode?: SdinDeclarationModuleMode
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/dts，相对项目根目录而言） */
  tar?: string
  /** 包含的文件（相对模块源码目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（相对模块源码目录而言） */
  excludes?: OrNil<string>[]
}

/**
 * Sdin 声明模块配置
 */
export class SdinDeclarationModule extends SdinAbstractModule<
  SdinDeclarationModuleType,
  SdinDeclarationModuleMode,
  SdinDeclarationModuleParams,
  SdinDeclarationModuleDatas
> {
  /** 包含的文件 */
  public readonly includes: string[]
  /** 不包含的文件 */
  public readonly excludes: string[]
  /** 数据宏定义 */
  public readonly datas: SdinDeclarationModuleDatas

  public constructor(project: SdinProject, params: SdinDeclarationModuleParams) {
    super(project, params, 'dts', '')
    this.includes = filterNotNone(params.includes)
    this.excludes = filterNotNone(params.excludes)
    this.datas = {
      ...this.parent.datas,
      ...this.params.datas,
      SDIN_MODULE_ENV: 'unknown',
      SDIN_MODULE_TYPE: this.type,
      SDIN_MODULE_MODE: this.mode,
      SDIN_MODULE_NAME: this.name
    }
  }
}
