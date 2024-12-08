import { resolve } from 'path'
import { RuleSetCondition, RuleSetRule } from 'webpack'
import { filterNotNone } from 'utils/array'
import { resolveExtensionsSync } from 'utils/path'
import { OrNil } from 'utils/declaration'
import { SdinConfig } from './config'
import { SdinAbstractModule, SdinAbstractModuleParams } from './abstract-module'
import { SdinBusinessError } from 'utils/error'
import { stat } from 'fs-extra'

export type SdinIntegrationModuleType = 'integration'

export type SdinIntegrationModuleMode = 'cjs' | 'umd' | 'jsp' | 'glb'

export const GLOBAL_MODE_LIST: SdinIntegrationModuleMode[] = ['umd', 'jsp', 'glb']

/**
 * Sdin 集成模块配置选项
 */
export interface SdinIntegrationModuleParams
  extends SdinAbstractModuleParams<SdinIntegrationModuleType, SdinIntegrationModuleMode> {
  /** 模块构建模式（默认：umd） */
  mode?: SdinIntegrationModuleMode
  /** 输入的源码入口（默认：src/index.(ts|tsx|js|jsx)，相对项目根目录而言） */
  src?: string
  /** 输出的目标位置（默认：tar/模式，相对项目根目录而言） */
  tar?: string
  /** 模块入口名（默认：index） */
  entryName?: string
  /** 全局名（用于指定包的导出对象，在全局的名称，cjs、umd 模式有效） */
  globalName?: string
  /** 全局对象（指定要挂载的环境中的全局对象变量名） */
  globalObject?: string
  /** 压缩代码（生产模式下开启） */
  minify?: boolean
  /** 丑化代码（生产模式下开启，minify 开启时有效） */
  uglify?: boolean
  /** 去除代码里使用到的外部模块 */
  externals?: Record<string, string>
  /** SASS 模块（默认：开启） */
  sassModule?: boolean
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
 * TypeScript 和 JavaScript 文件后缀
 */
const TJSX_FILE_EXTENSIONS = ['.ts', '.tsx', '.js', '.jsx']

/**
 * Sdin 集成模块配置
 */
export class SdinIntegrationModule extends SdinAbstractModule<
  SdinIntegrationModuleType,
  SdinIntegrationModuleMode,
  SdinIntegrationModuleParams
> {
  /** 输入的源码入口 */
  readonly src: string
  /** 输出的模块位置 */
  readonly tar: string
  /** 模块入口名 */
  readonly entryName: string
  /** 全局名 */
  readonly globalName: string
  /** 全局对象 */
  readonly globalObject: string
  /** 压缩代码 */
  readonly minify: boolean
  /** 丑化代码 */
  readonly uglify: boolean
  /** 源代码映射 */
  readonly sourceMap: boolean
  /** 去除代码里使用到的外部模块 */
  readonly externals: Record<string, string>
  /** SASS 模块 */
  readonly sassModule: boolean
  /** babel 编译包含项 */
  readonly babelIncludes: RuleSetCondition[]
  /** babel 编译排除项 */
  readonly babelExcludes: RuleSetCondition[]
  /** 修改文本打包规则 */
  readonly rawRule: Partial<RuleSetRule>
  /** 修改字体打包规则 */
  readonly fontRule: Partial<RuleSetRule>
  /** 修改图片打包规则 */
  readonly imageRule: Partial<RuleSetRule>
  /** 修改音频打包规则 */
  readonly audioRule: Partial<RuleSetRule>
  /** 修改视频打包规则 */
  readonly videoRule: Partial<RuleSetRule>
  /** 添加打包规则 */
  readonly rules: RuleSetRule[]

  constructor(config: SdinConfig, params: SdinIntegrationModuleParams) {
    super(config, params, 'umd')
    this.src = this.params.src
      ? resolve(this.config.root, this.params.src)
      : resolveExtensionsSync(resolve(this.config.root, 'src'), 'index', TJSX_FILE_EXTENSIONS)
    this.tar = resolve(config.root, params.tar || `tar/${this.mode}s`)
    this.entryName = params.entryName || 'index'
    this.globalName = params.globalName || ''
    this.globalObject = params.globalObject || ''
    this.minify = params.minify ?? config.mode === 'production'
    this.uglify = params.uglify ?? config.mode === 'production'
    this.sourceMap = this.minify
    this.externals = params.externals || {}
    this.sassModule = params.sassModule ?? true
    this.babelIncludes = filterNotNone(params.babelIncludes)
    this.babelExcludes = [/node_modules/, ...filterNotNone(params.babelExcludes)]
    this.rawRule = params.rawRule || {}
    this.fontRule = params.fontRule || {}
    this.imageRule = params.imageRule || {}
    this.audioRule = params.audioRule || {}
    this.videoRule = params.videoRule || {}
    this.rules = filterNotNone(params.rules)
  }

  async validate(): Promise<void> {
    await super.validate()
    const srcStat = await stat(this.src)
    if (!srcStat.isFile()) {
      throw new SdinBusinessError(
        SdinBusinessError.SRC_IS_NOT_FILE,
        `Module source ${this.src} is not file.`
      )
    }
    if (GLOBAL_MODE_LIST.includes(this.mode) && !this.globalName) {
      throw new SdinBusinessError(
        SdinBusinessError.ABSENT_GLOBAL_NAME,
        `Module global name is not defined.`
      )
    }
  }
}
