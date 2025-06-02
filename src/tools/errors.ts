import { RuntimeError } from 'utils/errors'

export class SdinBusinessError extends RuntimeError {}

export class SdinCheckingError extends SdinBusinessError {
  /** 包依赖错误 */
  static readonly PACKAGE_DEPENDENCE_ABSENT = 100001001
  /** 文件名称格式不正确 */
  static readonly FILE_NAME_FORMAT_ILLEGAL = 100001002
}

export class SdinConfigError extends SdinBusinessError {
  /** 读取配置文件失败 */
  static readonly READ_CONFIG_FILE_FAILED = 100002001
  /** 缺少全局对象名 */
  static readonly ABSENT_GLOBAL_NAME = 100002002
  /** 模块类型不正确 */
  static readonly MODULE_TYPE_ILLEGAL = 100002003
  /** 缺少必要的依赖包 */
  static readonly ABSENT_PACKAGE_DEPENDENCE = 100002004
  /** 应用页面入口文件不存在 */
  static readonly APP_PAGE_INDEX_IS_NOT_EXIST = 100002005
  /** 模块名称重复 */
  static readonly MODULE_NAME_IS_REPEATED = 100002006
}

export class SdinCreatingError extends SdinBusinessError {
  /** 寻找模板失败 */
  static readonly FIND_TEMPLATE_FAILED = 100003001
}

export class SdinStartingError extends SdinBusinessError {
  /** 缺少可运行的模块 */
  static readonly MISSING_MODULE = 100004001
  /** 监听失败 */
  static readonly LISTENING_FAILED = 100004002
  /** 不支持运行的模块 */
  static readonly UNSUPPORTED_MODULE = 100004003
}

export class SdinBuildingError extends SdinBusinessError {
  /** 编译失败 */
  static readonly COMPILATION_FAILED = 100005001
}

export class SdinTestingError extends SdinBusinessError {
  /** 缺少可运行的模块 */
  static readonly MISSING_MODULE = 100006001
}

export class SdinPlayingError extends SdinBusinessError {
  /** 缺少可运行的模块 */
  static readonly MISSING_MODULE = 100007001
}
