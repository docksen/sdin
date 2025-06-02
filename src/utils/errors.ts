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

export class GitError extends RuntimeError {
  /** 读取 Git 全局配置失败 */
  static readonly READ_GIT_GLOBAL_CONFIG_FAILED = 100101
  /** 没有 Git 用户配置 */
  static readonly NO_GIT_USER_CONFIG = 100102
  /** Git 用户邮箱格式错误 */
  static readonly GIT_USER_EMAIL_FORMAT_ERROR = 100103
  /** 创建 Git 仓库失败 */
  static readonly CREATE_GIT_REPOSITORY_FAILED = 100104
}

export class NpmError extends RuntimeError {
  /** NPM 包配置文件的内容不是一个对象 */
  static readonly PACKAGE_JSON_CONTENT_IS_NOT_PLAIN_OBJECT = 100201
  /** NPM 包配置文件缺少关键字段 */
  static readonly PACKAGE_JSON_MISSING_REQUIRED_FIELD = 100202
  /** NPM 包名不是小写短横线形式 */
  static readonly PACKAGE_NAME_IS_NOT_KEBAB_CASE = 100203
  /** NPM 包的作者的标注格式不正确  */
  static readonly PACKAGE_AUTHOR_MARK_FORMAT_ERROR = 100204
  /** NPM 包的作者的邮箱格式不正确 */
  static readonly PACKAGE_AUTHOR_EMAIL_FORMAT_ERROR = 100205
  /** NPM 包模块的根目录不存在 */
  static readonly DOWNLOAD_MODULES_ROOT_IS_NOT_EXIST = 100206
  /** NPM 包模块下载失败 */
  static readonly DOWNLOAD_MODULES_FAILED = 100207
  /** 找不到根路径 */
  static readonly NOT_HAS_ROOT_PATH = 100208
}

export class PathError extends RuntimeError {
  /** 找不到 module 路径 */
  static readonly NOT_HAS_MODULE_PATH = 100301
  /** 文件夹不存在 */
  static readonly DIR_IS_NOT_EXIST = 100302
  /** 文件不存在 */
  static readonly FILE_IS_NOT_EXIST = 100303
}

export class ReadingError extends RuntimeError {
  /** 深度读取文件时，入口不存在 */
  static readonly DEEP_READED_FILE_IS_NOT_EXIST = 100401
  /** 读取要导出的文件时，文件不存在 */
  static readonly READED_EXPORTS_FILE_IS_NOT_EXIST = 100402
  /** 读取要导出的文件时，读取失败 */
  static readonly READED_EXPORTS_FILE_FAILED = 100403
}

export class SteamError extends RuntimeError {
  /** 没有流可用于管道运输 */
  static readonly STREAM_PIPELINE_NO_SOURCES = 100501
}

export class WritingError extends RuntimeError {
  /** 深度复制失败 */
  static readonly DEEP_COPY_FAILED = 100601
  /** 深度复制文件时，目标文件已存在 */
  static readonly DEEP_COPIED_TARGET_ALREADY_EXISTS = 100602
}

export class EnquiringError extends RuntimeError {
  /** 单选选项为空 */
  static readonly SELECTING_OPTIONS_EMPTY = 100701
}

export class CheckingError extends RuntimeError {
  /** 与正则表达式不匹配 */
  static readonly MISMATCH_REG_EXP = 100801
}
