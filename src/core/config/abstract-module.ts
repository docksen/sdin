import { resolve } from 'path'
import { SdinConfig } from './config'
import { SdinBusinessError } from 'utils/error'
import { isCodeModuleName } from 'utils/check'

/**
 * Sdin 抽象模块选项
 */
export interface SdinAbstractModuleParams<TType extends string, TMode extends string> {
  /** 模块类型 */
  type: TType
  /** 模块构建模式 */
  mode?: TMode
  /** 模块名称 */
  name: string
}

/**
 * Sdin 模块全局定义
 */
export interface SdinModuleDefinitions extends Record<string, string> {
  SDIN_PROJECT_MODE: string
  SDIN_PROJECT_NAME: string
  SDIN_PROJECT_VERSION: string
  SDIN_PROJECT_AUTHOR_NAME: string
  SDIN_PROJECT_AUTHOR_EMAIL: string
  SDIN_MODULE_TYPE: string
  SDIN_MODULE_MODE: string
  SDIN_MODULE_NAME: string
}

/**
 * Sdin 抽象模块配置
 */
export abstract class SdinAbstractModule<
  TType extends string,
  TMode extends string,
  TParam extends SdinAbstractModuleParams<TType, TMode>
> {
  /** Sdin 配置对象 */
  readonly config: SdinConfig
  /** 模块原始配置 */
  readonly params: TParam
  /** 模块类型 */
  readonly type: TType
  /** 模块构建模式 */
  readonly mode: TMode
  /** 模块名称 */
  readonly name: string
  /** 输入的源码位置 */
  abstract src: string
  /** 输出的目标位置 */
  abstract tar: string
  /** 全局定义 */
  readonly definitions: SdinModuleDefinitions

  constructor(config: SdinConfig, params: TParam, mode: TMode) {
    this.config = config
    this.params = params
    this.type = params.type
    this.mode = params.mode || mode
    this.name = params.name
    this.definitions = {
      ...this.config.params.definitions,
      SDIN_PROJECT_MODE: JSON.stringify(config.mode),
      SDIN_PROJECT_NAME: JSON.stringify(config.pkg.name),
      SDIN_PROJECT_VERSION: JSON.stringify(config.pkg.version),
      SDIN_PROJECT_AUTHOR_NAME: JSON.stringify(config.pkg.authorName),
      SDIN_PROJECT_AUTHOR_EMAIL: JSON.stringify(config.pkg.authorEmail),
      SDIN_MODULE_TYPE: JSON.stringify(this.type),
      SDIN_MODULE_MODE: JSON.stringify(this.mode),
      SDIN_MODULE_NAME: JSON.stringify(this.name)
    }
  }

  /**
   * 初始化模块配置对象
   */
  initialize(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * 检查模块配置对象
   */
  async validate(): Promise<void> {
    if (!isCodeModuleName(this.name)) {
      throw new SdinBusinessError(
        SdinBusinessError.MODULE_NAME_FORMAT_ILLEGAL,
        `Please change the module name to kebab-case: ${this.name}`
      )
    }
  }

  /**
   * 获取项目根目录下的路径
   */
  withSrcPath(pathSegment: string) {
    return resolve(this.src, pathSegment)
  }

  /**
   * 获得项目公共目录下的路径
   */
  withTarPath(pathSegment: string) {
    return resolve(this.tar, pathSegment)
  }
}
