import { filterNotNone } from 'utils/array'
import { OrNil } from 'utils/declaration'
import { SdinProject } from './project'
import {
  SdinAbstractModule,
  SdinAbstractModuleDatas,
  SdinAbstractModuleParams
} from './abstract-module'

export type SdinFoundationModuleType = 'foundation'

export type SdinFoundationModuleMode = 'cjs' | 'esm'

export interface SdinFoundationModuleDatas extends SdinAbstractModuleDatas {}

/**
 * Sdin 基础模块选项
 */
export interface SdinFoundationModuleParams
  extends SdinAbstractModuleParams<SdinFoundationModuleType, SdinFoundationModuleMode> {
  /** 模块构建模式（默认：cjs） */
  mode?: SdinFoundationModuleMode
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/模式，相对项目根目录而言） */
  tar?: string
  /** 包含的文件（相对模块源码目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（相对模块源码目录而言） */
  excludes?: OrNil<string>[]
  /** 压缩代码（默认：true） */
  minify?: boolean
  /** 丑化代码（默认：true） */
  uglify?: boolean
  /** 源代码映射（默认：压缩或丑化时启用） */
  sourceMap?: boolean
  /** SASS 模块开关（默认：开启） */
  sassModule?: boolean
  /** 混淆 CSS 类名（默认：开启） */
  mixinClass?: boolean
  /** 在 JS 文件中引入转换后的 CSS 文件（SASS 模块启用时默认开启） */
  styleImports?: boolean
}

/**
 * Sdin 基础模块配置
 */
export class SdinFoundationModule extends SdinAbstractModule<
  SdinFoundationModuleType,
  SdinFoundationModuleMode,
  SdinFoundationModuleParams,
  SdinFoundationModuleDatas
> {
  /** 包含的文件 */
  public readonly includes: string[]
  /** 不包含的文件 */
  public readonly excludes: string[]
  /** 压缩代码 */
  public readonly minify: boolean
  /** 丑化代码 */
  public readonly uglify: boolean
  /** 源代码映射 */
  public readonly sourceMap: boolean
  /** SASS 模块开关 */
  public readonly sassModule: boolean
  /** 混淆 CSS 类名 */
  public readonly mixinClass: boolean
  /** 在 JS 文件中引入转换后的 CSS 文件 */
  public readonly styleImports: boolean
  /** 数据宏定义 */
  public readonly datas: SdinFoundationModuleDatas

  public constructor(project: SdinProject, params: SdinFoundationModuleParams) {
    super(project, params, 'cjs', '')
    this.includes = filterNotNone(params.includes)
    this.excludes = filterNotNone(params.excludes)
    this.minify = params.minify ?? true
    this.uglify = params.uglify ?? true
    this.sourceMap = params.sourceMap ?? (this.minify || this.uglify)
    this.sassModule = params.sassModule ?? true
    this.mixinClass = params.mixinClass ?? true
    this.styleImports = params.styleImports ?? this.sassModule
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
