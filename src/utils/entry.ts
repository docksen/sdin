import { printError } from './print'

process.on('uncaughtException', error => printError(error, 9990001))
process.on('unhandledRejection', reason => printError(reason, 9990002))
