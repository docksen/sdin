import { resolve } from 'path'
import { SdinConfig } from './config'
import { Config as JestConfig } from 'jest'
import { SdinAbstractSuite, SdinAbstractSuiteParams } from './abstract-suite'
import { dirExistOrThrow, fileExistOrThrow } from 'utils/path'
import { compileTypeScriptFile } from 'utils/typescript'

export type SdinUnitSuiteType = 'unit'

export type SdinJestConfig = JestConfig

/**
 * Sdin 单元用例集选项
 */
export interface SdinUnitSuiteParams extends SdinAbstractSuiteParams<SdinUnitSuiteType> {
  /** 用例集代码位置（默认：dev/unit，相对项目根目录而言） */
  src?: string
  /** Jest 配置文件路径（默认：pro/configs/jest.ts，相对项目根目录而言） */
  jestConfig?: string
}

/**
 * Sdin 单元用例集配置
 */
export class SdinUnitSuite extends SdinAbstractSuite<SdinUnitSuiteType, SdinUnitSuiteParams> {
  /** 用例集代码位置 */
  readonly src: string
  /** Jest 配置文件路径 */
  private _jestConfig: string

  get jestConfig(): string {
    return this._jestConfig
  }

  constructor(config: SdinConfig, params: SdinUnitSuiteParams) {
    super(config, params)
    this.src = resolve(config.root, params.src || 'dev/unit')
    this._jestConfig = resolve(config.root, params.jestConfig || 'pro/configs/jest.ts')
  }

  async initialize(): Promise<void> {
    if (this.jestConfig) {
      this._jestConfig = (await compileTypeScriptFile(this.jestConfig, false, 0)) || ''
    }
  }

  async validate(): Promise<void> {
    await super.validate()
    await dirExistOrThrow(this.src)
    await fileExistOrThrow(this.jestConfig)
  }
}
