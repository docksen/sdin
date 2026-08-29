export function getErrorMessage(error: any): string | undefined {
  if (error instanceof Error) {
    return error.message
  }
  if (error !== undefined || error !== null) {
    return error.toString()
  }
  return undefined
}

export function getErrorCode(error: any): number | undefined {
  if (error instanceof RuntimeError) {
    return error.code
  }
  return undefined
}

export class RuntimeError extends Error {
  /** 错误码 */
  readonly code: number

  constructor(code: number, messages: string | string[]) {
    super(Array.isArray(messages) ? messages.join('\n  - ') : messages)
    this.code = code
  }
}

export class NpmError extends RuntimeError {
  /** NPM 包配置文件的内容不是一个对象 */
  static readonly PACKAGE_JSON_CONTENT_IS_NOT_PLAIN_OBJECT = 100101
  /** NPM 包配置文件缺少关键字段 */
  static readonly PACKAGE_JSON_MISSING_REQUIRED_FIELD = 100102
  /** NPM 包名不是小写短横线形式 */
  static readonly PACKAGE_NAME_IS_NOT_KEBAB_CASE = 100103
  /** NPM 包的作者的标注格式不正确  */
  static readonly PACKAGE_AUTHOR_MARK_FORMAT_ERROR = 100104
  /** NPM 包的作者的邮箱格式不正确 */
  static readonly PACKAGE_AUTHOR_EMAIL_FORMAT_ERROR = 100105
  /** 找不到根路径 */
  static readonly NOT_HAS_ROOT_PATH = 100106
}
