import { resolve } from 'path'
import { filterNotNil } from 'utils/array'
import { PACKAGE_INFO, PackageInfo, readPackageInfo } from 'utils/npm'
import { OrNil } from 'utils/types'
import { CWD_PATH } from 'utils/path'
import { SdinModule, SdinModuleParams, createSdinModule } from './module'

export type SdinBuildMode = 'dev' | 'pro'

/**
 * Sdin 选项
 */
export interface SdinConfigParams {
  /** 项目根目录（默认为当前工作目录） */
  root?: string
  /** 构建模式（默认：pro，生产模式） */
  mode?: SdinBuildMode
  /** 模块别名（默认：不设置，相对项目根目录而言） */
  alias?: Record<string, string>
  /** 模块配置项列表 */
  modules: OrNil<SdinModuleParams>[]
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  definitions?: Record<string, string>
}

/**
 * Sdin 配置
 */
export class SdinConfig {
  /** 项目包信息 */
  private _pkg: PackageInfo
  /** 原始配置信息 */
  readonly params: SdinConfigParams
  /** 项目根目录 */
  readonly root: string
  /** 缓存目录 */
  readonly swap: string
  /** 项目公共目录 */
  readonly pro: string
  /** 构建模式（默认：pro，生产模式） */
  readonly mode: SdinBuildMode
  /** 模块别名 */
  readonly alias: Record<string, string>
  /** 模块列表 */
  readonly modules: SdinModule[]
  /** 项目包信息 */
  get pkg() {
    return this._pkg
  }

  constructor(params: SdinConfigParams) {
    this._pkg = PACKAGE_INFO
    this.params = params
    this.root = resolve(params.root || CWD_PATH)
    this.swap = resolve(this.root, '.swap')
    this.pro = resolve(this.root, 'pro')
    this.mode = params.mode || 'pro'
    this.alias = params.alias || {}
    this.modules = filterNotNil(params.modules).map(item => createSdinModule(this, item))
  }

  async initialize() {
    const innerInit = async () => {
      this._pkg = await readPackageInfo(this.root, true)
    }
    const promises: Promise<any>[] = [innerInit()]
    for (const module of this.modules) {
      if (module.type === 'packaged') {
        promises.push(module.initialize())
      }
    }
    await Promise.all(promises)
  }
}
