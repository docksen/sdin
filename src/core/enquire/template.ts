import { prompt } from 'enquirer'
import { readdir } from 'fs-extra'
import { resolve } from 'path'
import { asyncMap, filterNotNone } from 'utils/array'
import { withRootPath } from 'utils/path'
import { readExports } from 'utils/read'
import { FunctionParam } from 'utils/declaration'

export const TEMPLATE_LIST_PATH = 'pro/templates'
export const TEMPLATE_CONFIG_FILE_PATH = 'pro/configs/template.ts'

export interface SdinTemplateMeta {
  name: string
  description: string
  questions?: FunctionParam<typeof prompt>
}

export interface SdinTemplateExtraMeta {
  root: string
  name: string
  description: string
  questions?: FunctionParam<typeof prompt>
}

/**
 * 扫描文件夹下的所有模板，返回它们的元信息
 */
export async function readSdinTemplateMetaList(): Promise<SdinTemplateExtraMeta[]> {
  const templatesPath = withRootPath(TEMPLATE_LIST_PATH)
  const files = await readdir(templatesPath)
  const originList = await asyncMap(files, file => {
    return readSdinTemplateMeta(resolve(templatesPath, file))
  })
  return filterNotNone(originList)
}

/**
 * 读取模版的元信息
 */
async function readSdinTemplateMeta(
  templatePath: string
): Promise<SdinTemplateExtraMeta | undefined> {
  const configPath = resolve(templatePath, TEMPLATE_CONFIG_FILE_PATH)
  const templateConfig = await readExports(configPath, true)
  const templateMeta = templateConfig?.sdinTemplateMeta
  if (!templateMeta) {
    return undefined
  }
  return {
    root: templatePath,
    name: templateMeta.name,
    description: templateMeta.description,
    questions: templateMeta.questions
  }
}
