import { SdinProject } from './project'
import { SdinFoundationModule, SdinFoundationModuleParams } from './foundation-module'
import { fileExistOrThrow, resolveExtensionSync, TJSX_FILE_EXTENSIONS } from 'utils/path'
import { trim } from 'lodash'

/**
 * Sdin 测试选项
 */
export interface SdinTestingParams
  extends Omit<
    SdinFoundationModuleParams,
    'type' | 'name' | 'mode' | 'monify' | 'uglify' | 'sourceMap'
  > {
  /** 测试入口文件（默认：index.(ts|tsx|js|jsx)，相对模块源码目录而言） */
  index?: string
}

/**
 * Sdin 测试配置
 */
export class SdinTesting extends SdinFoundationModule {
  /** 测试入口文件（相对测试源码目录而言） */
  public readonly index: string

  public constructor(project: SdinProject, params: SdinTestingParams) {
    super(project, {
      ...params,
      type: 'foundation',
      name: 'testing',
      mode: 'cjs',
      src: params.src ? project.withRoot(params.src) : project.withPro('testing'),
      tar: params.tar ? project.withRoot(params.tar) : project.withTmp('testing'),
      minify: false,
      uglify: false,
      sourceMap: false
    })
    this.index = params.index
      ? this.withSrc(params.index)
      : resolveExtensionSync(this.src, 'index', TJSX_FILE_EXTENSIONS)
  }

  public async validate(): Promise<void> {
    await super.validate()
    await fileExistOrThrow(this.index)
  }

  public getIdxTar(): string {
    const idxTar = trim(this.index.replace(this.src, ''), '/\\ ')
    return this.withTar(idxTar.replace(/\.(ts|tsx|jsx)$/, '.js'))
  }
}
