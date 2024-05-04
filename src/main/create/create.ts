import { downloadModulesWithLoading } from 'utils/npm'
import { createGitRepositoryWithLoading } from 'utils/git'
import { TEMPLATE_CONFIG_FILE_PATH, enquireSdinQuestions } from 'core/enquire'
import { deepCopyWithLoading } from 'utils/write'
import { replaceByLodash } from 'utils/string'

export interface CreateSdinProjectOptions {
  templateName?: string
  projectParentPath?: string
  projectName?: string
  projectVersion?: string
  projectDescription?: string
  authorName?: string
  authorEmail?: string
}

export async function createSdinProject(options: CreateSdinProjectOptions): Promise<void> {
  const answers = await enquireSdinQuestions({
    templateName: options.templateName,
    projectParentPath: options.projectParentPath,
    projectName: options.projectName,
    projectVersion: options.projectVersion,
    projectDescription: options.projectDescription,
    authorName: options.authorName,
    authorEmail: options.authorEmail
  })
  await deepCopyWithLoading({
    source: answers.templatePath,
    target: answers.projectPath,
    filter: node => {
      return node.offset !== TEMPLATE_CONFIG_FILE_PATH
    },
    handler: async (_node, content) => {
      return replaceByLodash(content, answers)
    }
  })
  await downloadModulesWithLoading(answers.projectPath, true)
  await createGitRepositoryWithLoading(answers.projectPath, true)
}
