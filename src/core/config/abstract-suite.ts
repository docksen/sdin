import { resolve } from 'path'
import { SdinConfig } from './config'
import { SdinBusinessError } from 'utils/error'
import { isCodeSuiteName } from 'utils/check'

/**
 * Sdin 抽象用例集选项
 */
export interface SdinAbstractSuiteParams<TType extends string> {
  /** 用例集类型 */
  type: TType
  /** 用例集名称 */
  name: string
}

/**
 * Sdin 抽象用例集配置
 */
export abstract class SdinAbstractSuite<
  TType extends string,
  TParam extends SdinAbstractSuiteParams<TType>
> {
  /** Sdin 配置对象 */
  readonly config: SdinConfig
  /** 用例集原始配置 */
  readonly params: TParam
  /** 用例集类型 */
  readonly type: TType
  /** 用例集名称 */
  readonly name: string
  /** 用例集代码位置 */
  abstract src: string

  constructor(config: SdinConfig, params: TParam) {
    this.config = config
    this.params = params
    this.type = params.type
    this.name = params.name
  }

  /**
   * 初始化用例集配置对象
   */
  initialize(): Promise<void> {
    return Promise.resolve()
  }

  /**
   * 检查用例集配置对象
   */
  async validate(): Promise<void> {
    if (!isCodeSuiteName(this.name)) {
      throw new SdinBusinessError(
        SdinBusinessError.SUITE_NAME_FORMAT_ILLEGAL,
        `Please change the suite name to kebab-case: ${this.name}`
      )
    }
  }

  /**
   * 获取项目根目录下的路径
   */
  withSrcPath(pathSegment: string) {
    return resolve(this.src, pathSegment)
  }
}
