import { set } from 'lodash'
import { resolve } from 'path'
import { pathExists } from 'fs-extra'
import { isEmail } from './check'
import { green, red, printTask, yellow } from './print'
import { execute } from './execute'
import { GitError } from './errors'

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
    configStr = await execute('git config --global --list')
  } catch (err) {
    if (strict) {
      throw new GitError(GitError.READ_GIT_GLOBAL_CONFIG_FAILED, 'Cannot read git global config.')
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
    throw new GitError(GitError.NO_GIT_USER_CONFIG, 'Please config git global user name and email.')
  } else {
    config.userName = config.user.name
    config.userEmail = config.user.email
  }
  if (!isEmail(config.userEmail)) {
    throw new GitError(
      GitError.GIT_USER_EMAIL_FORMAT_ERROR,
      'Git global user email config format error.'
    )
  }
  return config as GitInfo
}

/**
 * 创建git仓库
 */
export async function createGitRepository(root: string): Promise<void> {
  return printTask<any, void>({
    exitCode: GitError.CREATE_GIT_REPOSITORY_FAILED,
    task: async ({ loading }) => {
      if (await pathExists(resolve(root, '.git'))) {
        return
      }
      await execute(
        `cd ${root} && git init && git add . && git commit -m "chore: project is created"`,
        loading
      )
    },
    loading: payload => {
      if (payload) {
        if (typeof payload === 'string') {
          return payload
        }
        if (payload.toString) {
          return payload.toString()
        }
      }
      return `Creating git repository to ${yellow(root)}.`
    },
    resolve: () => {
      return `Successfully created git repository to ${green(root)}.`
    },
    reject: () => {
      return `Failed to create git repository to ${red(root)}.`
    }
  })
}
