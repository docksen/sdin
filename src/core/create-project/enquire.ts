import { resolve } from 'path'
import { readSdinTemplateMetaList } from './template'
import { SdinProjectCreatingOptions } from './create'
import { isEmail, isPackageName, isPackageVersion } from 'util/check'
import { readPackageInfo } from 'util/npm'
import { readGlobalGitInfo } from 'util/git'
import { getRootPath, getWorkPath, withWorkPath } from 'util/path'
import { extraFolderName } from 'tool/string'
import { SdinCreatingError } from 'tool/errors'
import { select, input } from 'util/enquire'
import { prompt } from 'enquirer'
import { camelCase } from 'lodash'

interface SdinCreatingEnquiringOptions {
  templateName?: string
  projectParentPath?: string
  projectName?: string
  projectVersion?: string
  projectDescription?: string
  authorName?: string
  authorEmail?: string
}

export async function enquireSdinCreatingQuestions(
  options: SdinCreatingEnquiringOptions
): Promise<SdinProjectCreatingOptions> {
  const templateMetas = await readSdinTemplateMetaList()
  const templateName = await select({
    key: 'templateName',
    value: options.templateName,
    title: 'which project template do you want to use?',
    options: templateMetas.map(i => ({
      value: i.name,
      label: i.name,
      desc: i.description
    }))
  })
  const templateMeta = templateMetas.find(i => i.name === templateName)
  if (!templateMeta) {
    throw new SdinCreatingError(
      SdinCreatingError.FIND_TEMPLATE_FAILED,
      `Find template ${templateName} failed.`
    )
  }
  const gitInfo = await readGlobalGitInfo()
  const projectParentPath = await input({
    key: 'projectParentPath',
    value: options.projectParentPath,
    preset: getWorkPath(),
    title: 'Where do you want the project to be generated?',
    output: value => withWorkPath(value)
  })
  const projectName = await input({
    key: 'projectName',
    value: options.projectName,
    title: 'What is your project name?',
    validate: isPackageName
  })
  const projectVersion = await input({
    key: 'projectVersion',
    value: options.projectVersion,
    preset: '0.0.1',
    title: 'What is your project version?',
    validate: isPackageVersion
  })
  const projectDescription = await input({
    key: 'projectDescription',
    value: options.projectDescription,
    title: 'What is your project description?'
  })
  const authorName = await input({
    key: 'authorName',
    value: options.authorName,
    preset: gitInfo?.userName,
    title: 'What is your project author name?'
  })
  const authorEmail = await input({
    key: 'authorEmail',
    value: options.authorEmail,
    preset: gitInfo?.userEmail,
    title: 'What is your project author email?',
    validate: isEmail
  })
  let templateParams: Record<string, any> = {}
  if (templateMeta.questions) {
    templateParams = await prompt(templateMeta.questions)
  }
  const projectFolderName = extraFolderName(projectName)
  const projectVariableName = camelCase(projectName)
  const projectPath = resolve(projectParentPath, projectFolderName)
  const packageInfo = readPackageInfo(getRootPath(), true)
  return {
    sdinVersion: packageInfo.version,
    templateName: templateMeta.name,
    templatePath: templateMeta.root,
    templateParams,
    projectParentPath,
    projectFolderName,
    projectVariableName,
    projectPath,
    projectName,
    projectVersion,
    projectDescription,
    authorMark: `${authorName} <${authorEmail}>`,
    authorName,
    authorEmail
  }
}
