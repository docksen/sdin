import { resolve } from 'path'
import { pathExists, pathExistsSync } from 'fs-extra'
import { readExportsSync } from './read'
import { printTask, green, red, yellow } from './print'
import { isEmail, isPackageName } from './check'
import { isPlainObject } from 'lodash'
import { execute } from './execute'
import { SdinUtilsError } from './error'

export interface PackageInfo extends Record<string, any> {
  /** 包名称 */
  name: string
  /** 版本 */
  version: string
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
  author: 'unknown <unknown@unknown.domain>',
  authorName: 'unknown',
  authorEmail: 'unknown@unknown.domain'
}

export const PACKAGE_INFO_FILE_NAME = 'package.json'

const PACKAGE_AUTHOR_REG = /^(.+) <(.+)>$/

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
  throw new SdinUtilsError(SdinUtilsError.NOT_HAS_ROOT_PATH, 'Cannot find root path.')
}

/**
 * 根据文件夹目录，获取包的信息
 */
export function readPackageInfo(root: string, strict: true): PackageInfo
export function readPackageInfo(root: string, strict?: false): PackageInfo | undefined
export function readPackageInfo(root: string, strict?: boolean): PackageInfo | undefined {
  const filePath = resolve(root, PACKAGE_INFO_FILE_NAME)
  const data = readExportsSync(filePath, strict)
  if (!isPlainObject(data)) {
    if (strict) {
      throw new SdinUtilsError(
        SdinUtilsError.PACKAGE_JSON_CONTENT_IS_NOT_PLAIN_OBJECT,
        `File ${filePath} exports is not ${PACKAGE_INFO_FILE_NAME} content.`
      )
    } else {
      return undefined
    }
  }
  if (!data.name || !data.version || !data.author) {
    throw new SdinUtilsError(
      SdinUtilsError.PACKAGE_JSON_MISSING_REQUIRED_FIELD,
      `${PACKAGE_INFO_FILE_NAME} must contain "name", "version", "author" fields`
    )
  }
  if (!isPackageName(data.name)) {
    throw new SdinUtilsError(
      SdinUtilsError.PACKAGE_NAME_IS_NOT_KEBAB_CASE,
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
    const mtd = PACKAGE_AUTHOR_REG.exec(atr)
    if (mtd && mtd.length >= 3) {
      data.authorName = mtd[1]
      data.authorEmail = mtd[2]
    } else {
      throw new SdinUtilsError(
        SdinUtilsError.PACKAGE_AUTHOR_MARK_FORMAT_ERROR,
        `Please change author to "name <xxx@xxx.xxx>" in ${PACKAGE_INFO_FILE_NAME}`
      )
    }
  }
  if (!isEmail(data.authorEmail)) {
    throw new SdinUtilsError(
      SdinUtilsError.PACKAGE_AUTHOR_EMAIL_FORMAT_ERROR,
      `Author email format error in ${PACKAGE_INFO_FILE_NAME}`
    )
  }
  return data
}

export function getDependenceVersion(pkg: PackageInfo, dep: string): string {
  const curDep = pkg.dependencies
    ? pkg.dependencies[dep]
    : pkg.devDependencies
    ? pkg.devDependencies[dep]
    : ''
  return curDep || ''
}

export async function downloadModules(root: string): Promise<void> {
  return printTask<any, void>({
    exitCode: SdinUtilsError.DOWNLOAD_MODULES_FAILED,
    task: async ({ loading }) => {
      if (!(await pathExists(root))) {
        throw new SdinUtilsError(
          SdinUtilsError.DOWNLOAD_MODULES_ROOT_IS_NOT_EXIST,
          `Folder ${root} is not exist.`
        )
      }
      await execute(`cd ${root} && npm i`, loading)
    },
    loading: payload => {
      if (payload) {
        if (payload.toString) {
          return payload.toString()
        }
        if (typeof payload === 'string') {
          return payload
        }
      }
      return `Downloading modules to ${yellow(root)}.`
    },
    resolve: () => {
      return `Successfully downloaded modules to ${green(root)}.`
    },
    reject: () => {
      return `Failed to download modules to ${red(root)}.`
    }
  })
}
