export function getErrorMessage(error: any): string | undefined {
  if (error instanceof Error) {
    return error.message
  } else if (error !== undefined || error !== null) {
    return error.toString()
  }
  return undefined
}

export function getErrorCode(error: any): number | undefined {
  if (error instanceof SdinError) {
    return error.code
  }
  return undefined
}

export class SdinError extends Error {
  /** 未捕获的异常 */
  static readonly UNCAUGHT_EXCEPTION = 990001
  /** 未处理的异步错误 */
  static readonly UNHANDLED_REJECTION = 990002

  /** 错误码 */
  readonly code: number

  constructor(code: number, messages: string | string[]) {
    super(Array.isArray(messages) ? messages.join('\n  - ') : messages)
    this.code = code
  }
}

export class SdinUtilsError extends SdinError {
  /** 读取 Git 全局配置失败 */
  static readonly READ_GIT_GLOBAL_CONFIG_FAILED = 990101
  /** 没有 Git 用户配置 */
  static readonly NO_GIT_USER_CONFIG = 990102
  /** Git 用户邮箱格式错误 */
  static readonly GIT_USER_EMAIL_FORMAT_ERROR = 990103
  /** 创建 Git 仓库失败 */
  static readonly CREATE_GIT_REPOSITORY_FAILED = 990104
  /** NPM 包配置文件的内容不是一个对象 */
  static readonly PACKAGE_JSON_CONTENT_IS_NOT_PLAIN_OBJECT = 990105
  /** NPM 包配置文件缺少关键字段 */
  static readonly PACKAGE_JSON_MISSING_REQUIRED_FIELD = 990106
  /** NPM 包名不是小写短横线形式 */
  static readonly PACKAGE_NAME_IS_NOT_KEBAB_CASE = 990107
  /** NPM 包的作者的标注格式不正确  */
  static readonly PACKAGE_AUTHOR_MARK_FORMAT_ERROR = 990108
  /** NPM 包的作者的邮箱格式不正确 */
  static readonly PACKAGE_AUTHOR_EMAIL_FORMAT_ERROR = 990109
  /** NPM 包模块的根目录不存在 */
  static readonly DOWNLOAD_MODULES_ROOT_IS_NOT_EXIST = 990110
  /** NPM 包模块下载失败 */
  static readonly DOWNLOAD_MODULES_FAILED = 990112
  /** 深度读取文件时，入口不存在 */
  static readonly DEEP_READED_FILE_IS_NOT_EXIST = 990113
  /** 编译要导出的 TS 文件时，文件不存在 */
  static readonly READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_IS_NOT_EXIST = 990114
  /** 编译要导出的 TS 文件时，编译失败 */
  static readonly READED_EXPORTS_COMPILED_TYPESCRIPT_FILE_FAILED = 990115
  /** 读取要导出的文件时，文件不存在 */
  static readonly READED_EXPORTS_FILE_IS_NOT_EXIST = 990116
  /** 读取要导出的文件时，读取失败 */
  static readonly READED_EXPORTS_FILE_FAILED = 990117
  /** 没有流可用于管道运输 */
  static readonly STREAM_PIPELINE_NO_SOURCES = 990118
  /** 深度复制失败 */
  static readonly DEEP_COPY_FAILED = 990119
  /** 深度复制文件时，目标文件已存在 */
  static readonly DEEP_COPIED_TARGET_ALREADY_EXISTS = 990120
  /** 找不到根路径 */
  static readonly NOT_HAS_ROOT_PATH = 990121
  /** 找不到 module 路径 */
  static readonly NOT_HAS_MODULE_PATH = 990121
  /** Webpack 编译出错 */
  static readonly WEBPACK_COMPILE_ERROR = 990121
}

export class SdinBusinessError extends SdinError {
  /** 寻找模板失败 */
  static readonly FIND_TEMPLATE_FAILED = 990201
  /** 读取配置文件失败 */
  static readonly READ_CONFIG_FILE_FAILED = 990202
  /** 输入的源码位置不是文件夹 */
  static readonly SRC_IS_NOT_DIRECTORY = 990203
  /** 输入的源码位置不是文件 */
  static readonly SRC_IS_NOT_FILE = 990203
  /** 包依赖错误 */
  static readonly PACKAGE_DEPENDENCE_ABSENT = 990204
  /** 文件名格式不正确 */
  static readonly FILE_NAME_FORMAT_ILLEGAL = 990205
  /** 缺少全局对象名 */
  static readonly ABSENT_GLOBAL_NAME = 990206
  /** 模块名格式不正确 */
  static readonly MODULE_NAME_FORMAT_ILLEGAL = 990207
}
