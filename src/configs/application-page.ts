import { keyBy, omit } from 'lodash'
import { OrNil } from 'utils/declaration'
import { SdinProject } from './project'
import { SdinAbstractConfig } from './abstract-config'
import { SdinApplicationModule, SdinApplicationModuleDatas } from './application-module'
import { filterNotNone } from 'utils/array'
import { replaceByCode } from 'utils/string'
import { APP_PAGE_NAME_EXP, RELATIVE_URL_PATH_EXP } from 'tools/check'
import { matchRegExpOrThrow } from 'utils/check'
import { SdinConfigError } from 'tools/errors'
import { blue, magenta, yellow } from 'utils/print'
import {
  fileExistOrThrow,
  resolveExtensionSync,
  resolvePosixSlash,
  TJSX_FILE_EXTENSIONS
} from 'utils/path'

export interface SdinApplicationPageElement extends Record<string, string | boolean | undefined> {
  key: string
}

export interface SdinApplicationPageDatas extends SdinApplicationModuleDatas {
  SDIN_PAGE_NAME: string
  SDIN_PAGE_TITLE: string
  SDIN_PAGE_PATH: string
}

export type SdinApplicationPageSkeleton = (page: SdinApplicationPage) => string

const defaultSkeleton: SdinApplicationPageSkeleton = () => ''

/**
 * Sdin 应用页面配置选项
 */
export interface SdinApplicationPageParams {
  /** 页面名称 */
  name: string
  /** 页面标题 */
  title: string
  /** 页面入口文件（默认：页面名称/index.(ts|tsx|js|jsx)，相对模块源码目录而言） */
  index?: string
  /** 页面网络路径（默认：页面名称，相对模块网络路径而言） */
  path?: string
  /** 页面元信息标签列表 */
  metas?: OrNil<SdinApplicationPageElement>[]
  /** 页面链接标签列表 */
  links?: OrNil<SdinApplicationPageElement>[]
  /** 页面样式标签列表 */
  styles?: OrNil<SdinApplicationPageElement>[]
  /** 页面脚本标签列表 */
  scripts?: OrNil<SdinApplicationPageElement>[]
  /** 页面骨架渲染器 */
  skeleton?: SdinApplicationPageSkeleton
  /** 数据宏定义 */
  datas?: Record<string, string>
}

/**
 * Sdin 应用页面配置
 */
export class SdinApplicationPage extends SdinAbstractConfig<
  SdinProject,
  SdinApplicationModule,
  SdinApplicationPageParams
> {
  /** 页面名称 */
  public readonly name: string
  /** 页面标题 */
  public readonly title: string
  /** 页面入口文件 */
  public readonly index: string
  /** 页面网络路径（相对模块网络路径而言） */
  public readonly path: string
  /** 页面元信息标签列表 */
  public readonly metas: SdinApplicationPageElement[]
  /** 页面样式标签列表 */
  public readonly links: SdinApplicationPageElement[]
  /** 页面样式标签列表 */
  public readonly styles: SdinApplicationPageElement[]
  /** 页面脚本标签列表 */
  public readonly scripts: SdinApplicationPageElement[]
  /** 页面骨架渲染器 */
  private readonly skeleton: SdinApplicationPageSkeleton
  /** 数据宏定义 */
  public readonly datas: SdinApplicationPageDatas

  public constructor(
    project: SdinProject,
    module: SdinApplicationModule,
    params: SdinApplicationPageParams
  ) {
    super(project, module, params)
    this.name = params.name
    this.title = params.title
    this.index = params.index
      ? module.withSrc(params.index)
      : resolveExtensionSync(module.src, this.name + '/index', TJSX_FILE_EXTENSIONS)
    this.path = resolvePosixSlash(params.path || this.name, false, false)
    this.metas = this.assingLabels(module.params.metas, params.metas)
    this.links = this.assingLabels(module.params.links, params.links)
    this.styles = this.assingLabels(module.params.styles, params.styles)
    this.scripts = this.assingLabels(module.params.scripts, params.scripts)
    this.skeleton = params.skeleton || module.params.skeleton || defaultSkeleton
    this.datas = {
      ...this.parent.datas,
      ...this.params.datas,
      SDIN_PAGE_NAME: this.name,
      SDIN_PAGE_TITLE: this.title,
      SDIN_PAGE_PATH: module.path + this.path
    }
  }

  public async validate(): Promise<void> {
    await super.validate()
    matchRegExpOrThrow('page name', this.name, APP_PAGE_NAME_EXP)
    matchRegExpOrThrow('page path', this.path, RELATIVE_URL_PATH_EXP)
    if (this.index) {
      await fileExistOrThrow(this.index)
    } else {
      const presetIndex = this.parent.withSrc(this.name, 'index.(tsx|ts|jsx|js)')
      const prefixLabel = `module ${yellow(this.parent.name)} page ${magenta(this.name)}`
      throw new SdinConfigError(
        SdinConfigError.APP_PAGE_INDEX_IS_NOT_EXIST,
        `${prefixLabel} index fille "${blue(presetIndex)}" is not exist.`
      )
    }
  }

  public getHtmlTitle() {
    return this.parent.title ? `${this.title} - ${this.parent.title}` : this.title
  }

  public getHtmlDatas() {
    return omit(this.datas, ['SDIN_PROJECT_AUTHOR_NAME', 'SDIN_PROJECT_AUTHOR_EMAIL'])
  }

  public getMetaHtmlString() {
    return this.toHtmlString('meta', this.metas)
  }

  public getLinkHtmlString() {
    return this.toHtmlString('link', this.links)
  }

  public getStyleHtmlString() {
    return this.toHtmlString('link', this.styles)
  }

  public getScriptHtmlString(scripts?: SdinApplicationPageElement[]) {
    return this.toHtmlString('script', scripts || this.scripts)
  }

  public getSkeleton() {
    return this.skeleton(this)
  }

  private assingLabels(
    labels1?: OrNil<SdinApplicationPageElement>[],
    labels2?: OrNil<SdinApplicationPageElement>[]
  ): SdinApplicationPageElement[] {
    return Object.values(
      Object.assign(keyBy(filterNotNone(labels1), 'key'), keyBy(filterNotNone(labels2), 'key'))
    )
  }

  private toHtmlString(name: string, labels: SdinApplicationPageElement[]) {
    const full = ['script'].includes(name)
    let strs: string[] = []
    for (let i = 0, label: SdinApplicationPageElement; i < labels.length; i++) {
      label = labels[i]
      let attrs: string[] = []
      let children: string | undefined
      const keys = Object.keys(label)
      for (let j = 0, key: string, value: any; j < keys.length; j++) {
        key = keys[j]
        if (key === 'key') {
          continue
        }
        value = label[key]
        if (key === 'children') {
          children = replaceByCode(value, this.datas)
          continue
        }
        if (value === true) {
          attrs.push(key)
        } else {
          attrs.push(key + '="' + replaceByCode(value, this.datas) + '"')
        }
      }
      if (attrs.length <= 0) {
        continue
      }
      const attrstr = attrs.join(' ')
      const labelpre = '<' + name + ' ' + attrstr
      if (children) {
        strs.push(labelpre + '>' + children + '</' + name + '>')
      } else if (full) {
        strs.push(labelpre + '></' + name + '>')
      } else {
        strs.push(labelpre + '/>')
      }
    }
    return strs.join('\n')
  }
}
