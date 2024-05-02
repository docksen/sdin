import { copySdinTemplate } from './template'
import { downloadModulesWithLoading } from 'utils/npm'
import { createGitRepository } from 'utils/git'
import { enquireSdinQuestions } from 'core/enquire'

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
  await copySdinTemplate(answers.templatePath, answers.projectPath, answers)
  await downloadModulesWithLoading(answers.projectPath)
  await createGitRepository(answers.projectPath)
}
