import { SdinBusinessError } from 'utils/error'
import { SdinConfig } from './config'
import { SdinUnitSuite, SdinUnitSuiteParams } from './unit-suite'
import { SdinWebsiteSuite, SdinWebsiteSuiteParams } from './website-suite'

/**
 * Sdin 用例集参数
 */
export type SdinSuiteParams = SdinUnitSuiteParams | SdinWebsiteSuiteParams

/**
 * Sdin 用例集配置
 */
export type SdinSuite = SdinUnitSuite | SdinWebsiteSuite

export function createSdinSuite(config: SdinConfig, params: SdinSuiteParams): SdinSuite {
  if (params.type === 'unit') {
    return new SdinUnitSuite(config, params)
  } else if (params.type === 'website') {
    return new SdinWebsiteSuite(config, params)
  } else {
    throw new SdinBusinessError(
      SdinBusinessError.SUITE_TYPE_ILLEGAL,
      `Suite type ${(params as any).type} is illegal.`
    )
  }
}
