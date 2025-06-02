import { resolve } from 'path'
import { PackageInfo, getPackageRootPath, readPackageInfo } from 'utils/npm'
import { getWorkPath, joinPosix } from 'utils/path'
import { SdinAbstractConfig } from './abstract-config'

/**
 * Sdin 项目配置参数
 */
export interface SdinAbstractProjectParams {
  /** 项目根目录（默认：当前工作目录） */
  root?: string
  /** 模块别名（默认：不设置，相对项目根目录而言） */
  alias?: Record<string, string>
  /** 代码宏定义（key 是原代码，value 是替换后的代码） */
  codes?: Record<string, string>
  /** 数据宏定义（key 是原代码，value 是替换后的数据。在网页应用里，它会被挂载到全局变量 datas 上） */
  datas?: Record<string, string>
}

/**
 * Sdin 配置
 */
export abstract class SdinAbstractProject<
  TAncestor extends object | null,
  TParent extends SdinAbstractProject<any, any, any, any> | null,
  TParams extends SdinAbstractProjectParams,
  TDatas extends Record<string, any>
> extends SdinAbstractConfig<TAncestor, TParent, TParams> {
  /** 项目根目录 */
  public readonly root: string
  /** 项目临时目录 */
  public readonly tmp: string
  /** 项目公共目录 */
  public readonly pro: string
  /** 项目配置目录 */
  public readonly cfg: string
  /** 项目包信息 */
  public readonly pkg: PackageInfo
  /** 模块别名 */
  public readonly alias: Record<string, string>
  /** 代码宏定义 */
  public readonly codes: Record<string, string>
  /** 数据宏定义 */
  public abstract datas: TDatas

  public constructor(ancestor: TAncestor, parent: TParent, params: TParams) {
    super(ancestor, parent, params)
    if (!parent) {
      this.root = resolve(getPackageRootPath(params.root || getWorkPath()))
      this.tmp = this.withRoot('.tmp')
      this.pro = this.withRoot('pro')
      this.cfg = this.withRoot('pro/configs')
      this.pkg = readPackageInfo(this.root, true)
      this.alias = params.alias || {}
      this.codes = params.codes || {}
    } else {
      this.root = params.root ? resolve(getPackageRootPath(params.root)) : parent.root
      if (this.root === parent.root) {
        this.tmp = parent.tmp
        this.pro = parent.pro
        this.cfg = parent.cfg
        this.pkg = parent.pkg
      } else {
        this.tmp = this.withRoot('.tmp')
        this.pro = this.withRoot('pro')
        this.cfg = this.withRoot('pro/configs')
        this.pkg = readPackageInfo(this.root, true)
      }
      this.alias = params.alias ? Object.assign({}, parent.alias, params.alias) : parent.alias
      this.codes = params.codes ? Object.assign({}, parent.codes, params.codes) : parent.codes
    }
  }

  /**
   * 获取项目根目录下的绝对路径
   */
  public withRoot(...pathSegments: string[]) {
    return resolve(this.root, ...pathSegments)
  }

  /**
   * 获得项目临时目录下的绝对路径
   */
  public withTmp(...pathSegments: string[]) {
    return resolve(this.tmp, ...pathSegments)
  }

  /**
   * 获得项目公共目录下的绝对路径
   */
  public withPro(...pathSegments: string[]) {
    return resolve(this.pro, ...pathSegments)
  }

  /**
   * 获得项目配置目录下的绝对路径
   */
  public withCfg(...pathSegments: string[]) {
    return resolve(this.cfg, ...pathSegments)
  }

  /**
   * 将 alias 转换成 tsconfig paths
   */
  public getTsConfigPaths(): Record<string, string[]> {
    const paths: Record<string, string[]> = {}
    Object.keys(this.alias).forEach(key => {
      const value = this.alias[key]
      paths[joinPosix(key, '*')] = [joinPosix(value, '*')]
      paths[key] = [value]
    })
    return paths
  }

  public getMacros() {
    const result = { ...this.codes }
    for (const key in this.datas) {
      result[key] = JSON.stringify(this.datas[key])
    }
    return result
  }
}
