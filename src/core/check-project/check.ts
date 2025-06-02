import { getDependenceVersion } from 'utils/npm'
import { cyan, printInfo } from 'utils/print'
import { ms2s } from 'utils/unit'
import { deepRead } from 'utils/read'
import { isSdinFileName, FILE_NAME_EXP } from 'tools/check'
import { SdinCheckingError } from 'tools/errors'
import { SdinProject } from 'configs/project'

export interface SdinProjectCheckingOptions {
  project: SdinProject
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
  const { project } = options
  if (!getDependenceVersion(project.pkg, '@babel/runtime')) {
    throw new SdinCheckingError(
      SdinCheckingError.PACKAGE_DEPENDENCE_ABSENT,
      'Please install @babel/runtime dependence.'
    )
  }
}

/**
 * 检查文件名是否符合规范
 */
async function checkFileNames(options: SdinProjectCheckingOptions) {
  const { project } = options
  const fileList: string[] = []
  const checkedCache: Record<string, boolean> = {}
  for (const module of project.modules) {
    await deepRead({
      source: module.src,
      includeDir: true,
      handler: node => {
        if (!checkedCache[node.current] && !isSdinFileName(node.name)) {
          fileList.push(node.current)
        }
        checkedCache[node.current] = true
      }
    })
  }
  if (fileList.length > 0) {
    throw new SdinCheckingError(SdinCheckingError.FILE_NAME_FORMAT_ILLEGAL, [
      `The name of following files does not match expression "${FILE_NAME_EXP}"`,
      ...fileList
    ])
  }
}
