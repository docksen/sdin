import { resolve } from 'path'
import { asyncForEach, filterNotNone } from 'utils/array'
import { PackageInfo, getPackageRootPath, readPackageInfo } from 'utils/npm'
import { OrNil } from 'utils/declaration'
import { getWorkPath, joinPosix } from 'utils/path'
import { createSdinModule } from './module'
import { createSdinSuite } from './suite'
import type { SdinModule, SdinModuleParams } from './module'
import type { SdinSuite, SdinSuiteParams } from './suite'

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
  /** 模块配置项列表 */
  modules: OrNil<SdinModuleParams>[]
  /** 用例集配置项列表 */
  suites: OrNil<SdinSuiteParams>[]
}

/**
 * Sdin 配置
 */
export class SdinConfig {
  /** 原始配置信息 */
  readonly params: SdinConfigParams
  /** 项目根目录 */
  readonly root: string
  /** 项目缓存目录 */
  readonly swp: string
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
  /** 模块列表 */
  readonly modules: SdinModule[]
  /** 用例集列表 */
  readonly suites: SdinSuite[]

  constructor(params: SdinConfigParams) {
    this.params = params
    this.root = resolve(getPackageRootPath(params.root || getWorkPath()))
    this.swp = resolve(this.root, '.swap')
    this.pro = resolve(this.root, 'pro')
    this.cfg = resolve(this.root, 'pro/configs')
    this.pkg = readPackageInfo(this.root, true)
    this.mode = params.mode || 'production'
    this.alias = params.alias || {}
    this.modules = filterNotNone(params.modules).map(item => createSdinModule(this, item))
    this.suites = filterNotNone(params.suites).map(item => createSdinSuite(this, item))
  }

  async initialize() {
    await asyncForEach(this.modules, async module => {
      await module.initialize()
      await module.validate()
    })
    await asyncForEach(this.suites, async suite => {
      await suite.initialize()
      await suite.validate()
    })
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
   * 获得项目公共目录下的路径
   */
  withProPath(pathSegment: string) {
    return resolve(this.pro, pathSegment)
  }

  /**
   * 获得项目缓存目录下的路径
   */
  withSwpPath(pathSegment: string) {
    return resolve(this.swp, pathSegment)
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
