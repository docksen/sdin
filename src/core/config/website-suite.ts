import { resolve } from 'path'
import { SdinConfig } from './config'
import { SdinAbstractSuite, SdinAbstractSuiteParams } from './abstract-suite'
import { dirExistOrThrow } from 'utils/path'

export type SdinWebsiteSuiteType = 'website'

/**
 * Sdin 网站用例集选项
 */
export interface SdinWebsiteSuiteParams extends SdinAbstractSuiteParams<SdinWebsiteSuiteType> {
  /** 用例集代码位置（默认：dev/website，相对项目根目录而言） */
  src?: string
}

/**
 * Sdin 网站用例集配置
 */
export class SdinWebsiteSuite extends SdinAbstractSuite<
  SdinWebsiteSuiteType,
  SdinWebsiteSuiteParams
> {
  /** 用例集代码位置 */
  readonly src: string

  constructor(config: SdinConfig, params: SdinWebsiteSuiteParams) {
    super(config, params)
    this.src = resolve(config.root, params.src || 'dev/website')
  }

  async validate(): Promise<void> {
    await super.validate()
    await dirExistOrThrow(this.src)
  }
}
