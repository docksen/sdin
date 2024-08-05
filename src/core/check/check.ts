import { getDependenceVersion } from 'utils/npm'
import { cyan, printInfo } from 'utils/print'
import { SdinConfig } from 'core/config'
import { SdinBusinessError } from 'utils/error'
import { ms2s } from 'utils/unit'
import { deepRead } from 'utils/read'
import { isCodeFileName } from 'utils/check'

export interface SdinProjectCheckingOptions {
  config: SdinConfig
}

export async function checkSdinProject(options: SdinProjectCheckingOptions): Promise<void> {
  const startTime = Date.now()
  await Promise.all([checkDependencies(options), checkFileNames(options)])
  printInfo(`Project files are qualified, checking took ${cyan(ms2s(Date.now() - startTime))} s.`)
}

/**
 * 检查依赖是否符合要求
 */
async function checkDependencies(options: SdinProjectCheckingOptions) {
  const { config } = options
  if (!getDependenceVersion(config.pkg, '@babel/runtime')) {
    throw new SdinBusinessError(
      SdinBusinessError.PACKAGE_DEPENDENCE_ABSENT,
      'Please install @babel/runtime dependence.'
    )
  }
}

/**
 * 检查文件名是否符合规范
 */
async function checkFileNames(options: SdinProjectCheckingOptions) {
  const { config } = options
  const fileList: string[] = []
  const checkedCache: Record<string, boolean> = {}
  for (const module of config.modules) {
    await deepRead({
      source: module.src,
      includeDir: true,
      handler: node => {
        if (!checkedCache[node.current] && !isCodeFileName(node.name)) {
          fileList.push(node.current)
        }
        checkedCache[node.current] = true
      }
    })
  }
  if (fileList.length > 0) {
    throw new SdinBusinessError(SdinBusinessError.FILE_NAME_FORMAT_ILLEGAL, [
      'Please change the following files to kebab-case:',
      ...fileList
    ])
  }
}
