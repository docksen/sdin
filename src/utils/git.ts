import { set } from 'lodash'
import { resolve } from 'path'
import { pathExists } from 'fs-extra'
import { isEmail } from './check'
import { green, printError, printLoading, red } from './print'
import { execute } from './execute'

export interface GitInfo extends Record<string, any> {
  /** 用户名称 */
  userName: string
  /** 用户邮箱 */
  userEmail: string
}

/**
 * 获取git全局配置信息
 */
export async function readGlobalGitInfo(strict: true): Promise<GitInfo>
export async function readGlobalGitInfo(strict?: false): Promise<GitInfo | undefined>
export async function readGlobalGitInfo(strict?: boolean): Promise<GitInfo | undefined> {
  let configStr: string = ''
  try {
    configStr = await execute('git config --global --list', true)
  } catch (err) {
    if (strict) {
      printError(`Cannot read git global config.`, 1058294)
    } else {
      return undefined
    }
  }
  const config: Record<string, any> = {}
  configStr.split('\n').forEach(line => {
    if (line) {
      const flagIndex = line.indexOf('=')
      if (flagIndex > 0) {
        set(config, line.slice(0, flagIndex), line.slice(flagIndex + 1))
      }
    }
  })
  if (!config.user || !config.user.name || !config.user.email) {
    printError('Please config git global user name and email', 9162801)
  } else {
    config.userName = config.user.name
    config.userEmail = config.user.email
  }
  if (!isEmail(config.userEmail)) {
    printError('Git global user email config format error', 5234868)
  }
  return config as GitInfo
}

/**
 * 创建git仓库
 */
export async function createGitRepository(root: string, silence?: boolean) {
  if (await pathExists(resolve(root, '.git'))) {
    return
  }
  await execute(
    `cd ${root} && git init && git add . && git commit -m "chore: project is created"`,
    silence
  )
}

export async function createGitRepositoryWithLoading(
  root: string,
  silence?: boolean
): Promise<void> {
  return printLoading({
    exitCode: 1212339,
    success: `Create git repository to ${green(root)} successfully.`,
    failed: `Failed to create git repository to ${red(root)}.`,
    pendding: () => `Creating git repository to ${root}`,
    task: () => createGitRepository(root, silence)
  })
}
