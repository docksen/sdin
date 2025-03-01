import { resolve } from 'path'
import { asyncForEach, filterNotNone } from 'utils/array'
import { PackageInfo, getPackageRootPath, readPackageInfo } from 'utils/npm'
import { OrNil } from 'utils/declaration'
import { getWorkPath, joinPosix } from 'utils/path'
import { createSdinModule } from './common-tools'
import { SdinAbstractConfig } from './abstract-config'
import type { SdinModule, SdinModuleParams } from './common-declarations'
import { SdinTesting, SdinTestingParams } from './testing'

export type SdinBuildMode = 'development' | 'production'

/**
 * Sdin 配置参数
 */
export interface SdinConfigParams {
  /** 项目根目录（默认：当前工作目录） */
  root?: string
  /** 构建模式（默认：production，生产模式） */
  mode?: SdinBuildMode
  /** 模块别名（默认：不设置，相对项目根目录而言） */
  alias?: Record<string, string>
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  definitions?: Record<string, string>
  /** 测试配置 */
  testing?: SdinTestingParams
  /** 模块配置项列表 */
  modules: OrNil<SdinModuleParams>[]
}

/**
 * Sdin 模块全局定义
 */
export interface SdinConfigDefinitions extends Record<string, string> {
  SDIN_PROJECT_MODE: string
  SDIN_PROJECT_NAME: string
  SDIN_PROJECT_VERSION: string
  SDIN_PROJECT_AUTHOR_NAME: string
  SDIN_PROJECT_AUTHOR_EMAIL: string
}

/**
 * Sdin 配置
 */
export class SdinConfig extends SdinAbstractConfig<null, null, SdinConfigParams> {
  /** 项目根目录 */
  readonly root: string
  /** 项目临时目录 */
  readonly tmp: string
  /** 项目公共目录 */
  readonly pro: string
  /** 项目配置目录 */
  readonly cfg: string
  /** 项目包信息 */
  readonly pkg: PackageInfo
  /** 构建模式（默认：production，生产模式） */
  readonly mode: SdinBuildMode
  /** 模块别名 */
  readonly alias: Record<string, string>
  /** 测试配置 */
  readonly testing: SdinTesting
  /** 模块列表 */
  readonly modules: SdinModule[]
  /** 项目全局定义（key 是原代码，value 是替换后的代码） */
  readonly definitions: SdinConfigDefinitions

  constructor(params: SdinConfigParams) {
    super(null, null, params)
    this.root = resolve(getPackageRootPath(params.root || getWorkPath()))
    this.tmp = this.withRootPath('.tmp')
    this.pro = this.withRootPath('pro')
    this.cfg = this.withRootPath('pro/configs')
    this.pkg = readPackageInfo(this.root, true)
    this.mode = params.mode || 'production'
    this.alias = params.alias || {}
    this.definitions = {
      ...params.definitions,
      SDIN_PROJECT_MODE: JSON.stringify(this.mode),
      SDIN_PROJECT_NAME: JSON.stringify(this.pkg.name),
      SDIN_PROJECT_VERSION: JSON.stringify(this.pkg.version),
      SDIN_PROJECT_AUTHOR_NAME: JSON.stringify(this.pkg.authorName),
      SDIN_PROJECT_AUTHOR_EMAIL: JSON.stringify(this.pkg.authorEmail)
    }
    this.testing = new SdinTesting(this, params.testing || {})
    this.modules = filterNotNone(params.modules).map(item => createSdinModule(this, item))
  }

  async initialize() {
    await this.testing.initialize()
    await asyncForEach(this.modules, module => module.initialize())
  }

  async validate(): Promise<void> {
    await this.testing.validate()
    await asyncForEach(this.modules, module => module.validate())
  }

  /**
   * 是否是生产模式
   */
  isProduction() {
    return this.mode === 'production'
  }

  /**
   * 获取项目根目录下的路径
   */
  withRootPath(pathSegment: string) {
    return resolve(this.root, pathSegment)
  }

  /**
   * 获得项目临时目录下的路径
   */
  withTmpPath(pathSegment: string) {
    return resolve(this.tmp, pathSegment)
  }

  /**
   * 获得项目公共目录下的路径
   */
  withProPath(pathSegment: string) {
    return resolve(this.pro, pathSegment)
  }

  /**
   * 获得项目配置目录下的路径
   */
  withCfgPath(pathSegment: string) {
    return resolve(this.cfg, pathSegment)
  }

  /**
   * 将 alias 转换成 tsconfig paths
   */
  getTsConfigPaths(): Record<string, string[]> {
    const paths: Record<string, string[]> = {}
    Object.keys(this.alias).forEach(key => {
      const value = this.alias[key]
      paths[joinPosix(key, '*')] = [joinPosix(value, '*')]
      paths[key] = [value]
    })
    return paths
  }
}
