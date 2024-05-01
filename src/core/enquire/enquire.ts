import { padEnd } from 'lodash'
import { prompt } from 'enquirer'
import { blue, printError } from 'utils/print'
import { isEmail } from 'utils/check'
import { CWD_PATH } from 'utils/path'
import { readGlobalGitInfo } from 'utils/git'
import { readSdinTemplateMetaList } from './template'
import { resolve } from 'path'

export interface EnquireSdinQuestionsOptions {
  templateName?: string
  projectParentPath?: string
  projectName?: string
  projectVersion?: string
  projectDescription?: string
  authorName?: string
  authorEmail?: string
}

export interface EnquireSdinQuestionsResult extends Record<string, any> {
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
  options: EnquireSdinQuestionsOptions
): Promise<EnquireSdinQuestionsResult> {
  const templateMetas = await readSdinTemplateMetaList()
  const { templateName } = await prompt<EnquireSdinQuestionsResult>([
    {
      type: 'select',
      name: 'templateName',
      message: 'which project template do you want to use',
      required: true,
      initial: templateMetas.findIndex(i => i.templateName === options.templateName),
      choices: templateMetas.map(item => ({
        name: item.templateName,
        message: blue(padEnd(item.templateName, 16)) + item.templateDescription
      }))
    }
  ])
  const templateMeta = templateMetas.find(i => i.templateName === templateName)
  if (!templateMeta) {
    printError(`find template ${templateName} failed.`, 4988224)
  }
  const git = await readGlobalGitInfo()
  const data = await prompt<EnquireSdinQuestionsResult>([
    {
      type: 'input',
      name: 'projectParentPath',
      message: 'Where do you want the project to be generated?',
      required: true,
      initial: options.projectParentPath || CWD_PATH
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
    templatePath: templateMeta.templatePath,
    templateName: templateMeta.templateName,
    projectPath,
    projectVersion: options.projectVersion || '0.0.1',
    projectFolderName,
    authorMark: `${data.authorName} <${data.authorEmail}>`
  })
}
