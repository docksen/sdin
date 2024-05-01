import { copySdinTemplate } from './template'
import { downloadModules } from 'utils/npm'
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
  downloadModules(answers.projectPath)
  createGitRepository(answers.projectPath)
}
