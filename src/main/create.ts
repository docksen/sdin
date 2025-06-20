import { createSdinProject as createProject } from 'core/create-project'
import { enquireSdinCreatingQuestions } from 'core/create-project'

export type { SdinTemplateMeta } from 'core/create-project'

export interface SdinProjectCreatingOptions {
  /** 模板名称 */
  templateName?: string
  /** 存放项目的文件夹路径（默认：当前工作目录） */
  projectParentPath?: string
  /** 项目名称 */
  projectName?: string
  /** 项目版本号（默认：0.0.1） */
  projectVersion?: string
  /** 项目的描述 */
  projectDescription?: string
  /** 作者姓名（默认：Git 用户名） */
  authorName?: string
  /** 作者邮箱（默认：Git 邮箱） */
  authorEmail?: string
}

export async function createSdinProject(options: SdinProjectCreatingOptions): Promise<void> {
  const answers = await enquireSdinCreatingQuestions({
    templateName: options.templateName,
    projectParentPath: options.projectParentPath,
    projectName: options.projectName,
    projectVersion: options.projectVersion,
    projectDescription: options.projectDescription,
    authorName: options.authorName,
    authorEmail: options.authorEmail
  })
  await createProject(answers)
}
