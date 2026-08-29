import { prompt } from 'enquirer'
import { readdir } from 'fs-extra'
import { resolve } from 'path'
import { asyncMap, filterNotNone } from 'util/array'
import { withRootPath } from 'util/path'
import { readExports } from 'util/read'
import { FunctionParam } from 'util/declaration'

export const TEMPLATE_FOLDER_PATH = 'pro/template'
export const TEMPLATE_CONFIG_FILE_PATH = 'pro/config/template.ts'

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
  const templatePath = withRootPath(TEMPLATE_FOLDER_PATH)
  const files = await readdir(templatePath)
  const originList = await asyncMap(files, file => {
    return readSdinTemplateMeta(resolve(templatePath, file))
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
