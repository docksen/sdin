import { SdinError, getErrorCode, getErrorMessage } from './error'
import { printError } from './print'

process.on('uncaughtException', error => {
  const errCode = getErrorCode(error) || SdinError.UNCAUGHT_EXCEPTION
  const errMsg = getErrorMessage(error) || 'Uncaught exception.'
  printError(errMsg, errCode)
})

process.on('unhandledRejection', reason => {
  const errCode = getErrorCode(reason) || SdinError.UNHANDLED_REJECTION
  const errMsg = getErrorMessage(reason) || 'Unhandled rejection.'
  printError(errMsg, errCode)
})
