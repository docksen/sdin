import { RuleSetCondition, RuleSetRule } from 'webpack'
import { Options as ProxyOptions } from 'koa-proxy'
import { asyncForEach, filterNotNone } from 'utils/array'
import { OrNil } from 'utils/declaration'
import { keyBy } from 'lodash'
import { joinPosix, resolvePosixSlash } from 'utils/path'
import { SdinConfigError } from 'tools/errors'
import { getDependenceVersion } from 'utils/npm'
import { ABSOLUTE_URL_PATH_EXP } from 'tools/check'
import { matchRegExpOrThrow } from 'utils/check'
import { SdinProject } from './project'
import {
  SdinAbstractModule,
  SdinAbstractModuleDatas,
  SdinAbstractModuleParams
} from './abstract-module'
import {
  SdinApplicationPage,
  SdinApplicationPageElement,
  SdinApplicationPageParams,
  SdinApplicationPageSkeleton
} from './application-page'
import { yellow } from 'utils/print'

export type SdinApplicationModuleType = 'application'

export type SdinApplicationModuleMode = 'csr'

export interface SdinApplicationModuleDatas extends SdinAbstractModuleDatas {
  SDIN_MODULE_TITLE: string | null
  SDIN_MODULE_PATH: string
  SDIN_MODULE_ASSETS_PATH: string
}

/**
 * Sdin 应用模块配置选项
 */
export interface SdinApplicationModuleParams
  extends SdinAbstractModuleParams<SdinApplicationModuleType, SdinApplicationModuleMode> {
  /** 模块构建模式（默认：csr） */
  mode?: SdinApplicationModuleMode
  /** 模块标题 */
  title?: string
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/模块构建模式，相对项目根目录而言） */
  tar?: string
  /** 模块网络路径（默认：/模块名称/） */
  path?: string
  /** 模块素材源码目录（默认：pro/assets，相对项目根目录而言） */
  astSrc?: string
  /** 模块素材网络路径（默认：ast/，相对模块网络路径而言） */
  astPath?: string
  /** 压缩代码（默认：true） */
  minify?: boolean
  /** 丑化代码（默认：true） */
  uglify?: boolean
  /** 源代码映射（默认：压缩或丑化时启用） */
  sourceMap?: boolean
  /** 去除代码里使用到的外部模块 */
  externals?: Record<string, string>
  /** SASS 模块（默认：开启） */
  sassModule?: boolean
  /** 混淆 CSS 类名（默认：开启） */
  mixinClass?: boolean
  /** babel 编译包含项 */
  babelIncludes?: OrNil<RuleSetCondition>[]
  /** babel 编译排除项 */
  babelExcludes?: OrNil<RuleSetCondition>[]
  /** 修改文本打包规则（仅允许修改部分值）*/
  rawRule?: Partial<RuleSetRule>
  /** 修改字体打包规则（仅允许修改部分值）*/
  fontRule?: Partial<RuleSetRule>
  /** 修改图片打包规则（仅允许修改部分值）*/
  imageRule?: Partial<RuleSetRule>
  /** 修改音频打包规则（仅允许修改部分值）*/
  audioRule?: Partial<RuleSetRule>
  /** 修改视频打包规则（仅允许修改部分值）*/
  videoRule?: Partial<RuleSetRule>
  /** 添加打包规则（可以覆盖部分默认规则） */
  rules?: OrNil<RuleSetRule>[]
  /** 开发模式下，启用日志（默认：不启用） */
  devLog?: boolean
  /** 开发模式下，在页面标题上显示表情符号（默认：⚡） */
  devEmoji?: string
  /** 开发环境下，服务器的端口号（默认：8080） */
  devPort?: number
  /** 开发环境下，服务器的代理设置 <https://github.com/edorivai/koa-proxy> */
  devProxies?: OrNil<ProxyOptions>[]
  /** 页面列表 */
  pages: OrNil<SdinApplicationPageParams>[]
  /** 根页面名称（默认：index） */
  index?: string
  /** 错误页面名称（默认：error） */
  error?: string
  /** 页面元信息标签列表 */
  metas?: OrNil<SdinApplicationPageElement>[]
  /** 页面样式标签列表 */
  links?: OrNil<SdinApplicationPageElement>[]
  /** 页面样式标签列表 */
  styles?: OrNil<SdinApplicationPageElement>[]
  /** 页面脚本标签列表 */
  scripts?: OrNil<SdinApplicationPageElement>[]
  /** 页面骨架渲染器 */
  skeleton?: SdinApplicationPageSkeleton
}

/**
 * Sdin 应用模块配置
 */
export class SdinApplicationModule extends SdinAbstractModule<
  SdinApplicationModuleType,
  SdinApplicationModuleMode,
  SdinApplicationModuleParams,
  SdinApplicationModuleDatas
> {
  /** 模块标题 */
  public readonly title: string | null
  /** 模块网络路径 */
  public readonly path: string
  /** 模块素材源码目录 */
  public readonly astSrc: string
  /** 模块素材网络路径（相对模块网络路径而言） */
  public readonly astPath: string
  /** 压缩代码 */
  public readonly minify: boolean
  /** 丑化代码 */
  public readonly uglify: boolean
  /** 源代码映射 */
  public readonly sourceMap: boolean
  /** 去除代码里使用到的外部模块 */
  public readonly externals: Record<string, string>
  /** SASS 模块 */
  public readonly sassModule: boolean
  /** 混淆 CSS 类名 */
  public readonly mixinClass: boolean
  /** babel 编译包含项 */
  public readonly babelIncludes: RuleSetCondition[]
  /** babel 编译排除项 */
  public readonly babelExcludes: RuleSetCondition[]
  /** 修改文本打包规则 */
  public readonly rawRule: Partial<RuleSetRule>
  /** 修改字体打包规则 */
  public readonly fontRule: Partial<RuleSetRule>
  /** 修改图片打包规则 */
  public readonly imageRule: Partial<RuleSetRule>
  /** 修改音频打包规则 */
  public readonly audioRule: Partial<RuleSetRule>
  /** 修改视频打包规则 */
  public readonly videoRule: Partial<RuleSetRule>
  /** 添加打包规则 */
  public readonly rules: RuleSetRule[]
  /** 开发模式下，启用日志 */
  public readonly devLog: boolean
  /** 开发模式下，在页面标题上显示表情符号 */
  public readonly devEmoji: string
  /** 开发模式下，服务器的端口号 */
  public readonly devPort: number
  /** 开发模式下，服务器的代理设置 */
  public readonly devProxies: ProxyOptions[]
  /** 数据宏定义 */
  public readonly datas: SdinApplicationModuleDatas
  /** 页面列表 */
  public readonly pages: SdinApplicationPage[]
  /** 根页面 */
  public readonly index: SdinApplicationPage | null
  /** 错误页面 */
  public readonly error: SdinApplicationPage | null

  public constructor(project: SdinProject, params: SdinApplicationModuleParams) {
    super(project, params, 'csr', '')
    this.title = params.title ?? null
    this.path = resolvePosixSlash(params.path ?? this.name, true, true)
    this.astSrc = this.withRoot(params.astSrc || 'pro/assets')
    this.astPath = resolvePosixSlash(params.astPath || 'ast', false, true)
    this.minify = params.minify ?? true
    this.uglify = params.uglify ?? true
    this.sourceMap = params.sourceMap ?? (this.minify || this.uglify)
    this.externals = params.externals || {}
    this.sassModule = params.sassModule ?? true
    this.mixinClass = params.mixinClass ?? true
    this.babelIncludes = filterNotNone(params.babelIncludes)
    this.babelExcludes = [/node_modules/, ...filterNotNone(params.babelExcludes)]
    this.rawRule = params.rawRule || {}
    this.fontRule = params.fontRule || {}
    this.imageRule = params.imageRule || {}
    this.audioRule = params.audioRule || {}
    this.videoRule = params.videoRule || {}
    this.rules = filterNotNone(params.rules)
    this.devLog = params.devLog ?? false
    this.devEmoji = params.devEmoji ?? '⚡'
    this.devPort = params.devPort || 8080
    this.devProxies = filterNotNone(params.devProxies)
    this.datas = {
      ...this.parent.datas,
      ...this.params.datas,
      SDIN_MODULE_ENV: 'unknown',
      SDIN_MODULE_TYPE: this.type,
      SDIN_MODULE_MODE: this.mode,
      SDIN_MODULE_NAME: this.name,
      SDIN_MODULE_TITLE: this.title,
      SDIN_MODULE_PATH: this.path,
      SDIN_MODULE_ASSETS_PATH: this.path + this.astPath
    }
    this.pages = this.createPages(params.pages)
    const nameToPage = keyBy(this.pages, 'name')
    this.index = nameToPage[params.index || 'index']
    this.error = nameToPage[params.error || 'error']
  }

  private createPages(pages: OrNil<SdinApplicationPageParams>[]) {
    const source: SdinApplicationPageParams[] = filterNotNone(pages)
    const target: SdinApplicationPage[] = []
    const nameMap: Record<string, boolean> = {}
    for (const pageParams of source) {
      const page = new SdinApplicationPage(this.ancestor, this, pageParams)
      if (nameMap[page.name]) {
        throw new SdinConfigError(
          SdinConfigError.MODULE_NAME_IS_REPEATED,
          `Module ${yellow(this.name)} Page name "${yellow(page.name)}" is repeated.`
        )
      } else {
        target.push(page)
        nameMap[page.name] = true
      }
    }
    return target
  }

  public async validate(): Promise<void> {
    await super.validate()
    await asyncForEach(this.pages, page => page.validate())
    matchRegExpOrThrow(`module ${yellow(this.name)} path`, this.path, ABSOLUTE_URL_PATH_EXP)
    // react-refresh 需要优于 react 加载，才会生效，所以需要确保 dependence 中有 react 包
    if (['react', 'react-dom'].some(i => !getDependenceVersion(this.pkg, i))) {
      throw new SdinConfigError(
        SdinConfigError.ABSENT_PACKAGE_DEPENDENCE,
        `please install react、react-dom dependence.`
      )
    }
  }

  /**
   * 获得模块网络路径下的绝对路径
   */
  public withPath(...pathSegments: string[]) {
    return joinPosix(this.path, ...pathSegments)
  }

  /**
   * 设置环境标识
   */
  public setEnv(it: 'pro' | 'dev') {
    this.datas.SDIN_MODULE_ENV = it
    this.pages.forEach(page => (page.datas.SDIN_MODULE_ENV = it))
  }
}
