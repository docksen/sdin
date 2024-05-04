import { resolve } from 'path'
import { pathExists } from 'fs-extra'
import { readExports } from './read'
import { green, printError, printLoading, red } from './print'
import { isEmail } from './check'
import { isPlainObject } from 'lodash'
import { execute } from './execute'
import { ExitCode } from './constants'

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
  author: 'unknown <unknown@unknown.site>',
  authorName: 'unknown',
  authorEmail: 'unknown@unknown.site'
}

const PKG_NAME_REG = /^[a-z@][a-z0-9\.\/\_\-]+$/
const PKG_AUTHOR_REG = /^(.+) <(.+)>$/

/**
 * 根据文件夹目录，获取包的信息
 */
export function readPackageInfo(root: string, strict: true): Promise<PackageInfo>
export function readPackageInfo(root: string, strict?: false): Promise<PackageInfo | undefined>
export async function readPackageInfo(
  root: string,
  strict?: boolean
): Promise<PackageInfo | undefined> {
  const filePath = resolve(root, 'package.json')
  const data = await readExports(filePath, strict)
  if (!isPlainObject(data)) {
    if (strict) {
      printError(
        `File ${filePath} exports is not package.json content.`,
        ExitCode.PACKAGE_JSON_CONTENT_IS_NOT_PLAIN_OBJECT
      )
    } else {
      return undefined
    }
  }
  if (!data.name || !data.version || !data.author) {
    printError(
      'package.json must contain "name", "version", "author" fields',
      ExitCode.PACKAGE_JSON_MISSING_REQUIRED_FIELD
    )
  }
  if (!PKG_NAME_REG.test(data.name)) {
    printError('Please change package name to kebab-case', ExitCode.PACKAGE_NAME_IS_NOT_KEBAB_CASE)
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
    const mtd = PKG_AUTHOR_REG.exec(atr)
    if (mtd && mtd.length >= 3) {
      data.authorName = mtd[1]
      data.authorEmail = mtd[2]
    } else {
      printError(
        'Please change author to "name <xxx@xxx.xxx>" in package.json',
        ExitCode.PACKAGE_AUTHOR_MARK_FORMAT_ERROR
      )
    }
  }
  if (!isEmail(data.authorEmail)) {
    printError(
      'Author email format error in package.json',
      ExitCode.PACKAGE_AUTHOR_EMAIL_FORMAT_ERROR
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

export async function downloadModules(root: string, silence?: boolean) {
  if (!(await pathExists(root))) {
    printError(`Folder ${root} is not exist.`, ExitCode.DOWNLOAD_MODULES_ROOT_IS_NOT_EXIST)
  }
  await execute(`cd ${root} && npm i`, silence)
}

export async function downloadModulesWithLoading(root: string, silence?: boolean): Promise<void> {
  return printLoading({
    exitCode: ExitCode.DOWNLOAD_MODULES_FAILED,
    success: `Download modules to ${green(root)} successfully.`,
    failed: `Failed to download modules to ${red(root)}.`,
    pendding: () => `Downloading modules to ${root}`,
    task: () => downloadModules(root, silence)
  })
}
