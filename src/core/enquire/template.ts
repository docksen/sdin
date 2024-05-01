import { prompt } from 'enquirer'
import { readdir } from 'fs-extra'
import { resolve } from 'path'
import { SELF_PATH } from 'utils/path'
import { readExports } from 'utils/read'
import { FunctionParam } from 'utils/types'

export const TEMPLATE_LIST_PATH = 'pro/templates'
export const TEMPLATE_META_FILE_PATH = 'pro/configs/template.ts'

export interface SdinTemplateMeta {
  templateName: string
  templateDescription: string
  questions: FunctionParam<typeof prompt>
}

export interface SdinTemplateMeta2 extends SdinTemplateMeta {
  templatePath: string
}

/**
 * 扫描文件夹下的所有模板，返回它们的元信息
 */
export async function readSdinTemplateMetaList(): Promise<SdinTemplateMeta2[]> {
  const templatesPath = resolve(SELF_PATH, TEMPLATE_LIST_PATH)
  const files = await readdir(templatesPath)
  const metaList: any[] = []
  for (let i = 0; i < files.length; i++) {
    const templatePath = resolve(templatesPath, files[i])
    const meta = await readSdinTemplateMeta(templatePath)
    if (meta) {
      metaList.push({
        templatePath,
        ...meta
      })
    }
  }
  return metaList
}

/**
 * 读取模版的元信息
 */
async function readSdinTemplateMeta(source: string): Promise<SdinTemplateMeta> {
  const metaPath = resolve(source, TEMPLATE_META_FILE_PATH)
  const metaExports = await readExports(metaPath, true)
  return metaExports?.sdinTemplateMeta
}
