import { SdinProject } from './project'
import { SdinIntegrationModule, SdinIntegrationModuleParams } from './integration-module'

/**
 * Sdin 测试选项
 */
export interface SdinTestingParams
  extends Omit<
    SdinIntegrationModuleParams,
    'type' | 'name' | 'mode' | 'monify' | 'uglify' | 'sourceMap' | 'mixinClass'
  > {}

/**
 * Sdin 测试配置
 */
export class SdinTesting extends SdinIntegrationModule {
  public constructor(project: SdinProject, params: SdinTestingParams) {
    super(project, {
      ...params,
      type: 'integration',
      name: 'testing',
      mode: 'umd',
      src: params.src ? project.withRoot(params.src) : project.withPro('testing'),
      tar: params.tar ? project.withRoot(params.tar) : project.withTmp('testing'),
      variable: params.variable || 'testing',
      minify: false,
      uglify: false,
      sourceMap: true,
      mixinClass: false
    })
  }
}
