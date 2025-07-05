import { RuleSetCondition, RuleSetRule } from 'webpack'
import { filterNotNone } from 'utils/array'
import { fileExistOrThrow, resolveExtensionSync, TJSX_FILE_EXTENSIONS } from 'utils/path'
import { OrNil } from 'utils/declaration'
import { SdinProject } from './project'
import { SdinConfigError } from 'tools/errors'
import {
  SdinAbstractModule,
  SdinAbstractModuleDatas,
  SdinAbstractModuleParams
} from './abstract-module'

export type SdinIntegrationModuleType = 'integration'

export type SdinIntegrationModuleMode = 'cjs' | 'umd' | 'jsp' | 'glb'

export const GLOBAL_MODE_LIST: SdinIntegrationModuleMode[] = ['umd', 'jsp', 'glb']

export interface SdinIntegrationModuleDatas extends SdinAbstractModuleDatas {}

/**
 * Sdin 集成模块配置选项
 */
export interface SdinIntegrationModuleParams
  extends SdinAbstractModuleParams<SdinIntegrationModuleType, SdinIntegrationModuleMode> {
  /** 模块构建模式（默认：umd） */
  mode?: SdinIntegrationModuleMode
  /** 模块源码目录（默认：src，相对项目根目录而言） */
  src?: string
  /** 模块目标目录（默认：tar/模块构建模式，相对项目根目录而言） */
  tar?: string
  /** 模块入口文件（默认：index.(ts|tsx|js|jsx)，相对模块源码目录而言） */
  index?: string
  /** 模块捆绑包名（默认：index，用于指定生成的主文件名称）  */
  bundle?: string
  /** 全局对象（指定要挂载的环境中的全局对象变量名） */
  global?: string
  /** 全局变量名（用于指定包的导出对象，在全局的名称，cjs、umd 模式有效） */
  variable?: string
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
}

/**
 * Sdin 集成模块配置
 */
export class SdinIntegrationModule extends SdinAbstractModule<
  SdinIntegrationModuleType,
  SdinIntegrationModuleMode,
  SdinIntegrationModuleParams,
  SdinIntegrationModuleDatas
> {
  /** 模块入口文件 */
  public readonly index: string
  /** 模块捆绑包名 */
  public readonly bundle: string
  /** 全局对象 */
  public readonly global: string | null
  /** 全局变量名 */
  public readonly variable: string
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
  /** 数据宏定义 */
  public readonly datas: SdinIntegrationModuleDatas

  public constructor(project: SdinProject, params: SdinIntegrationModuleParams) {
    super(project, params, 'umd', 's')
    this.index = params.index
      ? this.withSrc(params.index)
      : resolveExtensionSync(this.src, 'index', TJSX_FILE_EXTENSIONS)
    this.bundle = params.bundle || 'index'
    this.global = params.global || null
    this.variable = params.variable || ''
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
    this.datas = {
      ...this.parent.datas,
      ...this.params.datas,
      SDIN_MODULE_ENV: 'unknown',
      SDIN_MODULE_TYPE: this.type,
      SDIN_MODULE_MODE: this.mode,
      SDIN_MODULE_NAME: this.name
    }
  }

  public async validate(): Promise<void> {
    await super.validate()
    await fileExistOrThrow(this.index)
    if (GLOBAL_MODE_LIST.includes(this.mode) && !this.variable) {
      throw new SdinConfigError(
        SdinConfigError.ABSENT_GLOBAL_NAME,
        'Module global name is not defined.'
      )
    }
  }

  public getTarIndex(): string {
    return this.withTar(this.bundle + '.js')
  }
}
