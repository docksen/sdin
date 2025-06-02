import { resolve } from 'path'
import { pathExistsSync, readJsonSync } from 'fs-extra'
import { isEmail, isPackageName } from './check'
import { isPlainObject } from 'lodash'
import { NpmError } from './errors'

export interface PackageInfo extends Record<string, any> {
  /** 包名称 */
  name: string
  /** 版本 */
  version: string
  /** 描述 */
  description: string
  /** "xxx <xxx@xxx.xxx>"*/
  author: string
  /** "xxx" */
  authorName: string
  /** "xxx@xxx.xxx" */
  authorEmail: string
}

export const PACKAGE_INFO: PackageInfo = {
  name: 'unknown',
  version: '1.0.0',
  description: 'unknown',
  author: 'unknown <unknown@unknown.domain>',
  authorName: 'unknown',
  authorEmail: 'unknown@unknown.domain'
}

export const PACKAGE_INFO_FILE_NAME = 'package.json'

const PACKAGE_AUTHOR_EXP = /^(.+) <(.+)>$/
const MODULE_NAME_SEPARATOR_EXP = /[\/\?]+/

/**
 * 获取给定文件所属包的根目录
 */
export function getPackageRootPath(path: string) {
  let root: string = path
  for (let i = 0; root && i < 10; i++) {
    if (pathExistsSync(resolve(root, PACKAGE_INFO_FILE_NAME))) {
      return root
    } else {
      root = resolve(root, '../')
    }
  }
  throw new NpmError(NpmError.NOT_HAS_ROOT_PATH, 'Cannot find root path.')
}

/**
 * 根据文件夹目录，获取包的信息
 */
export function readPackageInfo(root: string, strict: true): PackageInfo
export function readPackageInfo(root: string, strict?: false): PackageInfo | undefined
export function readPackageInfo(root: string, strict?: boolean): PackageInfo | undefined {
  const filePath = resolve(root, PACKAGE_INFO_FILE_NAME)
  const data = readJsonSync(filePath)
  if (!isPlainObject(data)) {
    if (strict) {
      throw new NpmError(
        NpmError.PACKAGE_JSON_CONTENT_IS_NOT_PLAIN_OBJECT,
        `File ${filePath} exports is not ${PACKAGE_INFO_FILE_NAME} content.`
      )
    } else {
      return undefined
    }
  }
  if (!data.name || !data.version || !data.description || !data.author) {
    throw new NpmError(
      NpmError.PACKAGE_JSON_MISSING_REQUIRED_FIELD,
      `${PACKAGE_INFO_FILE_NAME} must contain "name", "version", "description", "author" fields`
    )
  }
  if (!isPackageName(data.name)) {
    throw new NpmError(
      NpmError.PACKAGE_NAME_IS_NOT_KEBAB_CASE,
      'Please change package name to kebab-case'
    )
  }
  const atr = data.author
  if (typeof atr === 'object') {
    data.authorName = atr.name || ''
    data.authorEmail = atr.email || ''
    if (data.authorEmail) {
      data.author = `${data.authorName} <${data.authorEmail}>`
    } else {
      data.author = data.authorName
    }
  } else {
    const mtd = PACKAGE_AUTHOR_EXP.exec(atr)
    if (mtd && mtd.length >= 3) {
      data.authorName = mtd[1]
      data.authorEmail = mtd[2]
    } else {
      throw new NpmError(
        NpmError.PACKAGE_AUTHOR_MARK_FORMAT_ERROR,
        `Please change author to "name <xxx@xxx.xxx>" in ${PACKAGE_INFO_FILE_NAME}`
      )
    }
  }
  if (!isEmail(data.authorEmail)) {
    throw new NpmError(
      NpmError.PACKAGE_AUTHOR_EMAIL_FORMAT_ERROR,
      `Author email format error in ${PACKAGE_INFO_FILE_NAME}`
    )
  }
  return data
}

export function getDependenceName(importedPath: string) {
  const segments = importedPath.split(MODULE_NAME_SEPARATOR_EXP)
  if (segments.length === 1) {
    return importedPath
  }
  if (segments[0][0] === '@') {
    return segments[0] + '/' + segments[1]
  }
  return segments[0]
}

export function getDependenceVersion(pkg: PackageInfo, dep: string): string {
  return pkg.dependencies[dep] || pkg.devDependencies[dep] || ''
}
