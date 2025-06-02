import { resolve } from 'path'
import { SdinProject, SdinProjectDatas } from './project'
import { MODULE_NAME_EXP } from 'tools/check'
import { dirExistOrThrow } from 'utils/path'
import { SdinAbstractProject, SdinAbstractProjectParams } from './abstract-project'
import { matchRegExpOrThrow } from 'utils/check'

export interface SdinAbstractModuleDatas extends SdinProjectDatas {
  SDIN_MODULE_ENV: string
  SDIN_MODULE_TYPE: string
  SDIN_MODULE_MODE: string
  SDIN_MODULE_NAME: string
}

/**
 * Sdin 抽象模块选项
 */
export interface SdinAbstractModuleParams<TType extends string, TMode extends string>
  extends SdinAbstractProjectParams {
  /** 模块类型 */
  type: TType
  /** 模块名称 */
  name: string
  /** 模块构建模式 */
  mode?: TMode
  /** 模块源码目录 */
  src?: string
  /** 模块目标目录 */
  tar?: string
}

/**
 * Sdin 抽象模块配置
 */
export abstract class SdinAbstractModule<
  TType extends string,
  TMode extends string,
  TParam extends SdinAbstractModuleParams<TType, TMode>,
  TDatas extends SdinAbstractModuleDatas
> extends SdinAbstractProject<SdinProject, SdinProject, TParam, TDatas> {
  /** 模块类型 */
  public readonly type: TType
  /** 模块名称 */
  public readonly name: string
  /** 模块构建模式 */
  public readonly mode: TMode
  /** 模块源码目录 */
  public readonly src: string
  /** 模块目标目录 */
  public readonly tar: string
  /** 数据宏定义 */
  public abstract datas: TDatas

  public constructor(project: SdinProject, params: TParam, mode: TMode, tarSuffix: string) {
    super(project, project, params)
    this.type = params.type
    this.name = params.name
    this.mode = params.mode || mode
    this.src = this.withRoot(params.src || 'src')
    this.tar = this.withRoot(params.tar || `tar/${this.mode}${tarSuffix}`)
  }

  /**
   * 检查模块配置对象
   */
  public async validate(): Promise<void> {
    await super.validate()
    await dirExistOrThrow(this.src)
    matchRegExpOrThrow('Module name', this.name, MODULE_NAME_EXP)
  }

  /**
   * 获取模块源码目录下的绝对路径
   */
  public withSrc(...pathSegments: string[]) {
    return resolve(this.src, ...pathSegments)
  }

  /**
   * 获得模块目标目录下的绝对路径
   */
  public withTar(...pathSegments: string[]) {
    return resolve(this.tar, ...pathSegments)
  }

  /**
   * 设置环境标识
   */
  public setEnv(it: 'pro' | 'dev') {
    this.datas.SDIN_MODULE_ENV = it
  }
}
