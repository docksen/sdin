import { resolve } from 'path'
import { filterNotNil } from 'utils/array'
import { OrNil } from 'utils/types'
import { SdinBuildMode, SdinConfig } from './config'

export type SdinCompiledModuleType = 'compiled'

export type SdinCompiledModuleTarget = 'cjs' | 'esm'

export interface SdinCompiledModuleDefinitions extends Record<string, string> {
  SDIN_MODE: SdinBuildMode
  SDIN_TYPE: SdinCompiledModuleType
  SDIN_TARGET: SdinCompiledModuleTarget
}

/**
 * Sdin 编译式模块选项
 */
export interface SdinCompiledModuleParams {
  /** 模块类型 */
  type: SdinCompiledModuleType
  /** 构建目标（默认：cjs） */
  target?: SdinCompiledModuleTarget
  /** 输入的源码位置（默认：src，相对项目根目录而言） */
  src?: string
  /** 输出的模块位置（默认：由类型和目标决定，相对项目根目录而言） */
  dist?: string
  /** 包含的文件（默认：src，相对项目根目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（默认：没有，相对项目根目录而言） */
  excludes?: OrNil<string>[]
  /** 压缩代码 */
  minify?: boolean
  /** 丑化代码 */
  uglify?: boolean
  /** 源代码地图 */
  sourceMap?: boolean
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  definitions?: Record<string, string>
}

/**
 * Sdin 编译式模块配置
 */
export class SdinCompiledModule {
  /** 上层配置 */
  readonly config: SdinConfig
  /** 原配置选项 */
  readonly params: SdinCompiledModuleParams
  /** 模块类型 */
  readonly type: SdinCompiledModuleType
  /** 构建目标 */
  readonly target: SdinCompiledModuleTarget
  /** 输入的源码位置 */
  readonly src: string
  /** 输出的模块位置 */
  readonly dist: string
  /** 包含的文件 */
  readonly includes: string[]
  /** 不包含的文件 */
  readonly excludes: string[]
  /** 压缩代码 */
  readonly minify: boolean
  /** 丑化代码 */
  readonly uglify: boolean
  /** 源代码地图 */
  readonly sourceMap: boolean
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  readonly definitions: SdinCompiledModuleDefinitions

  constructor(config: SdinConfig, params: SdinCompiledModuleParams) {
    this.config = config
    this.params = params
    this.type = 'compiled'
    this.target = this.params.target || 'cjs'
    this.src = resolve(config.root, this.params.src || 'src')
    this.dist = resolve(config.root, this.params.dist || `dist/cpl-${this.target}`)
    this.includes = filterNotNil(this.params.includes)
    this.excludes = filterNotNil(this.params.excludes)
    this.minify = params.minify ?? config.mode === 'pro'
    this.uglify = params.uglify ?? config.mode === 'pro'
    this.sourceMap = params.sourceMap ?? (this.minify || this.uglify)
    this.definitions = {
      ...this.params.definitions,
      ...this.params.definitions,
      SDIN_MODE: config.mode,
      SDIN_TYPE: this.type,
      SDIN_TARGET: this.target
    }
  }
}
