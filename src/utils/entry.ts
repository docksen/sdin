import { SdinError, getErrorCode, getErrorMessage } from './error'
import { printError } from './print'

process.on('uncaughtException', error => {
  const exitCode = getErrorCode(error) || SdinError.UNHANDLED_REJECTION
  printError('Uncaught exception.', error, exitCode)
})

process.on('unhandledRejection', reason => {
  const exitCode = getErrorCode(reason) || SdinError.UNHANDLED_REJECTION
  if (reason instanceof Error) {
    printError('Unhandled rejection.', reason, exitCode)
  } else {
    printError(getErrorMessage(reason) || 'Unhandled rejection.', exitCode)
  }
})
