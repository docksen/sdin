import { resolve } from 'path'
import { RuleSetCondition, RuleSetRule } from 'webpack'
import { filterNotNil } from 'utils/array'
import { resolveExtensionsSync } from 'utils/path'
import { OrNil } from 'utils/declaration'
import { SdinConfig } from './config'
import { SdinAbstractModule, SdinAbstractModuleParams } from './abstract-module'
import { SdinBusinessError } from 'utils/error'
import { stat } from 'fs-extra'

export type SdinIntegrationModuleType = 'integration'

export type SdinIntegrationModuleMode = 'cjs' | 'glb' | 'umd'

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
  /** 生成的文件名（默认：index.js） */
  fileName?: string
  /** 全局对象名（用于指定包的导出对象，在全局的名称，cjs、umd 模式有效） */
  globalName?: string
  /** 压缩代码（生产模式下开启） */
  minify?: boolean
  /** 丑化代码（生产模式下开启，minify 开启时有效） */
  uglify?: boolean
  /** 源代码地图（默认：开启） */
  sourceMap?: boolean
  /** 去除代码里使用到的外部模块 */
  externals?: Record<string, string>
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
  /** 修改 css 打包规则（仅允许修改部分值）*/
  cssRule?: Partial<RuleSetRule>
  /** 修改 scss 打包规则（仅允许修改部分值）*/
  scssRule?: Partial<RuleSetRule>
  /** 修改 babel 打包规则（仅允许修改部分值）*/
  babelRule?: Partial<RuleSetRule>
  /** 添加打包规则（位于 video 和 css 规则之间） */
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
  /** 文件名 */
  readonly fileName: string
  /** 全局对象名 */
  readonly globalName: string
  /** 压缩代码 */
  readonly minify: boolean
  /** 丑化代码 */
  readonly uglify: boolean
  /** 源代码地图 */
  readonly sourceMap: boolean
  /** 去除代码里使用到的外部模块 */
  readonly externals: Record<string, string>
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
  /** 修改 css 打包规则 */
  readonly cssRule: Partial<RuleSetRule>
  /** 修改 scss 打包规则 */
  readonly scssRule: Partial<RuleSetRule>
  /** 修改 babel 打包规则 */
  readonly babelRule: Partial<RuleSetRule>
  /** 添加打包规则 */
  readonly rules: RuleSetRule[]

  constructor(config: SdinConfig, params: SdinIntegrationModuleParams) {
    super(config, params, 'umd')
    this.src = this.params.src
      ? resolve(this.config.root, this.params.src)
      : resolveExtensionsSync(resolve(this.config.root, 'src'), 'index', TJSX_FILE_EXTENSIONS)
    this.tar = resolve(config.root, params.tar || `tar/${this.mode}s`)
    this.globalName = params.globalName || ''
    this.fileName = params.fileName || 'index.js'
    this.minify = params.minify ?? config.mode === 'production'
    this.uglify = params.uglify ?? config.mode === 'production'
    this.sourceMap = params.sourceMap ?? (this.minify || this.uglify)
    this.externals = params.externals || {}
    this.babelIncludes = filterNotNil(params.babelIncludes)
    this.babelExcludes = [/node_modules/, ...filterNotNil(params.babelExcludes)]
    this.rawRule = params.rawRule || {}
    this.fontRule = params.fontRule || {}
    this.imageRule = params.imageRule || {}
    this.audioRule = params.audioRule || {}
    this.videoRule = params.videoRule || {}
    this.cssRule = params.cssRule || {}
    this.scssRule = params.scssRule || {}
    this.babelRule = params.babelRule || {}
    this.rules = filterNotNil(params.rules)
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
    if (['cjs', 'umd'].includes(this.mode) && !this.globalName) {
      throw new SdinBusinessError(
        SdinBusinessError.ABSENT_GLOBAL_NAME,
        `Module global name is not defined.`
      )
    }
  }
}
