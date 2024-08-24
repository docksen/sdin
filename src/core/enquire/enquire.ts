import { padEnd } from 'lodash'
import { prompt } from 'enquirer'
import { blue } from 'utils/print'
import { isEmail } from 'utils/check'
import { getWorkPath, withWorkPath } from 'utils/path'
import { readGlobalGitInfo } from 'utils/git'
import { readSdinTemplateMetaList } from './template'
import { resolve } from 'path'
import { SdinBusinessError } from 'utils/error'

export interface SdinQuestionsEnquiringOptions {
  templateName?: string
  projectParentPath?: string
  projectName?: string
  projectVersion?: string
  projectDescription?: string
  authorName?: string
  authorEmail?: string
}

export interface SdinQuestionsEnquiringResult extends Record<string, any> {
  templateName: string
  templatePath: string
  projectParentPath: string
  projectFolderName: string
  projectPath: string
  projectName: string
  projectVersion: string
  projectDescription: string
  authorMark: string
  authorName: string
  authorEmail: string
}

export async function enquireSdinQuestions(
  options: SdinQuestionsEnquiringOptions
): Promise<SdinQuestionsEnquiringResult> {
  const templateMetas = await readSdinTemplateMetaList()
  const { templateName } = await prompt<SdinQuestionsEnquiringResult>([
    {
      type: 'select',
      name: 'templateName',
      message: 'which project template do you want to use',
      required: true,
      initial: templateMetas.findIndex(i => i.name === options.templateName) || 0,
      choices: templateMetas.map(item => ({
        name: item.name,
        message: `${blue(padEnd(item.name, 30))} ${item.description}`
      }))
    }
  ])
  const templateMeta = templateMetas.find(i => i.name === templateName)
  if (!templateMeta) {
    throw new SdinBusinessError(
      SdinBusinessError.FIND_TEMPLATE_FAILED,
      `find template ${templateName} failed.`
    )
  }
  const git = await readGlobalGitInfo()
  const data = await prompt<SdinQuestionsEnquiringResult>([
    {
      type: 'input',
      name: 'projectParentPath',
      message: 'Where do you want the project to be generated?',
      required: true,
      initial: options.projectParentPath || getWorkPath(),
      result: value => {
        return withWorkPath(value)
      }
    },
    {
      type: 'input',
      name: 'projectName',
      message: "What's your project name?",
      required: true,
      initial: options.projectName,
      validate: (str: string) => {
        return /^[a-z@][a-z0-9\.\/\_\-]+$/.test(str)
      }
    },
    {
      type: 'input',
      name: 'projectDescription',
      message: "What's your project description?",
      required: true,
      initial: options.projectDescription
    },
    {
      type: 'input',
      name: 'authorName',
      message: "What's your project author name?",
      required: true,
      initial: options.authorName || git?.userName
    },
    {
      type: 'input',
      name: 'authorEmail',
      message: "What's your project author email?",
      required: true,
      initial: options.authorEmail || git?.userEmail,
      validate: isEmail
    }
  ])
  if (templateMeta.questions) {
    const data1 = await prompt(templateMeta.questions)
    Object.assign(data, data1)
  }
  const projectFolderName = data.projectName
    .split(/[^0-9a-z]+/)
    .filter(Boolean)
    .join('_')
  const projectPath = resolve(data.projectParentPath, projectFolderName)
  return Object.assign(data, {
    templatePath: templateMeta.root,
    templateName: templateMeta.name,
    projectPath,
    projectVersion: options.projectVersion || '0.0.1',
    projectFolderName,
    authorMark: `${data.authorName} <${data.authorEmail}>`
  })
}
