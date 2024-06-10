import { resolve } from 'path'
import { RuleSetCondition, RuleSetRule } from 'webpack'
import { filterNotNil } from 'utils/array'
import { resolveExtends } from 'utils/path'
import { OrNil } from 'utils/types'
import { SdinBuildMode, SdinConfig } from './config'

export type SdinPackagedModuleType = 'packaged'

export type SdinPackagedModuleTarget = 'cjs' | 'esm' | 'umd'

export interface SdinPackagedModuleDefinitions extends Record<string, string> {
  SDIN_MODE: SdinBuildMode
  SDIN_TYPE: SdinPackagedModuleType
  SDIN_TARGET: SdinPackagedModuleTarget
}

/**
 * Sdin 打包式模块配置选项
 */
export interface SdinPackagedModuleParams {
  /** 模块类型 */
  type: SdinPackagedModuleType
  /** 模块名称 */
  name: string
  /** 构建目标（默认：umd） */
  target?: SdinPackagedModuleTarget
  /** 编译的入口文件（默认：src/index.ts） */
  entry?: string
  /** 输出的模块位置（默认：由类型和目标决定，相对项目根目录而言） */
  dist?: string
  /** 文件名（默认：index.js） */
  fileName?: string
  /** 全局变量名（暴露在全局的名称） */
  globalName: string
  /** 压缩代码（默认：压缩） */
  minify?: boolean
  /** 丑化代码（默认：丑化） */
  uglify?: boolean
  /** 源代码地图（默认：开启） */
  sourceMap?: boolean
  /** 去除代码里使用到的外部模块 */
  externals?: Record<string, string>
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  definitions?: Record<string, string>
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
 * Sdin 打包式模块配置
 */
export class SdinPackagedModule {
  /** 编译的入口文件 */
  private _entry: string
  /** 上层配置 */
  readonly config: SdinConfig
  /** 原配置选项 */
  readonly params: SdinPackagedModuleParams
  /** 模块类型 */
  readonly type: SdinPackagedModuleType
  /** 模块名称 */
  readonly name: string
  /** 构建目标 */
  readonly target: SdinPackagedModuleTarget
  /** 输出的模块位置 */
  readonly dist: string
  /** 文件名 */
  readonly fileName: string
  /** 全局变量名（暴露在全局的名称） */
  readonly globalName: string
  /** 压缩代码 */
  readonly minify: boolean
  /** 丑化代码 */
  readonly uglify: boolean
  /** 源代码地图 */
  readonly sourceMap: boolean
  /** 去除代码里使用到的外部模块 */
  readonly externals: Record<string, string>
  /** 全局定义（key 是原代码，value 是替换后的代码） */
  readonly definitions: SdinPackagedModuleDefinitions
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
  /** 编译的入口文件 */
  get entry() {
    return this._entry
  }

  constructor(config: SdinConfig, params: SdinPackagedModuleParams) {
    this._entry = ''
    this.config = config
    this.params = params
    this.type = 'packaged'
    this.name = params.name
    this.target = params.target || 'umd'
    this.dist = resolve(config.root, params.dist || `dist/pkg-${this.target}`)
    this.globalName = params.globalName
    this.fileName = params.fileName || 'index.js'
    this.minify = params.minify ?? config.mode === 'pro'
    this.uglify = params.uglify ?? config.mode === 'pro'
    this.sourceMap = params.sourceMap ?? (this.minify || this.uglify)
    this.externals = params.externals || {}
    this.definitions = {
      ...config.params.definitions,
      ...params.definitions,
      SDIN_MODE: config.mode,
      SDIN_TYPE: this.type,
      SDIN_TARGET: this.target
    }
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

  async initialize() {
    this._entry = this.params.entry
      ? resolve(this.config.root, this.params.entry)
      : await resolveExtends(resolve(this.config.root, 'src'), 'index', [
          '.ts',
          '.tsx',
          '.js',
          '.jsx'
        ])
  }
}
