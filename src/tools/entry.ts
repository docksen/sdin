import { getErrorCode, getErrorMessage } from 'utils/errors'
import { printError } from 'utils/print'

/** 未捕获的异常错误码 */
export const UNCAUGHT_EXCEPTION = 100001

/** 未处理的异步错误码 */
export const UNHANDLED_REJECTION = 100002

process.on('uncaughtException', error => {
  const exitCode = getErrorCode(error) || UNHANDLED_REJECTION
  printError('Uncaught exception.', error, exitCode)
})

process.on('unhandledRejection', reason => {
  const exitCode = getErrorCode(reason) || UNHANDLED_REJECTION
  if (reason instanceof Error) {
    printError('Unhandled rejection.', reason, exitCode)
  } else {
    printError(getErrorMessage(reason), exitCode)
  }
})
