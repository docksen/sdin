import { ExitCode } from './constants'
import { printError } from './print'

process.on('uncaughtException', error => printError(error, ExitCode.UNCAUGHT_EXCEPTION))
process.on('unhandledRejection', reason => printError(reason, ExitCode.UNHANDLED_REJECTION))
