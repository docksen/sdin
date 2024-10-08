import { resolve } from 'path'
import { stat } from 'fs-extra'
import { OrNil } from 'utils/declaration'
import { filterNotNone } from 'utils/array'
import { SdinConfig } from './config'
import { SdinAbstractModule, SdinAbstractModuleParams } from './abstract-module'
import { SdinBusinessError } from 'utils/error'

export type SdinDeclarationModuleType = 'declaration'

export type SdinDeclarationModuleMode = 'dts'

/**
 * Sdin 声明模块选项
 */
export interface SdinDeclarationModuleParams
  extends SdinAbstractModuleParams<SdinDeclarationModuleType, SdinDeclarationModuleMode> {
  /** 模块构建模式（默认：dts） */
  mode?: SdinDeclarationModuleMode
  /** 输入的源码位置（默认：src，相对项目根目录而言） */
  src?: string
  /** 输出的目标位置（默认：tar/dts，相对项目根目录而言） */
  tar?: string
  /** 包含的文件（相对项目根目录而言） */
  includes?: OrNil<string>[]
  /** 不包含的文件（相对项目根目录而言） */
  excludes?: OrNil<string>[]
}

/**
 * Sdin 声明模块配置
 */
export class SdinDeclarationModule extends SdinAbstractModule<
  SdinDeclarationModuleType,
  SdinDeclarationModuleMode,
  SdinDeclarationModuleParams
> {
  /** 输入的源码位置 */
  readonly src: string
  /** 输出的目标位置 */
  readonly tar: string
  /** 包含的文件 */
  readonly includes: string[]
  /** 不包含的文件 */
  readonly excludes: string[]

  constructor(config: SdinConfig, params: SdinDeclarationModuleParams) {
    super(config, params, 'dts')
    this.src = resolve(config.root, params.src || 'src')
    this.tar = resolve(config.root, params.tar || 'tar/dts')
    this.includes = filterNotNone(params.includes)
    this.excludes = filterNotNone(params.excludes)
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
