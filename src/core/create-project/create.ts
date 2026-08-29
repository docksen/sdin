import { downloadModules } from 'util/npm'
import { createGitRepository } from 'util/git'
import { deepCopyWithLoading } from 'util/write'
import { replaceByLodash } from 'util/string'
import { getPosixPath } from 'util/path'
import { TEMPLATE_CONFIG_FILE_PATH } from './template'

export interface SdinProjectCreatingOptions {
  sdinVersion: string
  templateName: string
  templatePath: string
  templateParams: Record<string, any>
  projectParentPath: string
  projectFolderName: string
  projectVariableName: string
  projectPath: string
  projectName: string
  projectVersion: string
  projectDescription: string
  authorMark: string
  authorName: string
  authorEmail: string
}

export async function createSdinProject(options: SdinProjectCreatingOptions): Promise<void> {
  await deepCopyWithLoading({
    source: options.templatePath,
    target: options.projectPath,
    filter: node => getPosixPath(node.offset) !== TEMPLATE_CONFIG_FILE_PATH,
    handler: async (_node, content) => {
      return replaceByLodash(content, {
        ...options.templateParams,
        ...options
      })
    }
  })
  await downloadModules(options.projectPath)
  await createGitRepository(options.projectPath)
}
