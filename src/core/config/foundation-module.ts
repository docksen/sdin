import { stat } from 'fs-extra'
import { resolve } from 'path'
import { filterNotNil } from 'utils/array'
import { OrNil } from 'utils/declaration'
import { SdinConfig } from './config'
import { SdinAbstractModule, SdinAbstractModuleParams } from './abstract-module'
import { SdinBusinessError } from 'utils/error'

export type SdinFoundationModuleType = 'foundation'

export type SdinFoundationModuleMode = 'cjs' | 'esm'

/**
 * Sdin 基础模块选项
 */
export interface SdinFoundationModuleParams
  extends SdinAbstractModuleParams<SdinFoundationModuleType, SdinFoundationModuleMode> {
  /** 模块构建模式（默认：cjs） */
  mode?: SdinFoundationModuleMode
  /** 输入的源码位置（默认：src，相对项目根目录而言） */
  src?: string
  /** 输出的目标位置（默认：tar/模式，相对项目根目录而言） */
  tar?: string
  /** 包含的文件（默认：src，相对项目根目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（默认：没有，相对项目根目录而言） */
  excludes?: OrNil<string>[]
  /** 压缩代码（生产模式下开启） */
  minify?: boolean
  /** 丑化代码（生产模式下开启，minify 开启时有效） */
  uglify?: boolean
  /** 源代码地图 */
  sourceMap?: boolean
}

/**
 * Sdin 基础模块配置
 */
export class SdinFoundationModule extends SdinAbstractModule<
  SdinFoundationModuleType,
  SdinFoundationModuleMode,
  SdinFoundationModuleParams
> {
  /** 输入的源码位置 */
  readonly src: string
  /** 输出的目标位置 */
  readonly tar: string
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

  constructor(config: SdinConfig, params: SdinFoundationModuleParams) {
    super(config, params, 'cjs')
    this.src = resolve(config.root, this.params.src || 'src')
    this.tar = resolve(config.root, this.params.tar || `tar/${this.mode}`)
    this.includes = filterNotNil(this.params.includes)
    this.excludes = filterNotNil(this.params.excludes)
    this.minify = params.minify ?? config.mode === 'production'
    this.uglify = params.uglify ?? config.mode === 'production'
    this.sourceMap = params.sourceMap ?? (this.minify || this.uglify)
  }

  async validate(): Promise<void> {
    await super.validate()
    const srcStat = await stat(this.src)
    if (!srcStat.isDirectory()) {
      throw new SdinBusinessError(
        SdinBusinessError.SRC_IS_NOT_DIRECTORY,
        `Module source ${this.src} is not directory.`
      )
    }
  }
}
