import { OrNil } from 'utils/declaration'
import { asyncForEach, filterNotNone } from 'utils/array'
import { SdinModule, SdinModuleParams } from './module'
import { SdinTesting, SdinTestingParams } from './testing'
import { SdinPlaying, SdinPlayingParams } from './playing'
import { SdinAbstractProject, SdinAbstractProjectParams } from './abstract-project'
import { SdinFoundationModule } from './foundation-module'
import { SdinIntegrationModule } from './integration-module'
import { SdinDeclarationModule } from './declaration-module'
import { SdinApplicationModule } from './application-module'
import { SdinConfigError } from 'tools/errors'
import { green, yellow } from 'utils/print'

export interface SdinProjectDatas extends Record<string, any> {
  SDIN_PROJECT_NAME: string
  SDIN_PROJECT_VERSION: string
  SDIN_PROJECT_DESCRIPTION: string
  SDIN_PROJECT_AUTHOR_NAME: string
  SDIN_PROJECT_AUTHOR_EMAIL: string
}

/**
 * Sdin 项目配置参数
 */
export interface SdinProjectParams extends SdinAbstractProjectParams {
  /** 模块列表 */
  modules: OrNil<SdinModuleParams>[]
  /** 测试配置 */
  testing?: SdinTestingParams
  /** 演示配置 */
  playing?: SdinPlayingParams
}

/**
 * Sdin 配置
 */
export class SdinProject extends SdinAbstractProject<
  null,
  null,
  SdinProjectParams,
  SdinProjectDatas
> {
  /** 数据宏定义 */
  public readonly datas: SdinProjectDatas
  /** 模块列表 */
  public readonly modules: SdinModule[]
  /** 测试配置 */
  public readonly testing?: SdinTesting
  /** 演示配置 */
  public readonly playing?: SdinPlaying

  public constructor(params: SdinProjectParams) {
    super(null, null, params)
    this.datas = {
      ...params.datas,
      SDIN_PROJECT_NAME: this.pkg.name,
      SDIN_PROJECT_VERSION: this.pkg.version,
      SDIN_PROJECT_DESCRIPTION: this.pkg.description,
      SDIN_PROJECT_AUTHOR_NAME: this.pkg.authorName,
      SDIN_PROJECT_AUTHOR_EMAIL: this.pkg.authorEmail
    }
    this.modules = this.createModules(params.modules)
    if (params.testing) {
      this.testing = new SdinTesting(this, params.testing)
    }
    if (params.playing) {
      this.playing = new SdinPlaying(this, params.playing)
    }
  }

  private createModules(modules: OrNil<SdinModuleParams>[]) {
    const source: SdinModuleParams[] = filterNotNone(modules)
    const target: SdinModule[] = []
    const nameMap: Record<string, boolean> = {}
    for (const moduleParams of source) {
      const module = this.createModule(moduleParams)
      if (nameMap[module.name]) {
        throw new SdinConfigError(
          SdinConfigError.MODULE_NAME_IS_REPEATED,
          `Module name "${yellow(module.name)}" is repeated.`
        )
      } else {
        target.push(module)
        nameMap[module.name] = true
      }
    }
    return target
  }

  private createModule(moduleParams: SdinModuleParams) {
    if (moduleParams.type === 'foundation') {
      return new SdinFoundationModule(this, moduleParams)
    } else if (moduleParams.type === 'integration') {
      return new SdinIntegrationModule(this, moduleParams)
    } else if (moduleParams.type === 'declaration') {
      return new SdinDeclarationModule(this, moduleParams)
    } else if (moduleParams.type === 'application') {
      return new SdinApplicationModule(this, moduleParams)
    } else {
      throw new SdinConfigError(
        SdinConfigError.MODULE_TYPE_ILLEGAL,
        `Module type "${green((moduleParams as any).type)}" is illegal.`
      )
    }
  }

  public async initialize() {
    if (this.testing) {
      await this.testing.initialize()
    }
    if (this.playing) {
      await this.playing.initialize()
    }
    await asyncForEach(this.modules, module => module.initialize())
  }

  public async validate(): Promise<void> {
    if (this.testing) {
      await this.testing.validate()
    }
    if (this.playing) {
      await this.playing.validate()
    }
    await asyncForEach(this.modules, module => module.validate())
  }
}
