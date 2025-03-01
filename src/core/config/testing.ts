import { resolve } from 'path'
import { SdinConfig, SdinConfigDefinitions } from './config'
import { SdinAbstractConfig } from './abstract-config'
import { dirExistOrThrow } from 'utils/path'

/**
 * Sdin 测试选项
 */
export interface SdinTestingParams {
  /** 测试的源码位置（默认：pro/testing，相对项目根目录而言） */
  src?: string
  /** 输出的目标位置（默认：.swap/testing，相对项目根目录而言） */
  tar?: string
  /** 测试代码入口（默认：index.js） */
  entry?: string
  /** 测试代码别名（默认：不设置，相对项目根目录而言） */
  alias?: Record<string, string>
}

/**
 * Sdin 测试代码全局定义
 */
export interface SdinTestingDefinitions extends SdinConfigDefinitions {}

/**
 * Sdin 测试配置
 */
export class SdinTesting extends SdinAbstractConfig<SdinConfig, SdinConfig, SdinTestingParams> {
  /** 测试的源码位置 */
  readonly src: string
  /** 输出的目标位置 */
  readonly tar: string
  /** 测试代码入口 */
  readonly entry: string
  /** 测试代码别名 */
  readonly alias: Record<string, string>
  /** 测试代码全局定义 */
  readonly definitions: SdinTestingDefinitions

  constructor(config: SdinConfig, params: SdinTestingParams) {
    super(config, config, params)
    this.src = params.src ? config.withRootPath(params.src) : config.withProPath('testing')
    this.tar = params.tar ? config.withRootPath(params.tar) : config.withTmpPath('testing')
    this.entry = params.entry || 'index.js'
    this.alias = params.alias || {}
    this.definitions = this.config.definitions
  }

  async validate(): Promise<void> {
    await super.validate()
    await dirExistOrThrow(this.src)
  }

  /**
   * 获取模块源码目录下的路径
   */
  withSrcPath(pathSegment: string) {
    return resolve(this.src, pathSegment)
  }

  /**
   * 获得模块目标目录下的路径
   */
  withTarPath(pathSegment: string) {
    return resolve(this.tar, pathSegment)
  }
}
